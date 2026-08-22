"""Cross-checks live AWS resources against Terraform state across every environment.

Flags orphans (AWS resources with no matching Terraform state entry) and stale
state (Terraform state entries whose AWS resource no longer exists) - the class
of drift that let terraform/environments/ollama silently diverge from what was
actually running.
"""

import argparse
import json
import subprocess
import sys

import os
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

TF_ENVIRONMENTS = ["bootstrap", "dev", "demo"]

AWS_REGION = "us-east-1"
NAME_PREFIX = "sat-exam"
SNS_TOPIC_ARN = "arn:aws:sns:us-east-1:618079239197:realtor-ui-alerts"


def run_json(cmd):
    try:
        out = subprocess.check_output(cmd, text=True, stderr=subprocess.DEVNULL)
        return json.loads(out) if out.strip() else None
    except subprocess.CalledProcessError:
        return None


def tf_state_ids(env):
    env_dir = f"{REPO_ROOT}/terraform/environments/{env}"
    try:
        subprocess.run(
            ["terraform", "state", "list"],
            cwd=env_dir,
            capture_output=True,
            text=True,
            check=True,
        )
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        print(f"Warning: Failed to read terraform state in '{env}' (perhaps 'terraform init' needs to be run?). Treating as 0 resources.", file=sys.stderr)
        return {}

    show = run_json(["terraform", "-chdir=" + env_dir, "show", "-json"])
    if not show:
        return {}

    ids = {}
    for module in [show.get("values", {}).get("root_module", {})]:
        for resource in module.get("resources", []):
            rid = resource.get("values", {}).get("id")
            address = resource.get("address")
            if rid and address:
                ids[rid] = address
    return ids


def aws_ec2_instances():
    data = run_json(
        [
            "aws", "ec2", "describe-instances",
            "--region", AWS_REGION,
            "--filters", "Name=instance-state-name,Values=pending,running,stopping,stopped",
            "--output", "json",
        ]
    )
    if not data:
        return []
    instances = []
    for reservation in data.get("Reservations", []):
        for inst in reservation.get("Instances", []):
            name = next(
                (t["Value"] for t in inst.get("Tags", []) if t["Key"] == "Name"), ""
            )
            instances.append(
                {
                    "type": "aws_instance",
                    "id": inst["InstanceId"],
                    "name": name,
                    "state": inst["State"]["Name"],
                }
            )
    return [i for i in instances if NAME_PREFIX in i["name"]]


def aws_vpcs():
    data = run_json(
        [
            "aws", "ec2", "describe-vpcs",
            "--region", AWS_REGION,
            "--output", "json",
        ]
    )
    if not data:
        return []
    vpcs = []
    for vpc in data.get("Vpcs", []):
        name = next((t["Value"] for t in vpc.get("Tags", []) if t["Key"] == "Name"), "")
        if NAME_PREFIX in name:
            vpcs.append({"type": "aws_vpc", "id": vpc["VpcId"], "name": name, "state": vpc["State"]})
    return vpcs


def aws_s3_buckets():
    data = run_json(["aws", "s3api", "list-buckets", "--output", "json"])
    if not data:
        return []
    return [
        {"type": "aws_s3_bucket", "id": b["Name"], "name": b["Name"], "state": "exists"}
        for b in data.get("Buckets", [])
        if NAME_PREFIX in b["Name"]
    ]


def aws_dynamodb_tables():
    data = run_json(["aws", "dynamodb", "list-tables", "--region", AWS_REGION, "--output", "json"])
    if not data:
        return []
    return [
        {"type": "aws_dynamodb_table", "id": t, "name": t, "state": "exists"}
        for t in data.get("TableNames", [])
        if NAME_PREFIX in t
    ]


def publish_report(subject, body):
    subprocess.run(
        [
            "aws", "sns", "publish",
            "--topic-arn", SNS_TOPIC_ARN,
            "--region", AWS_REGION,
            "--subject", subject,
            "--message", body,
        ],
        check=True,
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--notify", action="store_true",
        help=f"Publish the report to {SNS_TOPIC_ARN}",
    )
    args = parser.parse_args()

    lines = [f"SAT_Exams inventory - {AWS_REGION}\n"]

    state_ids_by_env = {env: tf_state_ids(env) for env in TF_ENVIRONMENTS}
    all_state_ids = set()
    for ids in state_ids_by_env.values():
        all_state_ids.update(ids.keys())

    for env, ids in state_ids_by_env.items():
        lines.append(f"[terraform] {env}: {len(ids)} resources in state")
        if ids:
            for rid, address in sorted(ids.items(), key=lambda item: item[1]):
                lines.append(f"  - {address}")

    live_resources = (
        aws_ec2_instances() + aws_vpcs() + aws_s3_buckets() + aws_dynamodb_tables()
    )

    lines.append(f"\n[aws] {len(live_resources)} live resources matching '{NAME_PREFIX}*'\n")

    orphans = []
    for res in live_resources:
        tracked = res["id"] in all_state_ids
        owner = next((env for env, ids in state_ids_by_env.items() if res["id"] in ids), None)
        marker = f"tracked by {owner}" if tracked else "ORPHAN - no terraform state owns this"
        lines.append(f"  {res['type']:<22} {res['id']:<24} {res['state']:<10} {res['name']:<35} {marker}")
        if not tracked:
            orphans.append(res)

    if orphans:
        lines.append(f"\n{len(orphans)} orphaned resource(s) found - live in AWS but untracked by any Terraform state.")
    else:
        lines.append("\nNo orphans found - every live resource is tracked by some Terraform state.")

    report = "\n".join(lines)
    print(report)

    if args.notify:
        subject = f"SAT_Exams inventory - {len(orphans)} orphan(s)" if orphans else "SAT_Exams inventory - clean"
        publish_report(subject, report)
        print(f"\nPublished report to {SNS_TOPIC_ARN}")

    if orphans:
        sys.exit(1)


if __name__ == "__main__":
    main()

"""Reports month-to-date AWS spend by service and flags budget risk.

Companion to tf_inventory.py: same report/--notify pattern, but for cost
instead of resource drift. MONTHLY_BUDGET_USD mirrors the $100 cap in
terraform/environments/dev/main.tf's aws_budgets_budget.cost_cap.
"""

import argparse
import datetime
import json
import subprocess
import sys

AWS_REGION = "us-east-1"
NAME_PREFIX = "sat-exam"
SNS_TOPIC_ARN = "arn:aws:sns:us-east-1:618079239197:realtor-ui-alerts"

MONTHLY_BUDGET_USD = 100.0
WARN_PCT = 50.0
CRITICAL_PCT = 90.0

# On-demand hourly rate, us-east-1 (used only for a live burn-rate estimate -
# Cost Explorer data lags ~24h behind actual spend).
INSTANCE_HOURLY_RATES = {
    "g4dn.xlarge": 0.526,
}


def run_json(cmd):
    try:
        out = subprocess.check_output(cmd, text=True, stderr=subprocess.DEVNULL)
        return json.loads(out) if out.strip() else None
    except subprocess.CalledProcessError:
        return None


def month_to_date_cost_by_service():
    today = datetime.date.today()
    start = today.replace(day=1)
    end = today + datetime.timedelta(days=1)  # CE end date is exclusive

    data = run_json(
        [
            "aws", "ce", "get-cost-and-usage",
            "--time-period", f"Start={start.isoformat()},End={end.isoformat()}",
            "--granularity", "MONTHLY",
            "--metrics", "UnblendedCost",
            "--group-by", "Type=DIMENSION,Key=SERVICE", "Type=DIMENSION,Key=USAGE_TYPE",
            "--region", AWS_REGION,
            "--output", "json",
        ]
    )
    if not data:
        return {}, 0.0

    by_service = {}
    for result in data.get("ResultsByTime", []):
        for group in result.get("Groups", []):
            service, usage_type = group["Keys"]
            amount = float(group["Metrics"]["UnblendedCost"]["Amount"])
            if amount > 0:
                by_service.setdefault(service, {})
                by_service[service][usage_type] = by_service[service].get(usage_type, 0.0) + amount

    total = sum(amount for usage_types in by_service.values() for amount in usage_types.values())
    return by_service, total


def live_instance_burn():
    data = run_json(
        [
            "aws", "ec2", "describe-instances",
            "--region", AWS_REGION,
            "--filters", "Name=instance-state-name,Values=running",
            "--output", "json",
        ]
    )
    if not data:
        return []

    now = datetime.datetime.now(datetime.timezone.utc)
    burns = []
    for reservation in data.get("Reservations", []):
        for inst in reservation.get("Instances", []):
            name = next(
                (t["Value"] for t in inst.get("Tags", []) if t["Key"] == "Name"), ""
            )
            if NAME_PREFIX not in name:
                continue
            itype = inst["InstanceType"]
            rate = INSTANCE_HOURLY_RATES.get(itype)
            if rate is None:
                continue
            launch_time = datetime.datetime.fromisoformat(inst["LaunchTime"])
            hours = (now - launch_time).total_seconds() / 3600
            burns.append(
                {
                    "id": inst["InstanceId"],
                    "name": name,
                    "type": itype,
                    "hours": hours,
                    "rate": rate,
                    "estimated_cost": hours * rate,
                }
            )
    return burns


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

    lines = [f"SAT_Exams cost report - {AWS_REGION}\n"]

    by_service, total = month_to_date_cost_by_service()
    pct_of_budget = (total / MONTHLY_BUDGET_USD) * 100 if MONTHLY_BUDGET_USD else 0.0

    lines.append(f"Month-to-date spend: ${total:.2f} of ${MONTHLY_BUDGET_USD:.2f} budget ({pct_of_budget:.1f}%)\n")
    service_totals = {s: sum(u.values()) for s, u in by_service.items()}
    for service, service_total in sorted(service_totals.items(), key=lambda kv: kv[1], reverse=True):
        if service_total < 0.01:
            continue
        lines.append(f"  {service:<40} ${service_total:.2f}")
        for usage_type, amount in sorted(by_service[service].items(), key=lambda kv: kv[1], reverse=True):
            if amount >= 0.01:
                lines.append(f"      {usage_type:<38} ${amount:.2f}")

    lines.append(
        "\n  VPC / subnets / security groups / Internet Gateway  $0.00 "
        "(no charge for this topology - only NAT/VPN/Transit Gateway or idle EIPs bill)"
    )

    burns = live_instance_burn()
    if burns:
        lines.append("\nLive instance burn (Cost Explorer lags ~24h behind actual spend):")
        for b in burns:
            lines.append(
                f"  {b['id']:<24} {b['type']:<14} {b['hours']:.1f}h running  "
                f"~${b['estimated_cost']:.2f} so far (${b['rate']}/h)"
            )

    if pct_of_budget >= CRITICAL_PCT:
        lines.append(f"\nCRITICAL: {pct_of_budget:.1f}% of monthly budget consumed.")
    elif pct_of_budget >= WARN_PCT:
        lines.append(f"\nWARNING: {pct_of_budget:.1f}% of monthly budget consumed.")
    else:
        lines.append(f"\nWithin budget: {pct_of_budget:.1f}% of monthly budget consumed.")

    report = "\n".join(lines)
    print(report)

    if args.notify:
        if pct_of_budget >= CRITICAL_PCT:
            subject = f"SAT_Exams cost - CRITICAL {pct_of_budget:.0f}% of budget"
        elif pct_of_budget >= WARN_PCT:
            subject = f"SAT_Exams cost - WARNING {pct_of_budget:.0f}% of budget"
        else:
            subject = f"SAT_Exams cost - {pct_of_budget:.0f}% of budget"
        publish_report(subject, report)
        print(f"\nPublished report to {SNS_TOPIC_ARN}")

    if pct_of_budget >= CRITICAL_PCT:
        sys.exit(1)


if __name__ == "__main__":
    main()

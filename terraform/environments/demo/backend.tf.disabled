terraform {
  backend "s3" {
    # Replace these with your actual demo state bucket and dynamodb table names
    bucket         = "sat-terraform-state-demo-placeholder"
    key            = "demo/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "sat-terraform-locks-demo-placeholder"
  }
}

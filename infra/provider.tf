provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "taskflow-api"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

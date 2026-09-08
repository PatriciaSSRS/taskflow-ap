variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (used in tags and resource names)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Prefix for resource names"
  type        = string
  default     = "taskflow"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public subnet (application server)"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for the private subnets (database). RDS requires two AZs."
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "instance_type" {
  description = "EC2 instance type for the API server"
  type        = string
  default     = "t3.micro"
}

variable "ssh_allowed_cidr" {
  description = "CIDR allowed to reach SSH (port 22). Restrict this to your own IP."
  type        = string
  default     = "0.0.0.0/0"
}

variable "key_pair_name" {
  description = "Name of an existing EC2 key pair for SSH access. Leave empty to launch without one."
  type        = string
  default     = ""
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "Initial database name"
  type        = string
  default     = "taskflow"
}

variable "db_username" {
  description = "Master username for RDS"
  type        = string
  default     = "taskflow"
}

variable "db_password" {
  description = "Master password for RDS. Provide via TF_VAR_db_password - never commit it."
  type        = string
  sensitive   = true
}

variable "app_image" {
  description = "Docker image reference for the API, pulled by the EC2 user-data script"
  type        = string
  default     = "ghcr.io/patriciassrs/taskflow-ap:latest"
}

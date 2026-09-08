output "app_public_ip" {
  description = "Elastic IP address of the API server"
  value       = aws_eip.app.public_ip
}

output "app_url" {
  description = "Base URL of the API"
  value       = "http://${aws_eip.app.public_ip}"
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint (host)"
  value       = aws_db_instance.postgres.address
}

output "vpc_id" {
  description = "ID of the created VPC"
  value       = aws_vpc.main.id
}

# Infraestrutura como Código — TaskFlow API (Terraform)

Scripts Terraform que provisionam, na AWS, toda a infraestrutura necessária para
rodar a API:

| Recurso | Arquivo | Descrição |
|---|---|---|
| VPC + Internet Gateway | `network.tf` | Rede isolada `10.0.0.0/16` |
| Subnet pública | `network.tf` | Hospeda a aplicação (EC2 + Elastic IP) |
| Subnets privadas (2 AZs) | `network.tf` | Hospedam o banco de dados (RDS exige 2 AZs) |
| Security group da aplicação | `security_groups.tf` | Libera apenas 22, 80 e 443 |
| Security group do banco | `security_groups.tf` | Libera 5432 apenas a partir do SG da aplicação |
| EC2 `t3.micro` | `ec2.tf` | Ubuntu 22.04, instala Docker e sobe o container da API via `user_data.sh` |
| Elastic IP | `ec2.tf` | Endereço fixo para a aplicação |
| RDS PostgreSQL `db.t3.micro` | `rds.tf` | Banco gerenciado, criptografado, sem acesso público |

## Pré-requisitos

- [Terraform](https://developer.hashicorp.com/terraform/downloads) >= 1.5
- Credenciais AWS configuradas (`aws configure` ou variáveis de ambiente)

## Uso

```bash
cd infra

# 1. Copie o arquivo de variáveis e ajuste
cp terraform.tfvars.example terraform.tfvars

# 2. Informe a senha do banco por variável de ambiente (nunca em arquivo versionado)
export TF_VAR_db_password="uma-senha-forte"

# 3. Inicialize, planeje e aplique
terraform init
terraform plan
terraform apply

# 4. Ao final, os outputs mostram o IP público e o endpoint do RDS
terraform output

# Para destruir tudo
terraform destroy
```

## Sobre o estado do Terraform

Este projeto usa o **backend local** por padrão. O arquivo `terraform.tfstate`
**não** é versionado (veja `.gitignore`) porque pode conter valores sensíveis
(ex.: senha do RDS).

Para um cenário real/colaborativo, recomenda-se um **backend remoto** com
bloqueio de estado, por exemplo S3 + DynamoDB:

```hcl
terraform {
  backend "s3" {
    bucket         = "taskflow-tfstate"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "taskflow-tflock"
    encrypt        = true
  }
}
```

## Segredos e variáveis

Nenhuma credencial é versionada. Em produção, as variáveis sensíveis
(`TF_VAR_db_password`, chaves AWS) vêm de **secrets do GitHub Actions** ou de um
gerenciador de segredos.

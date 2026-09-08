# Documentação de Planejamento — TaskFlow API

> DevOps na Prática — Fase 1: Configuração e Automação Inicial
> Estudante: Patricia dos Santos Silva

## a) Descrição do projeto, objetivos e requisitos

**Descrição.** A TaskFlow API é uma API REST para gerenciamento de tarefas
(to-do list), permitindo criar, organizar e acompanhar tarefas por status
(*a fazer*, *em andamento*, *concluída*) e por prioridade (*baixa*, *média*,
*alta*).

**Objetivos.** Praticar um fluxo DevOps completo, da integração contínua ao
provisionamento de infraestrutura como código, entregando uma API estável,
testada automaticamente e com ambiente reproduzível via containers.

**Requisitos funcionais.**

- CRUD de tarefas e de usuários.
- Autenticação via JWT.
- Filtros de listagem por status e prioridade.

**Requisitos não funcionais.**

- Cobertura de testes automatizados.
- Pipeline de CI executado a cada push e pull request.
- Infraestrutura provisionada de forma automatizada via Terraform.

## b) Plano de Integração Contínua

- **Ferramenta:** GitHub Actions.
- **Gatilho:** cada `push` e cada `pull request` aberta contra a branch `main`.
- **Etapas do pipeline:**
  1. Checkout do código.
  2. Instalação das dependências com `npm ci`.
  3. Lint com ESLint.
  4. Execução dos testes automatizados com Jest e geração do relatório de
     cobertura.
  5. Build da aplicação e da imagem Docker.
- **Critério de sucesso:** o pipeline só é aprovado se lint, testes e build
  passarem sem erros. Falhas bloqueiam o merge da pull request (branch
  protection na `main`).

## c) Especificação detalhada da infraestrutura

- **Containers:** aplicação e banco de dados executam em containers Docker,
  orquestrados localmente via Docker Compose.
- **Banco de dados:** PostgreSQL, provisionado como instância gerenciada
  (Amazon RDS).
- **Servidor de aplicação:** instância EC2 `t3.micro` rodando a imagem Docker
  da API.
- **Rede:** VPC com subnet pública para a API e subnets privadas para o banco,
  com security groups liberando apenas as portas necessárias (22, 80, 443 para
  a aplicação; 5432 apenas do SG da aplicação para o banco).
- **Segredos e variáveis:** credenciais e variáveis sensíveis gerenciadas via
  secrets do GitHub Actions e `TF_VAR_*`, nunca versionadas no repositório.
- **Provisionamento:** 100% automatizado via Terraform (pasta [`infra/`](../infra)).

## Repositório

<https://github.com/PatriciaSSRS/taskflow-api>

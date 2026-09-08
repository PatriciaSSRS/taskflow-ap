# TaskFlow API

API REST para gerenciamento de tarefas (to-do list). Projeto da disciplina
**DevOps na Prática — Fase 1: Configuração e Automação Inicial** (PUCRS Online).

Permite criar, organizar e acompanhar tarefas por **status** (`a_fazer`,
`em_andamento`, `concluida`) e **prioridade** (`baixa`, `media`, `alta`), com
autenticação via **JWT**.

## Stack

| Camada | Tecnologia |
|---|---|
| Linguagem / runtime | Node.js 20 |
| Framework HTTP | Express |
| Banco de dados | PostgreSQL |
| Autenticação | JSON Web Token (`jsonwebtoken`) + `bcryptjs` |
| Validação | `zod` |
| Testes | Jest + Supertest |
| Lint | ESLint |
| Containers | Docker + Docker Compose |
| CI | GitHub Actions |
| IaC | Terraform (AWS) |

## Estrutura do repositório

```
.
├── .github/workflows/ci.yml   # Pipeline de Integração Contínua
├── src/                       # Código-fonte da API
│   ├── config/                # Configuração via variáveis de ambiente
│   ├── db/                    # Pool de conexão + migrations
│   ├── middleware/            # Autenticação, validação, tratamento de erros
│   ├── repositories/          # Acesso ao banco (SQL)
│   ├── services/              # Regras de negócio
│   ├── controllers/           # Camada HTTP
│   ├── routes/                # Definição das rotas
│   ├── validation/            # Schemas de validação (zod)
│   ├── app.js                 # Instância do Express
│   └── server.js              # Bootstrap (migra + sobe o servidor)
├── test/                      # Testes automatizados
│   ├── unit/                  # Testes unitários (sem I/O)
│   └── integration/           # Testes de API (Supertest + PostgreSQL)
├── infra/                     # Scripts Terraform (AWS)
├── docs/                      # Documentação de planejamento
├── Dockerfile
└── docker-compose.yml
```

## Primeiro setup (obrigatório antes do primeiro push)

O pipeline usa `npm ci`, que exige o `package-lock.json` versionado. Gere-o uma
única vez (em qualquer máquina com Node 20) e faça commit:

```bash
npm install        # cria package-lock.json e node_modules/
git add package-lock.json
git commit -m "chore: adiciona package-lock.json"
```

## Como executar

### Opção 1 — Docker Compose (recomendado)

```bash
docker compose up --build
# API em http://localhost:3000  |  Health check: http://localhost:3000/health
```

### Opção 2 — Local

Pré-requisitos: Node.js 20 e um PostgreSQL acessível.

```bash
cp .env.example .env          # ajuste DATABASE_URL e JWT_SECRET
npm install
npm run migrate               # cria as tabelas
npm start
```

Para subir apenas o banco via Docker:

```bash
docker compose up -d db
```

## Testes automatizados

Os testes de integração precisam de um PostgreSQL acessível
(`docker compose up -d db` resolve localmente).

```bash
npm test                 # roda todos os testes
npm run test:coverage    # roda os testes e gera o relatório de cobertura em coverage/
npm run lint             # ESLint
```

No CI, o PostgreSQL é fornecido por um *service container* e a variável
`DATABASE_URL` aponta para o banco `taskflow_test`.

## Endpoints

Base: `/api`

### Autenticação

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/register` | Cria um usuário (`name`, `email`, `password`) |
| `POST` | `/auth/login` | Autentica e retorna `{ token }` |

### Usuários (requer `Authorization: Bearer <token>`)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/users/me` | Dados do usuário autenticado |
| `GET` | `/users/:id` | Busca usuário por id |
| `PUT` | `/users/:id` | Atualiza a própria conta |
| `DELETE` | `/users/:id` | Remove a própria conta |

### Tarefas (requer `Authorization: Bearer <token>`)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/tasks?status=&priority=` | Lista as tarefas do usuário, com filtros opcionais |
| `POST` | `/tasks` | Cria uma tarefa (`title`, `description?`, `status?`, `priority?`) |
| `GET` | `/tasks/:id` | Detalha uma tarefa |
| `PUT` | `/tasks/:id` | Atualiza uma tarefa |
| `DELETE` | `/tasks/:id` | Remove uma tarefa |

### Exemplo

```bash
# Registro
curl -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ana","email":"ana@example.com","password":"supersecret"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"ana@example.com","password":"supersecret"}' | jq -r .token)

# Criar tarefa
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"title":"Estudar Terraform","priority":"alta"}'

# Listar tarefas concluídas
curl "http://localhost:3000/api/tasks?status=concluida" \
  -H "Authorization: Bearer $TOKEN"
```

## Pipeline de CI

Arquivo: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

Disparado a cada `push` e `pull request` contra a `main`. Jobs:

1. **build-and-test** — checkout, `npm ci`, `npm run lint` (ESLint),
   `npm run test:coverage` (Jest + cobertura) contra um PostgreSQL de serviço,
   e upload do relatório de cobertura como artefato.
2. **docker-build** — build da imagem Docker da aplicação.

O merge na `main` só é liberado quando todos os checks passam (branch
protection configurada no GitHub).

## Infraestrutura como Código

Pasta [`infra/`](infra) — scripts Terraform que provisionam na AWS: VPC com
subnets pública e privadas, security groups (22, 80, 443), EC2 `t3.micro` com
Docker, Elastic IP e RDS PostgreSQL. Instruções em
[`infra/README.md`](infra/README.md).

## Licença

MIT — veja [`LICENSE`](LICENSE).

# Proteção da branch `main`

Configuração feita em **GitHub → Settings → Branches → Branch protection rules**
para o padrão `main`:

- [x] **Require a pull request before merging**
  - [x] Require approvals: 1
- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
  - Checks obrigatórios:
    - `build-and-test` (Lint, Test & Coverage)
    - `docker-build` (Build Docker image)
- [x] **Do not allow bypassing the above settings**
- [x] **Block force pushes**

Com isso, nenhum commit entra na `main` sem uma pull request cujo pipeline de
CI (`.github/workflows/ci.yml`) tenha passado — lint, testes e build.

> Os nomes dos checks aparecem na lista de "status checks" somente após a
> primeira execução do workflow. Abra uma PR inicial para que o GitHub liste os
> checks e então marque-os como obrigatórios.

# Migrations — ServiceLink

Scripts SQL organizados em ordem de execução para o banco de dados local (PostgreSQL puro) e para o Supabase Cloud.

## Estrutura

```
migrations/
├── 001_create_schema.sql   # Tabelas, enums, índices, triggers
└── 002_seed_data.sql       # Dados de teste (usuários, serviços, bookings)
```

## Diferenças: Local vs. Supabase Cloud

| Recurso              | Local (PostgreSQL)            | Supabase Cloud              |
|----------------------|-------------------------------|-----------------------------|
| Autenticação         | `public.users` (local)        | `auth.users` (gerenciado)   |
| RLS / `auth.uid()`   | Não disponível nativamente    | Disponível                  |
| Storage              | Não disponível                | `storage.buckets/objects`   |
| Trigger de signup    | `on_user_created` em `public.users` | `on_auth_user_created` em `auth.users` |

## Pré-requisitos

- PostgreSQL 14+ rodando localmente na porta 5432
- Credenciais configuradas no `.env` (copie `.env.example`)

## Executar as migrations

```bash
# 1. Copiar template de variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais locais

# 2. Executar schema (tabelas, triggers, índices)
psql -U postgres -d servicelink -f migrations/001_create_schema.sql

# 3. Popular com dados de teste
psql -U postgres -d servicelink -f migrations/002_seed_data.sql
```

Ou em uma linha só:
```bash
psql postgresql://postgres:SUA_SENHA@localhost:5432/servicelink \
  -f migrations/001_create_schema.sql \
  -f migrations/002_seed_data.sql
```

## Contas de teste (após seed)

| Role      | Email                  | Senha         |
|-----------|------------------------|---------------|
| Cliente   | cliente@test.com       | Cliente123!   |
| Prestador | prestador@test.com     | Prestador123! |

## Adicionando novas migrations

Siga a convenção de numeração sequencial:
- `003_add_messages_table.sql`
- `004_add_payment_methods.sql`

Cada arquivo deve ser idempotente (use `IF NOT EXISTS`, `ON CONFLICT DO NOTHING`, `CREATE OR REPLACE`).

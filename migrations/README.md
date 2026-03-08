# Migrations — ServiceLink

Scripts SQL organizados em ordem de execução para o banco de dados local (PostgreSQL puro) e para o Supabase Cloud.

## Estrutura atual

```
migrations/
├── 001_create_schema.sql               # Tabelas, enums, índices, triggers (Sprint 0)
├── 002_seed_data.sql                   # Dados de teste: usuários, serviços, bookings (Sprint 0)
├── 003_add_constraints_and_privacy.sql # Trigger de review, campos is_available / coverage_radius_km / push_token (Sprint 0)
├── 004_add_messages.sql                # Tabela messages + RLS + Realtime (Sprint 5)
└── 005_add_payments.sql                # Tabelas payment_methods e payments (Sprint 6)
```

## O que cada migration adiciona

| Arquivo | Conteúdo |
|---------|----------|
| `001` | `profiles`, `services`, `bookings`, `reviews`, triggers de `updated_at`, trigger `on_user_created` |
| `002` | Seed de usuários de teste (cliente + prestador), serviços de exemplo, bookings e reviews |
| `003` | Trigger que bloqueia review em booking não-`completed`; `UNIQUE` por booking em reviews; colunas `is_available`, `coverage_radius_km`, `push_token` em `profiles` |
| `004` | Tabela `messages` com RLS (apenas client/provider do booking), índices, instruções de Realtime |
| `005` | Tabela `payment_methods` (cartões mascarados por usuário, unique default por user); tabela `payments` (status, gateway, referência) |

## Diferenças: Local vs. Supabase Cloud

| Recurso              | Local (PostgreSQL)                        | Supabase Cloud              |
|----------------------|-------------------------------------------|-----------------------------|
| Autenticação         | `public.users` (local)                    | `auth.users` (gerenciado)   |
| RLS / `auth.uid()`   | Não disponível nativamente                | Disponível                  |
| Storage              | Não disponível                            | `storage.buckets/objects`   |
| Trigger de signup    | `on_user_created` em `public.users`       | `on_auth_user_created` em `auth.users` |
| RLS em `payments`    | Comentado no arquivo (não aplicável)      | Descomentar antes de aplicar |

## Pré-requisitos

- PostgreSQL 14+ rodando localmente na porta 5432
- Credenciais configuradas no `.env` (copie `.env.example`)

## Executar as migrations (ordem obrigatória)

```bash
# 1. Copiar template de variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais locais

# 2. Executar todas em sequência
psql -U postgres -d servicelink \
  -f migrations/001_create_schema.sql \
  -f migrations/002_seed_data.sql \
  -f migrations/003_add_constraints_and_privacy.sql \
  -f migrations/004_add_messages.sql \
  -f migrations/005_add_payments.sql
```

## Contas de teste (após seed)

| Role      | Email                  | Senha         |
|-----------|------------------------|---------------|
| Cliente   | cliente@test.com       | Cliente123!   |
| Prestador | prestador@test.com     | Prestador123! |

## Adicionando novas migrations

Siga a convenção de numeração sequencial a partir do **007**:

- `006_add_location_tracking.sql` — tabela `provider_locations` (Sprint 7)
- `007_add_push_notifications.sql` — tabela/trigger de push notifications (Sprint 7)

Cada arquivo deve ser idempotente: use `IF NOT EXISTS`, `ON CONFLICT DO NOTHING`, `CREATE OR REPLACE`.

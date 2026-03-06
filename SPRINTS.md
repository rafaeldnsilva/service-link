# ServiceLink — Planejamento de Sprints

> **Base**: Relatório Técnico de 05/03/2026
> **Conclusão atual**: ~35% | **Meta**: 100% (MVP production-ready)
> **Duração por Sprint**: 2 semanas
> **Sprints planejadas**: 8 + Sprint 0 (fundação)
> **Timeline estimada**: ~18 semanas (~4,5 meses)

---

## Visão Geral do Roadmap

```
Sprint 0  │ Fundação & Segurança           │ Sem. 1–2
Sprint 1  │ Arquitetura & Navegação        │ Sem. 3–4
Sprint 2  │ Auth Completo & Perfil         │ Sem. 5–6
Sprint 3  │ Fluxo de Serviço — Cliente     │ Sem. 7–8
Sprint 4  │ Fluxo de Serviço — Prestador   │ Sem. 9–10
Sprint 5  │ Chat em Tempo Real             │ Sem. 11–12
Sprint 6  │ Pagamentos                     │ Sem. 13–14
Sprint 7  │ Notificações & Localização     │ Sem. 15–16
Sprint 8  │ Qualidade, Testes & Launch     │ Sem. 17–18
```

**Critério de "Done"** para qualquer tarefa:
- Código sem `console.log` de debug
- Sem dados hardcoded
- Loading state implementado
- Error state implementado
- TypeScript sem `any`

---

## Sprint 0 — Fundação & Segurança
**Duração**: 2 semanas | **Prioridade**: CRÍTICA (bloqueante para tudo)

> Objetivo: Eliminar dívida técnica crítica e montar a infraestrutura de qualidade antes de qualquer feature nova.

### Segurança (must-do antes de qualquer commit público)

- [x] **SEC-01** Mover credenciais Supabase para `.env` via `EXPO_PUBLIC_*` *(concluído)*
- [x] **SEC-02** Adicionar `.env` ao `.gitignore` *(concluído)*
- [x] **SEC-03** Rever RLS policy de `profiles` — separar campos públicos (nome, bio, avatar) de privados (phone, address). Criar política que expõe dados privados apenas ao próprio usuário.
- [x] **SEC-04** Adicionar constraint na DB: review só pode ser criada se o booking associado tiver status `completed` (enforced via trigger, não apenas convenção no código).
- [x] **SEC-05** `003_add_constraints_and_privacy.sql` criada e aplicada no banco local.

### Qualidade de Código

- [x] **QUA-01** ESLint instalado com preset `expo` + `eslint.config.js` configurado
- [x] **QUA-02** Prettier instalado com `.prettierrc` e `.prettierignore`
- [x] **QUA-03** Scripts `lint`, `lint:fix`, `format`, `typecheck` adicionados ao `package.json`
- [x] **QUA-04** `useNavigation<any>()` corrigido em 6 telas de Provider (ProviderHistoryScreen, ProviderServicesScreen, AvailabilityConfigScreen, SpecialtyRegistrationScreen, DocumentVerificationScreen, ServiceAcceptanceScreen)
- [x] **QUA-05** `profile: any` tipado com `Database["public"]["Tables"]["profiles"]["Row"]` no `AuthContext.tsx`

### DevMenu e Rota Inicial

- [x] **DEV-01** `AuthGateScreen.tsx` criada — redireciona baseado em auth state (sem sessão → Welcome, sem role → RoleSelection, client → ClientHome, provider → ProviderMain)
- [x] **DEV-02** `initialRouteName` alterado para `"AuthGate"` no `AppNavigator`
- [x] **DEV-03** `DevMenu` encapsulado em `{__DEV__ && <Stack.Screen ... />}` — invisível em produção

### Dívidas de Hard Code urgentes

- [x] **HC-01** Versão e build falsos removidos da `SecurityScreen` (agora mostra `v1.0.0`)
- [x] **HC-02** Avatar `pravatar.cc` removido — substituído por avatar de iniciais gerado do `profile.full_name`
- [x] **HC-03** `alert()` substituído por `Alert.alert()` com títulos e mensagens em pt-BR em LoginScreen, SignUpScreen e PersonalInfoScreen

### Migrations de BD

- [x] **BD-01** Pasta `migrations/` criada com estrutura numerada
- [x] **BD-02** `001_create_schema.sql` — aplicada no banco local
- [x] **BD-03** `002_seed_data.sql` — aplicada no banco local
- [x] **BD-04** `003_add_constraints_and_privacy.sql` — trigger de validação de review, UNIQUE por booking, campos `is_available`, `coverage_radius_km`, `push_token` — aplicada no banco local

**Entregável**: App com rota inicial correta, sem credenciais hardcoded, ESLint+Prettier configurados, tipos corretos.

---

## Sprint 1 — Arquitetura de Navegação & Estado Global
**Duração**: 2 semanas | **Prioridade**: ALTA (fundação estrutural)

> Objetivo: Refatorar a navegação para um modelo sustentável e introduzir gerenciamento de estado.

### Navegação — Tab Navigator

O single stack de 35 rotas é problemático. Migrar para:
```
AppNavigator (Stack raiz)
├── AuthStack (Stack)         ← Onboarding + Login + Signup + Recuperação
├── ClientTabs (Tab)          ← Home | Serviços | Histórico | Perfil
│   ├── ClientHomeStack
│   ├── ServicesStack
│   ├── ClientHistoryStack
│   └── ClientProfileStack
└── ProviderTabs (Tab)        ← Home | Agendamentos | Serviços | Perfil
    ├── ProviderHomeStack
    ├── ProviderBookingsStack
    ├── ProviderServicesStack
    └── ProviderProfileStack
```

- [x] **NAV-01** Instalar `@react-navigation/bottom-tabs` (já estava no package.json)
- [x] **NAV-02** Criar `AuthNavigator.tsx` — encapsula fluxo de Onboarding + Auth + Perfil
- [x] **NAV-03** Criar `ClientTabNavigator.tsx` — tabs do cliente com ícones (Home, Serviços, Histórico, Perfil)
- [x] **NAV-04** Criar `ProviderTabNavigator.tsx` — tabs do prestador com ícones (Início, Pedidos, Serviços, Conta)
- [x] **NAV-05** Atualizar `AppNavigator.tsx` para orquestrar os três navigators acima
- [x] **NAV-06** Atualizar `types/navigation.ts` com param lists aninhados (AuthStackParamList, ClientTabParamList, ProviderTabParamList)
- [x] **NAV-07** Tab bar customizada via `screenOptions` com cor primária #2C097F, ícones MaterialIcons, sombra iOS/Android

### Gerenciamento de Estado — Zustand

- [x] **EST-01** Instalar Zustand v5.0.11
- [x] **EST-02** Criar `src/store/authStore.ts` — user, session, profile, isProvider, isAuthenticated
- [x] **EST-03** Criar `src/store/servicesStore.ts` — filtros de categoria, searchQuery, serviço selecionado
- [x] **EST-04** Criar `src/store/bookingStore.ts` — activeBooking, bookingStatus
- [x] **EST-05** `AuthContext` mantido como wrapper de compatibilidade (Supabase listeners)

### Cache de Dados — React Query

- [x] **RQ-01** Instalar `@tanstack/react-query` v5.90.21
- [x] **RQ-02** Configurar `QueryClient` — staleTime: 5min, retry: 2, refetchOnWindowFocus: false (`src/lib/queryClient.ts`)
- [x] **RQ-03** `QueryClientProvider` adicionado no `App.tsx` (wraps toda a árvore de componentes)
- [x] **RQ-04** Hooks base criados: `useServices()`, `useService()`, `useBookings()`, `useProviderBookings()`, `useCreateBooking()`, `useProfile()`, `useUpdateProfile()`

### Extração de Constantes Duplicadas

- [x] **CONST-01** Extrair `mapCustomStyle` para `src/theme/mapStyles.ts` — `ClientHomeScreen` atualizado para importar
- [x] **CONST-02** Criar `src/constants/categories.ts` com `SERVICE_CATEGORIES` tipado com `ServiceCategory` interface — `ClientHomeScreen` atualizado

**Entregável**: App com Tab Bar funcionando para client e provider, Zustand configurado, React Query pronto.

---

## Sprint 2 — Auth Completo & Gerenciamento de Perfil
**Duração**: 2 semanas | **Prioridade**: ALTA

> Objetivo: Fechar 100% do fluxo de autenticação e perfil do usuário.

### Recuperação de Senha (atualmente ~40%)

- [x] **AUTH-01** `ForgotPasswordScreen` — `supabase.auth.resetPasswordForEmail()` com feedback real, validação de email
- [x] **AUTH-02** `EmailVerificationScreen` — botão "Reenviar" chama `resetPasswordForEmail()` com estado de loading
- [x] **AUTH-03** `NewPasswordScreen` — `supabase.auth.updateUser({ password })` com validação (8 chars, maiúscula, número)
- [x] **AUTH-04** `PasswordSuccessScreen` — já conectado ao fluxo real (navegação correta)

### Validação de Senha no Cadastro

- [x] **AUTH-05** `SignUpScreen` — barra de força de senha com 3 níveis: fraca (vermelho), média (laranja), forte (verde)
- [x] **AUTH-06** Política aplicada: 8+ caracteres, 1 maiúscula, 1 número — validação antes do signUp

### Perfil de Usuário

- [x] **PERF-01** `ClientEditProfileScreen` — avatar upload via `expo-image-picker` → fetch/blob → Supabase Storage bucket `avatars/` com `upsert: true`
- [x] **PERF-02** `ClientEditProfileScreen` — pré-preenchido com `profile.full_name`/`profile.phone`, salva via `supabase.from('profiles').update()`
- [x] **PERF-03** `ClientProfileScreen` — nome, email, avatar real de `useAuth()`, avatar com iniciais como fallback, signOut integrado
- [x] **PERF-04** `ClientInfoScreen` — dados reais via `useAuth()` com componente `InfoRow` reutilizável, sem mocks

### Security Screen

- [x] **SEC-06** `SecurityScreen` — "Alterar Senha" navega para `ForgotPassword`
- [x] **SEC-07** `SecurityScreen` — "Excluir conta" com `Alert.alert` de confirmação + `signOut()` + reset para Auth
- [x] **SEC-08** `SecurityScreen` — versão real via `Constants.expoConfig?.version`, sem hardcode

**Instalações necessárias**:
```bash
cd mobile && npx expo install expo-image-picker expo-constants
```

**Entregável**: Fluxo de auth 100% funcional, perfil editável com foto real, senha com política.

---

## Sprint 3 — Fluxo de Serviço (Lado Cliente)
**Duração**: 2 semanas | **Prioridade**: CRÍTICA (core value do produto)

> Objetivo: Implementar o fluxo completo que um cliente percorre do início ao fim: descoberta → contratação → acompanhamento → avaliação.

### Descoberta de Serviços

- [x] **SERV-01** `ClientHomeScreen` — campo de busca com debounce (300ms) navegando para AllServices
- [x] **SERV-02** `ClientHomeScreen` — localização real com `expo-location` (permissão + centralizar mapa)
- [x] **SERV-03** `ClientAllServicesScreen` — conectado ao Supabase via `serviceService.getAllServices()`, loading/error states
- [x] **SERV-04** `ClientAllServicesScreen` — filtro por categoria funcional (horizontal ScrollView com chips)

### Perfil do Prestador

- [x] **SERV-05** `ProviderProfileScreen` — implementado com `profileService.getProviderDetails()`:
  - Avatar/iniciais, nome, rating médio, total avaliações
  - Lista real de serviços do prestador com botão "Contratar" por serviço
  - Stats row (Serviços / Avaliações / Nota)
  - Botão "Contratar" → navega para ServiceConfirmation com params

### Confirmação de Serviço

- [x] **SERV-06** `ServiceConfirmationScreen` — lê `serviceTitle` e `price` dos params de navegação
  - *TODO*: Seletor de data/hora e criação real de booking via `bookingService.createBooking()`

### Busca de Prestador

- [x] **SERV-07** `SearchingProviderScreen` — animação pulse, auto-navega para ServiceTracking em 5s

### Acompanhamento de Serviço

- [x] **SERV-08** `ServiceTrackingScreen` — mapa com rota cliente↔prestador

### Avaliação

- [x] **SERV-09** `RateProviderScreen` — `reviewService.createReview()` com loading, erro, texto de feedback por estrela

### Histórico do Cliente

- [x] **SERV-10** `ClientHistoryScreen` — `bookingService.getClientBookings()`, filtros, busca, ação "Cancelar" (pending/accepted), ação "Avaliar" (completed)

**Instalações necessárias**:
```bash
cd mobile && npx expo install expo-location @react-native-community/datetimepicker
```

**Entregável**: Cliente consegue buscar, contratar, acompanhar e avaliar um serviço de ponta a ponta.

---

## Sprint 4 — Fluxo de Serviço (Lado Prestador)
**Duração**: 2 semanas | **Prioridade**: CRÍTICA

> Objetivo: Implementar o lado do prestador — receber pedidos, aceitar/rejeitar, executar e gerenciar.

### Aceite de Serviço

- [x] **PROV-01** `ServiceAcceptanceScreen` — fixed navigate("ChatScreen", {}) param; handleArrived cleanup

### Tela Principal do Prestador

- [x] **PROV-02** `ProviderMainScreen` — `bookingService.getPendingBookings()`, card dinâmico, toggle Online/Offline, `expo-location`, accept/reject com lógica real

### Histórico do Prestador

- [x] **PROV-03** `ProviderHistoryScreen` — `bookingService.getProviderBookings()`, filtros por status, total ganho, sem mocks

### Gerenciamento de Serviços

- [x] **PROV-04** `ProviderServicesScreen` — `serviceService.getServicesByProvider()`, criar via modal sheet, deletar com confirmação

### Disponibilidade

- [x] **PROV-05** `AvailabilityConfigScreen` — salva `is_available: true` e `coverage_radius_km` em `profiles`

### Especialidade e Verificação

- [x] **PROV-06** `SpecialtyRegistrationScreen` — picker de categorias real (SERVICE_CATEGORIES), salva serviços via `serviceService.createService()`

- [x] **PROV-07** `DocumentVerificationScreen` — upload real via `expo-image-picker` → bucket `documents/` no Supabase Storage (usando image-picker como substituto do expo-document-picker)

**Entregável**: Prestador consegue receber, aceitar e gerenciar serviços completamente.

---

## Sprint 5 — Chat em Tempo Real
**Duração**: 2 semanas | **Prioridade**: ALTA

> Objetivo: Implementar comunicação em tempo real entre cliente e prestador durante o serviço.

### Banco de Dados

- [x] **CHAT-01** `migrations/005_add_messages.sql` — tabela `messages` com RLS (client e provider do booking), indexes, Realtime instructions

### Service Layer

- [x] **CHAT-02** `src/services/messageService.ts`:
  - `getMessages(bookingId)` — histórico com JOIN para sender profile
  - `sendMessage(bookingId, senderId, content)` — insert com return
  - `subscribeToMessages(bookingId, callback)` — Supabase Realtime `postgres_changes`
  - `markAsRead(messageId)` — update `read_at`
  - `getUnreadCount(userId)` — contagem para badge

### Interface

- [x] **CHAT-03** `ChatScreen` — FlatList com bolhas sent/received, Realtime subscription, loading state, input com send desabilitado quando vazio
- [ ] **CHAT-04** Adicionar badge de mensagens não lidas no ícone de chat da TabBar

**Entregável**: Chat funcional e em tempo real entre cliente e prestador vinculado ao booking.

---

## Sprint 6 — Pagamentos
**Duração**: 2 semanas | **Prioridade**: ALTA

> Objetivo: Integrar gateway de pagamento para monetizar o marketplace.

### Decisão de Gateway

Opções recomendadas para Brasil:
- **Stripe** — melhor documentação, SDK React Native maduro, aceita Pix/boleto via Stripe Treasury
- **Pagar.me** — focado no Brasil, Pix nativo, integração simples
- **MercadoPago** — alta penetração no Brasil, SDK disponível

*Recomendação: Stripe para MVP global, Pagar.me se foco exclusivo no Brasil.*

### Banco de Dados

- [ ] **PAG-01** Criar `006_add_payments.sql`:
  ```sql
  CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id      UUID NOT NULL REFERENCES bookings(id),
    amount          DECIMAL(10,2) NOT NULL,
    currency        TEXT DEFAULT 'BRL',
    status          TEXT NOT NULL, -- pending, paid, refunded, failed
    gateway         TEXT NOT NULL, -- stripe, pagarme
    gateway_ref     TEXT,          -- ID da transação no gateway
    paid_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
  );
  ```

### Implementação

- [ ] **PAG-02** Configurar chaves do gateway no `.env` (`EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` ou equivalente)
- [ ] **PAG-03** `PaymentMethodsScreen` — sair do stub, implementar:
  - Listar cartões salvos do usuário
  - Adicionar novo cartão
  - Definir cartão padrão
  - Remover cartão
- [ ] **PAG-04** `AddCardScreen` — implementar formulário de cartão com validação (Luhn) e tokenização via SDK do gateway
- [ ] **PAG-05** `ServiceConfirmationScreen` — adicionar seleção de método de pagamento antes de confirmar booking
- [ ] **PAG-06** Implementar cobrança automática ao confirmar o booking (ou ao concluir, dependendo da regra de negócio)
- [ ] **PAG-07** Implementar lógica de split de pagamento (taxa da plataforma vs. valor do prestador)

**Entregável**: Usuário consegue pagar por um serviço com cartão de crédito/débito ou Pix.

---

## Sprint 7 — Notificações Push & Localização Avançada
**Duração**: 2 semanas | **Prioridade**: MÉDIA-ALTA

> Objetivo: Push notifications e geolocalização em tempo real para tracking do prestador.

### Push Notifications

- [ ] **NOTIF-01** Instalar e configurar `expo-notifications`:
  ```bash
  cd mobile && npx expo install expo-notifications expo-device
  ```
- [ ] **NOTIF-02** Criar `src/services/notificationService.ts`:
  - `registerForPushNotifications()` — solicitar permissão e obter token
  - Salvar token no perfil do usuário na DB
- [ ] **NOTIF-03** Criar `006_add_push_tokens.sql` — campo `push_token` na tabela `profiles`
- [ ] **NOTIF-04** `NotificationsScreen` — sair do stub, listar notificações reais do usuário:
  - Booking aceito pelo prestador
  - Prestador a caminho
  - Serviço concluído
  - Nova mensagem no chat
  - Novo pedido de serviço (para prestador)

### Triggering de Notificações

As notificações devem ser disparadas por **Supabase Edge Functions** (ou webhook) para não depender do app estar aberto:
- [ ] **NOTIF-05** Criar Edge Function `send-push-notification` no Supabase
- [ ] **NOTIF-06** Configurar triggers de DB para chamar a Edge Function nos eventos relevantes

### Localização em Tempo Real

- [ ] **LOC-01** Criar `007_add_location_tracking.sql` — tabela `provider_locations(provider_id, lat, lng, updated_at)`
- [ ] **LOC-02** `ProviderMainScreen` — quando online, publicar localização a cada 30s via `expo-location` background
- [ ] **LOC-03** `ServiceTrackingScreen` — subscrever Supabase Realtime na tabela `provider_locations` para mover o marker do mapa em tempo real
- [ ] **LOC-04** Implementar lógica de matching por proximidade no `SearchingProviderScreen` — buscar prestadores com `role=provider` e `is_available=true` ordenados por distância

**Entregável**: Usuário recebe push notifications em todos os eventos do fluxo. Cliente acompanha prestador no mapa em tempo real.

---

## Sprint 8 — Qualidade, Testes & Preparação para Lançamento
**Duração**: 2 semanas | **Prioridade**: ALTA (requisito para produção)

> Objetivo: Garantir qualidade, performance e preparação para store (App Store / Play Store).

### Testes Automatizados

- [ ] **TEST-01** Instalar Jest + Testing Library:
  ```bash
  cd mobile && npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
  ```
- [ ] **TEST-02** Testes unitários para `supabaseService.ts` — mockar cliente Supabase
- [ ] **TEST-03** Testes unitários para lógica de validação (senha, formulários)
- [ ] **TEST-04** Testes de integração para fluxo de auth (login → redirect baseado em role)
- [ ] **TEST-05** Testes de componente para `Button`, `Input` e `ChatBubble`
- [ ] **TEST-06** Adicionar script `"test": "jest"` e `"test:coverage": "jest --coverage"` no `package.json`

### CI/CD — GitHub Actions

- [ ] **CI-01** Criar `.github/workflows/ci.yml`:
  ```yaml
  # Roda em todo PR: lint + type-check + testes
  on: [pull_request]
  jobs:
    quality:
      - npm ci
      - npm run lint
      - tsc --noEmit
      - npm test
  ```
- [ ] **CI-02** Criar `.github/workflows/build.yml`:
  ```yaml
  # Build EAS em push para main
  on:
    push:
      branches: [main]
  jobs:
    build:
      - eas build --platform all --non-interactive
  ```
- [ ] **CI-03** Configurar `eas.json` com profiles: `development`, `preview`, `production`
- [ ] **CI-04** Configurar secrets no GitHub: `EXPO_TOKEN`, `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Performance

- [ ] **PERF-01** Implementar paginação real em todas as listas (`limit 20` + `load more` / infinite scroll)
- [ ] **PERF-02** Adicionar `React.memo()` nas células de listas pesadas (ServiceCard, BookingCard)
- [ ] **PERF-03** Implementar lazy loading de imagens com `expo-image` (substitui `Image` do RN)
- [ ] **PERF-04** Auditar re-renders com React DevTools

### UX — Polish Final

- [ ] **UX-01** Padronizar ícone de voltar em TODAS as telas para `arrow-back-ios-new` (cor `primary`)
- [ ] **UX-02** Implementar skeleton loaders em todas as telas com loading state (usar `react-native-skeleton-placeholder` ou nativo com Animated)
- [ ] **UX-03** Implementar tela de erro genérica reutilizável com botão "Tentar novamente"
- [ ] **UX-04** Implementar `EmptyState` reutilizável para listas vazias (ilustração + mensagem)
- [ ] **UX-05** Testar acessibilidade: `accessibilityLabel` em botões de ação, suporte a font scaling
- [ ] **UX-06** Adicionar `haptic feedback` (expo-haptics) em ações importantes (confirmar booking, enviar avaliação)

### Preparação para Store

- [ ] **STORE-01** Atualizar `app.json`: versão real (`1.0.0`), splash screen, ícones nas dimensões corretas
- [ ] **STORE-02** Obter Google Maps API Key real e substituir placeholder em `app.json`
- [ ] **STORE-03** Configurar privacy policy URL e termos de serviço reais
- [ ] **STORE-04** Documentar variáveis de ambiente necessárias em `README.md` principal

**Entregável**: App testado, com CI/CD funcionando, pronto para submissão nas stores.

---

## Backlog Pós-MVP (Fora do escopo das 8 sprints)

Itens identificados no relatório que ficam para versão 1.1+:

| Item | Complexidade | Valor |
|---|---|---|
| Login social (Google/Apple) | Alta | Médio |
| Autenticação 2FA real (Supabase MFA) | Média | Alto |
| Avaliação bidirecional (cliente avalia prestador E prestador avalia cliente) | Baixa | Médio |
| Admin dashboard (painel de administração) | Alta | Alto |
| Cancelamento com política de janela de tempo | Média | Alto |
| Histórico financeiro para prestador (extrato) | Média | Alto |
| Sistema de disputas (contestação de serviço) | Alta | Alto |
| Programa de fidelidade / pontos | Alta | Médio |
| Suporte a múltiplos idiomas (i18n) | Média | Médio |

---

## Indicadores de Progresso por Sprint

| Sprint | Conclusão ao final | Novas features | Dívida eliminada |
|---|---|---|---|
| Sprint 0 | ~37% | — | Segurança crítica, tipos, ESLint |
| Sprint 1 | ~45% | Tab Bar, cache | Arquitetura de navegação |
| Sprint 2 | ~55% | Auth 100%, foto de perfil | `alert()`, hard codes de perfil |
| Sprint 3 | ~68% | Fluxo cliente completo | Stubs de serviço (cliente) |
| Sprint 4 | ~78% | Fluxo prestador completo | Stubs e mocks de prestador |
| Sprint 5 | ~83% | Chat real-time | Stub de chat |
| Sprint 6 | ~89% | Pagamentos | Stubs de pagamento |
| Sprint 7 | ~93% | Notificações, GPS real | Hard codes de mapa/localização |
| Sprint 8 | ~100% | — | Testes, CI/CD, polish |

---

## Dependências Entre Sprints

```
Sprint 0 (Fundação)
    └── Sprint 1 (Arquitetura)
            └── Sprint 2 (Auth/Perfil)
                    └── Sprint 3 (Fluxo Cliente)
                    │       └── Sprint 5 (Chat)
                    │       └── Sprint 6 (Pagamentos)
                    └── Sprint 4 (Fluxo Prestador)
                            └── Sprint 7 (Notificações)
                                    └── Sprint 8 (Lançamento)
```

> **Regra**: Não iniciar uma sprint sem a anterior estar 100% concluída. Os entregáveis são cumulativos e inter-dependentes.

---

*Documento gerado em 05/03/2026 com base no Relatório Técnico de Desenvolvimento do ServiceLink.*
*Atualizar este documento ao final de cada sprint com o status real de cada tarefa.*

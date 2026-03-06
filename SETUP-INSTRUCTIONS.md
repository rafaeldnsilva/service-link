# ServiceLink - Instruções de Configuração e Teste

## 📋 Resumo da Implementação

✅ **Concluído:**
- Camada de serviços API completa (`mobile/src/services/supabaseService.ts`)
- Integração com Supabase (autenticação e perfis)
- Telas de interface do usuário (cliente e prestador)
- Scripts SQL para configuração do banco de dados
- Conexão da tela de listagem de serviços ao backend

## 🚀 Passo a Passo para Configurar e Testar

### 1. Configurar as Tabelas no Supabase

1. Acesse seu projeto Supabase: https://zmauyahzrrdvcwtbbtbl.supabase.co

2. Vá para o **SQL Editor** (menu lateral esquerdo)

3. Execute o script de configuração:
   - Abra o arquivo `supabase-setup.sql` na raiz do projeto
   - Copie todo o conteúdo
   - Cole no SQL Editor do Supabase
   - Clique em **RUN** (ou pressione Ctrl+Enter)

   Este script criará:
   - Enums (`user_role`, `booking_status`)
   - Tabelas (`profiles`, `services`, `bookings`, `reviews`)
   - Políticas de segurança (Row Level Security)
   - Índices para performance
   - Triggers para atualização automática
   - Buckets de storage (avatares, imagens de serviços)

### 2. Criar as Contas de Teste

#### Opção A: Via Interface da Aplicação (Recomendado)

1. Inicie o app no mobile:
   ```bash
   cd mobile
   npx expo start
   ```

2. Pressione `a` para Android ou `i` para iOS

3. Na tela de login, clique em "Criar conta"

4. **Conta de Cliente:**
   - Email: `cliente@test.com`
   - Senha: `Cliente123!`
   - Nome: João Silva
   - Confirme a senha e crie a conta
   - Após criar, faça login
   - Selecione a função: **Cliente**
   - Preencha os dados pessoais:
     - Nome: João Silva
     - Telefone: (11) 98765-4321
     - Endereço: Rua das Flores, 123 - São Paulo, SP

5. Faça logout (menu → sair)

6. **Conta de Prestador:**
   - Email: `prestador@test.com`
   - Senha: `Prestador123!`
   - Nome: Carlos Mendes
   - Confirme a senha e crie a conta
   - Após criar, faça login
   - Selecione a função: **Prestador de Serviços**
   - Preencha os dados pessoais:
     - Nome: Carlos Mendes - Eletricista
     - Telefone: (11) 99876-5432
     - Endereço: Avenida Paulista, 1000 - São Paulo, SP
     - Bio: Eletricista profissional com 15 anos de experiência

#### Opção B: Via Supabase Dashboard

1. Acesse: https://zmauyahzrrdvcwtbbtbl.supabase.co
2. Vá em **Authentication** → **Users**
3. Clique em **Add user** → **Create new user**
4. Preencha:
   - Email: `cliente@test.com`
   - Password: `Cliente123!`
   - Confirm Password: `Cliente123!`
   - Auto Confirm User: ✅ (marque esta opção)
5. Clique em **Create user**
6. Repita para `prestador@test.com` / `Prestador123!`

### 3. Atualizar os UUIDs no Script de Dados de Teste

Após criar as contas, você precisa obter os UUIDs dos usuários:

1. No Supabase, vá em **Authentication** → **Users**
2. Encontre os usuários criados e copie seus UUIDs (coluna `id`)
3. Abra o arquivo `supabase-seed-data.sql`
4. Substitua os UUIDs de exemplo pelos UUIDs reais:

```sql
-- Exemplo: Substituir esta linha
'00000000-0000-0000-0000-000000000001'
-- Por algo como:
'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
```

Você precisará substituir:
- `00000000-0000-0000-0000-000000000001` → UUID do cliente@test.com
- `00000000-0000-0000-0000-000000000002` → UUID do prestador@test.com

### 4. Popular o Banco com Dados de Teste

1. Após atualizar os UUIDs, volte ao **SQL Editor** do Supabase
2. Copie o conteúdo do arquivo `supabase-seed-data.sql`
3. Cole no SQL Editor
4. Clique em **RUN**

Este script criará:
- ✅ Perfis completos para os usuários
- ✅ 12 serviços de exemplo (Eletricista, Encanador, Pintor, Faxineira)
- ✅ 3 bookings de exemplo (pendente, aceito, completo)
- ✅ 9 avaliações de exemplo

### 5. Testar o Aplicativo

#### Teste como Cliente:

1. Faça login com `cliente@test.com` / `Cliente123!`
2. Você verá a tela inicial com mapa
3. Clique em "Ver todos os serviços"
4. **✅ Funcionalidade Implementada:** A lista de serviços agora vem do Supabase!
   - Você verá os 12 serviços criados
   - Busca funcional por título, categoria ou descrição
   - Serviços agrupados por categoria
   - Preços reais do banco de dados

5. Navegue pelo aplicativo:
   - Tela inicial (mapa)
   - Histórico de serviços
   - Perfil do cliente
   - Editar perfil

#### Teste como Prestador:

1. Faça logout e login com `prestador@test.com` / `Prestador123!`
2. Você verá a tela do prestador
3. Navegue pelas opções:
   - Meus serviços
   - Histórico de trabalhos
   - Configurar disponibilidade
   - Cadastrar especialidade

## 📁 Arquivos Criados/Modificados

### Novos Arquivos:
1. `mobile/src/services/supabaseService.ts` - Camada de serviços API completa
2. `supabase-setup.sql` - Script de configuração do banco
3. `supabase-seed-data.sql` - Script de dados de teste
4. `SETUP-INSTRUCTIONS.md` - Este arquivo

### Arquivos Modificados:
1. `mobile/src/screens/client/ClientAllServicesScreen.tsx` - Conectado ao backend

## 🔧 Próximas Implementações Necessárias

Para fazer o app funcionar 100%, ainda é necessário:

### Alta Prioridade:
1. ❌ Conectar ClientHistoryScreen ao backend (bookings)
2. ❌ Implementar tela de detalhes do serviço
3. ❌ Implementar fluxo de reserva (criar booking)
4. ❌ Conectar tela de avaliação ao backend
5. ❌ Implementar edição de perfil funcional

### Média Prioridade:
6. ❌ Telas de prestador conectadas ao backend
7. ❌ Upload de avatar (Supabase Storage)
8. ❌ Sistema de notificações em tempo real
9. ❌ Chat entre cliente e prestador

### Baixa Prioridade:
10. ❌ Integração com pagamentos
11. ❌ Geolocalização real no mapa
12. ❌ Push notifications
13. ❌ Upload de documentos do prestador

## 🐛 Troubleshooting

### Erro: "relation 'profiles' does not exist"
**Solução:** Execute o script `supabase-setup.sql` no SQL Editor do Supabase.

### Erro: "Row level security policy violation"
**Solução:** Verifique se as políticas RLS foram criadas corretamente no script de setup.

### Serviços não aparecem na lista
**Solução:**
1. Verifique se executou o script `supabase-seed-data.sql`
2. Confirme que atualizou os UUIDs com os IDs reais dos usuários
3. Abra o console do app e veja se há erros de API

### Não consigo fazer login
**Solução:**
1. Verifique se o usuário foi criado no Authentication do Supabase
2. Confirme que a opção "Auto Confirm User" estava marcada
3. Tente resetar a senha pelo Supabase Dashboard

### App não inicia
**Solução:**
```bash
cd mobile
rm -rf node_modules
npm install
npx expo start --clear
```

## 📞 Credenciais de Teste

### Cliente:
- **Email:** cliente@test.com
- **Senha:** Cliente123!
- **Função:** Cliente
- **Nome:** João Silva

### Prestador:
- **Email:** prestador@test.com
- **Senha:** Prestador123!
- **Função:** Prestador de Serviços
- **Nome:** Carlos Mendes - Eletricista

## 🔐 Segurança

⚠️ **IMPORTANTE:** As credenciais do Supabase estão hardcoded no código para desenvolvimento. Antes de ir para produção:

1. Crie um arquivo `.env` na pasta `mobile/`:
```env
SUPABASE_URL=https://zmauyahzrrdvcwtbbtbl.supabase.co
SUPABASE_ANON_KEY=sua_chave_aqui
```

2. Instale dotenv:
```bash
npm install @react-native-dotenv
```

3. Atualize `mobile/src/lib/supabase.ts` para usar variáveis de ambiente

## ✅ Checklist de Configuração

- [ ] Executei o script `supabase-setup.sql`
- [ ] Criei as contas de teste (cliente e prestador)
- [ ] Copiei os UUIDs dos usuários
- [ ] Atualizei o arquivo `supabase-seed-data.sql` com os UUIDs reais
- [ ] Executei o script `supabase-seed-data.sql`
- [ ] Instalei as dependências (`npm install`)
- [ ] Iniciei o app (`npx expo start`)
- [ ] Fiz login como cliente e vi os serviços
- [ ] Fiz login como prestador

## 🎉 Sucesso!

Se você chegou até aqui e completou todos os passos, seu app ServiceLink está funcionando com:
- ✅ Autenticação funcional
- ✅ Banco de dados configurado
- ✅ Dados de teste carregados
- ✅ Listagem de serviços conectada ao backend
- ✅ Duas contas de teste prontas para uso

**Próximo passo:** Continue conectando as outras telas ao backend usando a camada de serviços em `mobile/src/services/supabaseService.ts` como referência!

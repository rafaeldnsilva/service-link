# ServiceLink Mobile

O **ServiceLink** é uma aplicação móvel estilo marketplace para serviços, conectando clientes a profissionais qualificados (eletricistas, técnicos, entregadores, etc.) de forma rápida e segura.

## Tech Stack

Este projeto foi desenvolvido utilizando tecnologias modernas do ecossistema React Native:

- **Core**: React Native com Expo (TypeScript)
- **Estilização**: NativeWind (Tailwind CSS para React Native)
- **Navegação**: React Navigation (Native Stack)
- **Ícones**: Material Community Icons (@expo/vector-icons)

## Estrutura do Projeto

A estrutura de pastas segue uma organização modular:

```
mobile/
├── src/
│   ├── screens/         # Telas da aplicação
│   │   ├── onboarding/  # Fluxo de boas-vindas (Welcome, HowItWorks, GetStarted)
│   │   └── auth/        # Fluxo de autenticação (Login, SignUp, Password Reset)
│   ├── components/      # Componentes reutilizáveis (Button, Input)
│   ├── navigation/      # Configuração de rotas (AppNavigator)
│   ├── theme/           # Configurações de tema e cores
│   └── types/           # Definições de tipos TypeScript
├── App.tsx              # Ponto de entrada da aplicação
├── tailwind.config.js   # Configuração do Tailwind CSS
└── babel.config.js      # Configuração do Babel (NativeWind)
```

## Funcionalidades Implementadas

### 1. Onboarding
Fluxo inicial para apresentar o aplicativo ao usuário:
- **Welcome Screen**: Tela de boas-vindas com identidade visual do app.
- **How It Works**: Carrossel explicativo sobre as funcionalidades principais.
- **Get Started**: Tela de decisão para login ou cadastro.

### 2. Autenticação
Sistema completo de interfaces para gestão de conta:
- **Login**: Autenticação via e-mail/senha e UI para login social (Google/Apple).
- **Cadastro**: Formulário de registro com aceitação de termos.
- **Recuperação de Senha**:
  - Solicitação de reset por e-mail.
  - Tela de verificação de envio.
  - Definição de nova senha com validação de força.
  - Tela de sucesso.

## Como Executar

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Execute o projeto**:
   ```bash
   npx expo start
   ```

3. **Abra no emulador ou dispositivo**:
   - Pressione `a` para Android.
   - Pressione `i` para iOS (macOS apenas).
   - Ou escaneie o QR Code com o app Expo Go no seu celular.

## Design System

O projeto utiliza uma paleta de cores consistente definida em `src/theme/colors.ts`:
- **Primary**: `#2C097F` (Roxo profundo)
- **Background**: `#f6f6f8` (Claro) / `#151022` (Escuro)
- **Status**: `#34C759` (Sucesso) / `#FF3B30` (Erro)

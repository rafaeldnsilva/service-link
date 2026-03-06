# Matriz de Implementação de Telas (Design -> App)

Data da análise: 05/03/2026
Escopo: `design-login-apresentacao`, `design-telas-clientes`, `design-telas-completar-perfil`, `design-telas-configuracoes-gerais-cliente-prestadores`, `design-telas-prestadores` e subpastas.

## Legenda de status
- IMPLEMENTADA (ATIVA): existe tela e está ligada no fluxo atual.
- IMPLEMENTADA (NAO ATIVA/STUB): arquivo real existe, mas rota atual cai em stub/barrel.
- PARCIAL: existe apenas trecho/acao dentro de outra tela, sem fluxo dedicado equivalente ao design.
- AUSENTE: nao ha tela/fluxo equivalente implementado.

## 1) design-login-apresentacao

| Tela de design | Tela no app | Status | Observacao |
|---|---|---|---|
| senha_redefinida_sucesso | PasswordSuccessScreen | IMPLEMENTADA (ATIVA) | AuthNavigator |
| tela_de_boas-vindas | WelcomeScreen | IMPLEMENTADA (ATIVA) | AuthNavigator |
| tela_de_cadastro | SignUpScreen | IMPLEMENTADA (ATIVA) | AuthNavigator |
| tela_de_chamada_para_acao | GetStartedScreen | IMPLEMENTADA (ATIVA) | AuthNavigator |
| tela_de_explicacao_de_servico | HowItWorksScreen | IMPLEMENTADA (ATIVA) | AuthNavigator |
| tela_de_login | LoginScreen | IMPLEMENTADA (ATIVA) | AuthNavigator |
| tela_de_nova_senha | NewPasswordScreen | IMPLEMENTADA (ATIVA) | AuthNavigator |
| tela_de_recuperacao_de_senha | ForgotPasswordScreen | IMPLEMENTADA (ATIVA) | AuthNavigator |
| tela_de_verificacao_de_email | EmailVerificationScreen | IMPLEMENTADA (ATIVA) | AuthNavigator |

## 2) design-telas-clientes

| Tela de design | Tela no app | Status | Observacao |
|---|---|---|---|
| avaliar_prestador | RateProviderScreen | IMPLEMENTADA (ATIVA) | AppNavigator |
| buscando_prestador | SearchingProviderScreen | IMPLEMENTADA (ATIVA) | AppNavigator |
| historico_de_pedidos_(cliente)_ | ClientHistoryScreen | IMPLEMENTADA (ATIVA) | ClientTabNavigator |
| metodos_de_pagamento | PaymentMethodsScreen | IMPLEMENTADA (ATIVA) | AppNavigator (import via client index) |
| meu_perfil_(cliente)_1 | ClientProfileScreen | IMPLEMENTADA (ATIVA) | ClientTabNavigator |
| meu_perfil_(cliente)_2 | ClientInfoScreen | IMPLEMENTADA (ATIVA) | AppNavigator |
| meu_perfil_(cliente)_3 | ClientEditProfileScreen | IMPLEMENTADA (ATIVA) | AppNavigator |
| notificacoes_e_alertas | NotificationsScreen | IMPLEMENTADA (ATIVA) | AppNavigator (import via client index) |
| perfil_do_prestador_de_servicos | ProviderProfileScreen | IMPLEMENTADA (ATIVA) | AppNavigator |
| tela_de_acompanhamento_de_servico | ServiceTrackingScreen | IMPLEMENTADA (ATIVA) | AppNavigator |
| tela_de_cadastro | SignUpScreen | PARCIAL | Pasta sem `code.html` nesse pacote (somente `screen.png`), mapeada para cadastro global |
| tela_de_confirmacao_de_servico | ServiceConfirmationScreen | IMPLEMENTADA (ATIVA) | AppNavigator |
| tela_de_mensagens_chat | ChatScreen | IMPLEMENTADA (ATIVA) | AppNavigator |
| tela_principal_do_cliente | ClientHomeScreen | IMPLEMENTADA (ATIVA) | ClientTabNavigator |
| tela-exibir-todos-os-servicos | ClientAllServicesScreen | IMPLEMENTADA (ATIVA) | AppNavigator / ClientTabNavigator |

## 3) design-telas-completar-perfil

| Tela de design | Tela no app | Status | Observacao |
|---|---|---|---|
| tela_de_boas-vindas_ao_perfil | ProfileWelcomeScreen | IMPLEMENTADA (ATIVA) | AuthNavigator |
| tela_de_informacoes_pessoais | PersonalInfoScreen | IMPLEMENTADA (ATIVA) | AuthNavigator |
| tela_de_selecao_de_funcao | RoleSelectionScreen | IMPLEMENTADA (ATIVA) | AuthNavigator |

## 4) design-telas-configuracoes-gerais-cliente-prestadores

| Tela de design | Tela no app | Status | Observacao |
|---|---|---|---|
| adicionar_cartao | AddCardScreen | IMPLEMENTADA (NAO ATIVA/STUB) | AppNavigator importa `../screens/settings` (barrel stub) |
| atividade_da_conta | - | AUSENTE | Sem tela dedicada |
| autenticacao_de_dois_fatores | SecurityScreen | PARCIAL | Existe switch, sem fluxo 2FA dedicado |
| configuracoes_do_cliente_1 | SettingsScreen | IMPLEMENTADA (NAO ATIVA/STUB) | Arquivo real existe, rota atual do stack usa stub |
| configuracoes_do_cliente_2 | - | AUSENTE | Sem segunda tela dedicada |
| configurar_2fa_app_autenticador | - | AUSENTE | Sem tela dedicada |
| configurar_2fa_sms | - | AUSENTE | Sem tela dedicada |
| excluir_conta_do_cliente | SecurityScreen | PARCIAL | Acao textual sem fluxo/tela dedicada |
| sessoes_ativas | SecurityScreen | PARCIAL | Secao existe, sem tela dedicada |
| sobre_o_aplicativo | AboutScreen | IMPLEMENTADA (NAO ATIVA/STUB) | Arquivo real existe, rota atual do stack usa stub |
| suporte_ao_cliente | SupportScreen | IMPLEMENTADA (NAO ATIVA/STUB) | Arquivo real existe, rota atual do stack usa stub |
| tela_de_seguranca | SecurityScreen | IMPLEMENTADA (NAO ATIVA/STUB) | Arquivo real existe, rota atual do stack usa stub |
| termos_e_politicas_1 | - | AUSENTE | Sem tela dedicada |
| termos_e_politicas_2 | - | AUSENTE | Sem tela dedicada |

## 5) design-telas-prestadores

| Tela de design | Tela no app | Status | Observacao |
|---|---|---|---|
| historico_de_atendimentos | ProviderHistoryScreen | IMPLEMENTADA (ATIVA) | ProviderTabNavigator importa arquivo real |
| meus_servicos_(prestador)_ | ProviderServicesScreen | IMPLEMENTADA (ATIVA) | ProviderTabNavigator importa arquivo real |
| tela_de_aceite_servico_prestador | ServiceAcceptanceScreen | IMPLEMENTADA (NAO ATIVA/STUB) | Rota overlay no AppNavigator usa barrel stub |
| tela_de_configuracao_de_disponibilidade | AvailabilityConfigScreen | IMPLEMENTADA (NAO ATIVA/STUB) | Rota overlay no AppNavigator usa barrel stub |
| tela_de_registro_de_especialidade | SpecialtyRegistrationScreen | IMPLEMENTADA (NAO ATIVA/STUB) | Rota overlay no AppNavigator usa barrel stub |
| tela_de_verificacao_de_documentos | DocumentVerificationScreen | IMPLEMENTADA (NAO ATIVA/STUB) | Rota overlay no AppNavigator usa barrel stub |
| tela_principal_do_prestador | ProviderMainScreen | IMPLEMENTADA (ATIVA) | ProviderTabNavigator importa arquivo real |

## Resumo numérico

Total de telas de design analisadas: 48

- IMPLEMENTADA (ATIVA): 29
- IMPLEMENTADA (NAO ATIVA/STUB): 9
- PARCIAL: 4
- AUSENTE: 6

## Evidencias tecnicas principais

- `AppNavigator` importa settings/provider por barrel:
  - `mobile/src/navigation/AppNavigator.tsx` (imports de `../screens/settings` e `../screens/provider`)
- Barrels com stub ativo:
  - `mobile/src/screens/settings/index.tsx`
  - `mobile/src/screens/provider/index.tsx`
- Arquivos reais existem (mas nao usados nessas rotas do stack):
  - `mobile/src/screens/settings/*.tsx`
  - `mobile/src/screens/provider/*.tsx`
- Provider tabs usam arquivos reais diretamente:
  - `mobile/src/navigation/ProviderTabNavigator.tsx`

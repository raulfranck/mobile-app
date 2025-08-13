```md
# 🧠 Projeto Detector de Bocejo - Aplicativo Mobile

Este é um projeto mobile híbrido (Android e iOS) criado com o objetivo de detectar bocejos utilizando a câmera frontal do dispositivo, com suporte à detecção em tempo real e armazenamento dos eventos para geração de relatórios.

## 📱 Stack Tecnológica

- **React Native (Expo + Bare Workflow)**: Interface híbrida e acesso à câmera.
- **Supabase**:
  - Autenticação de usuários.
  - Armazenamento de dados e imagens (PostgreSQL e Supabase Storage).
- **react-native-mediapipe**:
  - Leitura dos keypoints faciais via câmera.
  - Suporte a análises em tempo real dos quadros.
- **Node.js/Express (API externa)**:
  - A API responsável por interpretar os keypoints e retornar se há ou não bocejo.

## 🗂 Estrutura de Pastas Sugerida

```

/app
/components       → Componentes reutilizáveis
/screens          → Telas principais do app
/services
/api            → Comunicação com APIs externas
/supabase       → Integração com Supabase
/lib
/mediapipe      → Configuração e wrappers do react-native-mediapipe
/utils          → Funções utilitárias
/store            → Contextos/estado global (ex: Auth, Session, etc.)
/assets           → Imagens, fontes, etc.
/types            → Tipagens TypeScript compartilhadas

index.tsx           → Ponto de entrada da aplicação

```

## 🔄 Fluxo Básico

1. **Usuário loga via Supabase** (e-mail/senha ou social).
2. App solicita permissão da câmera.
3. Camera inicia com `react-native-mediapipe` habilitado.
4. A cada 10 frames capturados, os keypoints são enviados à **API externa**.
5. A resposta da API (bocejou/não bocejou) é processada:
   - Se **bocejou**:
     - Captura-se a imagem do momento.
     - Envia-se para o Supabase (Storage + Postgres) a imagem + dados (timestamp, status).
6. O app mantém sessão com os registros, e ao final, apresenta um relatório com todos os eventos.

## 🗃 Supabase - Estrutura de Dados

Tabela: `yawn_events`

| Campo            | Tipo         | Descrição                            |
|------------------|--------------|----------------------------------------|
| id               | UUID         | Chave primária                        |
| user_id          | UUID         | ID do usuário autenticado             |
| timestamp        | timestamptz  | Momento do bocejo                     |
| image_url        | text         | URL da imagem no Supabase Storage     |
| keypoints        | jsonb        | Keypoints capturados (face landmarks) |
| created_at       | timestamptz  | Data de criação do registro           |

## 📐 Padrões e Convenções

- **TypeScript** em todo o projeto.
- Modularização clara por domínio.
- Hooks e Context API para gerenciamento de estado local/global.
- Comunicação com APIs feita via `fetch` ou `axios`, abstraída no `services/api`.

## 📌 Regras de Negócio

- Um evento de bocejo deve ser registrado com imagem e keypoints.
- O app não deve travar o uso caso a API esteja offline (usar fallback para registro local e upload posterior).
- Relatórios por sessão devem ser gerados com base nos eventos de bocejo.
- As sessões poderão futuramente ser associadas a contextos (ex: tempo de estudo, direção etc).

---
```

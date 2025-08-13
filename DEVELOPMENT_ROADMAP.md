# 🛣️ Roadmap de Desenvolvimento - Detector de Bocejo

Este documento orienta o desenvolvimento completo do aplicativo mobile de detecção de bocejo, seguindo os padrões e arquitetura definidos no projeto.

## 🚀 **RESUMO EXECUTIVO**

### 📊 **Status Atual:**
✅ **Projeto Funcional** - Roda via `npm start` + Expo Go
✅ **Base Técnica Sólida** - TypeScript, ESLint, Prettier configurados  
✅ **Arquitetura Definida** - Estrutura de pastas e tipagens criadas
✅ **Dependências Instaladas** - Supabase, MediaPipe, Camera prontos

### 🎯 **Próximo Passo:** 
**Fase 2 - Autenticação e Supabase** — Em andamento (cliente precisa configurar Supabase)

### 📱 **Como Testar Agora:**
```bash
npm start  # Inicia o servidor Expo
# Escaneie QR Code com Expo Go no celular
```

### 🛠️ **Tecnologias Configuradas:**
- **React Native** + Expo 53.0.20
- **TypeScript** (strict mode)
- **Supabase** 2.53.0 (auth + database + storage)
- **MediaPipe** 0.6.0 (detecção facial)
- **Expo Camera** 16.1.11 (acesso à câmera)

## 📋 Status Geral
- [x] **Fase 1**: Configuração Base e Estrutura ✅ **COMPLETA**
- [x] **Fase 2**: Autenticação e Supabase 🎯 **EM DESENVOLVIMENTO**
- [ ] **Fase 3**: MediaPipe e Câmera
- [ ] **Fase 4**: Detecção de Bocejo
- [ ] **Fase 5**: Storage e Sincronização
- [ ] **Fase 6**: UI/UX e Relatórios
- [ ] **Fase 7**: Testes e Otimização

## 🎯 **Progresso Atual:**
```
✅ FASE 1 (100%) - Configuração Base
   ├── ✅ Expo 53.0.20 configurado
   ├── ✅ Dependências instaladas (Supabase, MediaPipe, etc.)
   ├── ✅ TypeScript strict + ESLint v9 + Prettier
   ├── ✅ Estrutura de pastas criada
   ├── ✅ Permissões de câmera configuradas
   └── ✅ Projeto testável via Expo Go

🚧 FASE 2 (100%) - Autenticação
   ├── ✅ Cliente Supabase configurado (AsyncStorage, refresh, persistência)
   ├── ✅ Serviços de Auth (signIn/signUp/signOut/onAuthStateChange)
   ├── ✅ Contexto global de Auth (persistência de sessão)
   ├── ✅ Telas de Login e Cadastro (validações básicas)
   ├── ✅ Tela Home pós-login com botão Sair (placeholder de menu)
   ├── ✅ Guia completo de configuração do Supabase (README)
   ├── ✅ Criar projeto no Supabase (cliente)
   ├── ✅ Tabela `yawn_events` + RLS (cliente)
   └── ✅ Bucket `yawn-images` (cliente)
```

---

## 🚀 **FASE 1: Configuração Base e Estrutura** ✅ **COMPLETA**

### 1.1 Setup do Projeto ✅
- [x] **Expo configurado** (SDK 53.0.20 com newArchEnabled)
- [x] **Dependências principais instaladas:**
  - [x] `react-native-mediapipe@0.6.0` ✅
  - [x] `@supabase/supabase-js@2.53.0` ✅
  - [x] `expo-camera@16.1.11` ✅
  - [x] `@react-native-async-storage/async-storage@2.2.0` ✅
  - [x] `react-native-fs@2.20.0` ✅
  - [x] `expo-av@15.1.7` (para recursos de mídia) ✅
- [x] **TypeScript strict mode** configurado ✅
- [x] **ESLint v9 + Prettier** configurados ✅

### 1.2 Estrutura de Pastas ✅
- [x] **Estrutura completa criada:**
  ```
  ✅ /app/                 → Navegação principal
  ✅ /components/          → Componentes reutilizáveis
  ✅ /screens/            → Telas principais
  ✅ /services/
    ✅ /api/              → APIs externas
    ✅ /supabase/         → Integração Supabase
  ✅ /lib/
    ✅ /mediapipe/        → Configuração MediaPipe
    ✅ /utils/            → Funções utilitárias
  ✅ /store/              → Context API (Auth, Session)
  ✅ /assets/             → Recursos estáticos (existente)
  ✅ /types/              → Tipagens TypeScript
  ```

### 1.3 Configuração de Ambiente ✅
- [x] **`.env` criado** com variáveis do Supabase e API externa ✅
- [x] **`app.json` atualizado** com:
  - [x] Permissões de câmera (iOS/Android) ✅
  - [x] Nome do app: "Yawn Detector" ✅
  - [x] Platforms: iOS, Android ✅
  - [x] Permissões: CAMERA, STORAGE ✅
- [x] **Scripts npm adicionados** (lint, format, type-check) ✅

### 1.4 Arquivos Base Criados ✅
- [x] **`types/index.ts`** - Tipagens globais (User, YawnEvent, FaceLandmarks, etc.) ✅
- [x] **`lib/utils/index.ts`** - Funções utilitárias base ✅
- [x] **`components/index.ts`** - Arquivo de exportação ✅
- [x] **`screens/index.ts`** - Arquivo de exportação ✅
- [x] **`.env.example`** - Template de variáveis de ambiente ✅

### 1.5 Verificações de Qualidade ✅
- [x] **TypeScript:** 0 erros (npm run type-check) ✅
- [x] **ESLint:** Apenas 1 warning aceitável ✅
- [x] **Prettier:** Formatação consistente ✅
- [x] **Expo Start:** Projeto inicializa sem erros ✅

### 🧪 **Como Testar a Fase 1:**
```bash
# Verificar TypeScript
npm run type-check

# Verificar ESLint
npm run lint

# Iniciar o projeto
npm start
# Escaneie o QR Code com Expo Go no celular
```

---

## 🔐 **FASE 2: Autenticação e Supabase** 🎯 **PRÓXIMA**

> **Dependências:** `@supabase/supabase-js@2.53.0` ✅ já instalada

### 2.1 Configuração do Supabase 🎯
- [x] **Criar projeto no Supabase** ([supabase.com](https://supabase.com))
- [x] **Configurar autenticação:**
  - [x] Email/senha habilitado
  - [x] Confirmação por email (opcional)
  - [x] Configurar templates de email
- [x] **Criar tabela `yawn_events`:**
  ```sql
  CREATE TABLE yawn_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    timestamp TIMESTAMPTZ NOT NULL,
    image_url TEXT,
    keypoints JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- [x] **Configurar RLS (Row Level Security):**
  ```sql
  ALTER TABLE yawn_events ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Users can view own yawn events" ON yawn_events
    FOR SELECT USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can insert own yawn events" ON yawn_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);
  ```
- [x] **Criar bucket `yawn-images` no Storage** (público para leitura)
- [x] **Atualizar `.env`** com credenciais reais do Supabase

### 2.2 Configuração do Cliente Supabase 🎯
- [x] **`services/supabase/client.ts`** - Cliente configurado:
  ```typescript
  const supabaseConfig = {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  };
  ```
- [x] **`services/supabase/authService.ts`** - Abstração de auth
- [x] **`services/supabase/yawnEventService.ts`** - CRUD de eventos (básico)

### 2.3 Context de Autenticação 🎯
- [x] **`store/AuthContext.tsx`** - Context global:
  ```typescript
  interface AuthContextType {
    user: User | null;
    session: Session | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    loading: boolean;
  }
  ```
- [x] **Integração com AsyncStorage** para cache de sessão
- [x] **Auto-refresh de tokens** configurado
- [x] **Tratamento de erros** gracioso

### 2.4 Telas de Autenticação 🎯
- [x] **`screens/auth/LoginScreen.tsx`** - Tela de login
- [x] **`screens/auth/RegisterScreen.tsx`** - Tela de cadastro
- [x] **Tela Home pós-login** (`screens/home/HomeScreen.tsx`) com botão Sair
- [ ] **`components/AuthForm.tsx`** - Formulário reutilizável (opcional)
  - [x] Validação de email/senha básica
  - [x] Estados de loading
  - [x] Exibição de erros
- [ ] **Navegação entre telas** (React Navigation)
- [x] **Proteção de rotas** (condicional por sessão)

---

## 📱 **FASE 3: MediaPipe e Câmera**

### 3.1 Configuração do MediaPipe
- [ ] `lib/mediapipe/config.ts` - Configuração base:
  ```typescript
  const mediapipeConfig = {
    runningMode: 'VIDEO',
    maxNumFaces: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.5
  };
  ```
- [ ] `lib/mediapipe/faceDetector.ts` - Wrapper do face detection
- [ ] `lib/mediapipe/landmarkExtractor.ts` - Extração de keypoints

### 3.2 Componente de Câmera
- [ ] `components/CameraView.tsx` - Componente principal da câmera
- [ ] Implementar:
  - [ ] Verificação de permissões
  - [ ] Inicialização da câmera frontal
  - [ ] Resolução 640x480
  - [ ] Throttling (processar 1 de cada 10 frames)

### 3.3 Processamento de Frames
- [ ] `lib/mediapipe/frameProcessor.ts` - Processamento em background
- [ ] `types/mediapipe.ts` - Tipagens para landmarks
- [ ] Implementar:
  - [ ] Extração de keypoints faciais (468 pontos)
  - [ ] Cálculo da razão de aspecto da boca
  - [ ] Detecção de confiança > 0.7

---

## 🎯 **FASE 4: Detecção de Bocejo**

### 4.1 Lógica de Detecção
- [ ] `lib/utils/yawnDetector.ts` - Algoritmo de detecção:
  - [ ] Keypoints da boca (índices 0, 17, 18, 200)
  - [ ] Cálculo: altura_boca / largura_boca
  - [ ] Threshold: razão > 0.6 = possível bocejo
  - [ ] Validação: 3+ frames consecutivos

### 4.2 API Externa
- [ ] `services/api/yawnAnalysisApi.ts` - Integração com API externa
- [ ] Implementar:
  - [ ] `POST /api/analyze-yawn`
  - [ ] Rate limit: máximo 6 req/min
  - [ ] Timeout: 5s por request
  - [ ] Retry com exponential backoff (3 tentativas)

### 4.3 Gerenciamento de Sessão
- [ ] `store/SessionContext.tsx` - Context da sessão de detecção
- [ ] `services/sessionService.ts` - Lógica da sessão
- [ ] Implementar:
  - [ ] Controle de início/fim de sessão
  - [ ] Contagem de bocejos
  - [ ] Cálculo de frequência (bocejos/hora)
  - [ ] Estatísticas em tempo real

---

## 💾 **FASE 5: Storage e Sincronização**

### 5.1 Armazenamento de Eventos
- [ ] `services/supabase/yawnEventService.ts` - CRUD de eventos
- [ ] Implementar:
  - [ ] Captura de imagem no momento do bocejo
  - [ ] Compressão de imagem (70% qualidade)
  - [ ] Upload para Supabase Storage
  - [ ] Insert no banco com transação

### 5.2 Suporte Offline
- [ ] `services/offline/queueService.ts` - Fila local de eventos
- [ ] `services/offline/syncService.ts` - Sincronização automática
- [ ] Implementar:
  - [ ] Cache local com AsyncStorage
  - [ ] Detecção de status de rede
  - [ ] Sync automático quando online
  - [ ] Resolução de conflitos por timestamp

### 5.3 Gerenciamento de Storage
- [ ] `lib/utils/storageManager.ts` - Limpeza automática
- [ ] Implementar:
  - [ ] Remoção de imagens antigas (> 30 dias)
  - [ ] Monitoramento de espaço disponível
  - [ ] Alertas de storage cheio

---

## 🎨 **FASE 6: UI/UX e Relatórios**

### 6.1 Tela Principal de Detecção
- [ ] `screens/DetectionScreen.tsx` - Tela principal
- [ ] Componentes:
  - [ ] Preview da câmera
  - [ ] Contador de bocejos da sessão
  - [ ] Indicador de status da detecção
  - [ ] Botões iniciar/parar sessão

### 6.2 Feedback Visual
- [ ] `components/DetectionFeedback.tsx` - Indicadores visuais
- [ ] Implementar:
  - [ ] Loading durante processamento
  - [ ] Indicador de bocejo detectado
  - [ ] Vibração sutil (configurável)
  - [ ] Overlay com keypoints faciais (debug)

### 6.3 Relatórios e Histórico
- [ ] `screens/ReportScreen.tsx` - Relatórios de sessão
- [ ] `screens/HistoryScreen.tsx` - Histórico de sessões
- [ ] `components/SessionCard.tsx` - Card de sessão
- [ ] Implementar:
  - [ ] Gráficos de frequência
  - [ ] Galeria de imagens capturadas
  - [ ] Estatísticas detalhadas
  - [ ] Exportação de dados

### 6.4 Configurações
- [ ] `screens/SettingsScreen.tsx` - Configurações do app
- [ ] Implementar:
  - [ ] Sensibilidade de detecção
  - [ ] Frequência de análise
  - [ ] Toggle vibração
  - [ ] Modo offline
  - [ ] Limpeza de dados

---

## 🧪 **FASE 7: Testes e Otimização**

### 7.1 Testes Unitários
- [ ] Configurar Jest e React Native Testing Library
- [ ] Testes para:
  - [ ] Utilitários de detecção de bocejo
  - [ ] Serviços de API
  - [ ] Context providers
  - [ ] Hooks customizados

### 7.2 Testes de Integração
- [ ] Testes E2E com Detox
- [ ] Fluxos principais:
  - [ ] Login → Detecção → Salvamento
  - [ ] Offline → Online → Sincronização
  - [ ] Geração de relatórios

### 7.3 Otimização de Performance
- [ ] Profiling com Flipper
- [ ] Otimizações:
  - [ ] Memory leaks em useEffect
  - [ ] Throttling de processamento
  - [ ] Lazy loading de componentes
  - [ ] Otimização de imagens

### 7.4 Build e Deploy
- [ ] Configurar CI/CD
- [ ] Build para Android:
  - [ ] APK de desenvolvimento
  - [ ] Bundle para Play Store
- [ ] Build para iOS:
  - [ ] IPA de desenvolvimento
  - [ ] Build para App Store

---

## 🎯 **Critérios de Aceite por Fase**

### ✅ Fase 1 Completa quando: ✅ **REALIZADA**
- [x] Projeto roda no simulador/dispositivo ✅
- [x] Estrutura de pastas criada ✅
- [x] TypeScript configurado sem erros ✅
- [x] **ADICIONAL:** ESLint/Prettier configurados ✅
- [x] **ADICIONAL:** Dependências principais instaladas ✅
- [x] **ADICIONAL:** Permissões de câmera configuradas ✅

### ✅ Fase 2 Completa quando:
- [x] **Projeto Supabase criado** e configurado
- [x] **Tabela yawn_events** criada com RLS
- [x] **Storage bucket** configurado
- [x] **Login/logout funcionando** com validação
- [x] **Sessão persistida** via AsyncStorage
- [x] **Context de autenticação** funcionando
- [x] **Telas de auth** navegando corretamente
- [x] **Proteção de rotas** implementada

### 🧪 **Como Testar a Fase 2:**
```bash
# 1. Configurar .env com credenciais reais do Supabase
# 2. Testar autenticação
npm start
# 3. Testar fluxos:
#    - Cadastro de novo usuário
#    - Login com usuário existente
#    - Logout
#    - Persistência de sessão (fechar e abrir app)
```

### ✅ Fase 3 Completa quando:
- Câmera inicializa corretamente
- MediaPipe detecta rosto
- Keypoints são extraídos

### ✅ Fase 4 Completa quando:
- Bocejo é detectado localmente
- API externa responde corretamente
- Sessão rastreia eventos

### ✅ Fase 5 Completa quando:
- Imagens são salvas no Supabase
- Modo offline funciona
- Sincronização automática

### ✅ Fase 6 Completa quando:
- UI intuitiva e responsiva
- Relatórios são gerados
- Configurações funcionam

### ✅ Fase 7 Completa quando:
- Testes passando
- Performance otimizada
- Builds funcionando

---

## 📚 **Recursos e Referências**

- [Expo Documentation](https://docs.expo.dev/)
- [React Native MediaPipe](https://github.com/cdiddy77/react-native-mediapipe)
- [Supabase React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-react-native)
- [Face Landmarks Reference](https://github.com/google/mediapipe/blob/master/docs/solutions/face_mesh.md)

---

## 📝 **Changelog & Controle de Versão**

### **v1.2 - Fase 2 (parcial) - Autenticação** (Data: Atual)
#### ✅ **Adicionado:**
- Cliente Supabase com persistência e auto-refresh
- Serviços de autenticação e eventos (básico)
- Contexto global de Auth + persistência de sessão
- Telas de Login e Cadastro com validações
- Tela Home com menu (placeholders) e botão Sair
- Guia completo de configuração do Supabase no README

#### ⏳ **Pendente (cliente):**
- Criar projeto Supabase, tabela `yawn_events` + RLS, bucket `yawn-images`

#### 🎯 **Próxima Versão (v1.3):**
- Integração MediaPipe (Fase 3) + Componente de câmera
- React Navigation com tabs (Detecção, Histórico, Perfil)

### **v1.1 - Fase 1 Implementada** (Histórico)

### **v1.0 - Setup Inicial** 
- Projeto criado com Expo
- Dependências básicas do React Native
- Estrutura inicial do projeto

---

## 🎯 **Métricas de Progresso**

```
📊 PROGRESSO GERAL: 21.4% (1.5/7 fases)

✅ FASE 1: 100% - Configuração Base
🚧 FASE 2:  60% - Autenticação e Supabase  
⏳ FASE 3:   0% - MediaPipe e Câmera
⏳ FASE 4:   0% - Detecção de Bocejo
⏳ FASE 5:   0% - Storage e Sincronização
⏳ FASE 6:   0% - UI/UX e Relatórios
⏳ FASE 7:   0% - Testes e Otimização
```

**📅 Estimativa de Conclusão:** 7-10 semanas (1-2 semanas por fase)

---

**⚠️ Lembretes Importantes:**
- Sempre seguir os padrões TypeScript
- Implementar tratamento de erro em cada fase  
- Testar em dispositivos reais (não apenas simulador)
- Considerar limitações de bateria e performance
- Documentar decisões arquiteturais importantes
- **Atualizar este roadmap** conforme progresso das fases
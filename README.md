# Yawn Detector (Mobile App)

Aplicativo mobile (React Native + Expo) para detectar bocejos usando MediaPipe, com autenticação, banco e storage via Supabase.

## Sumário
- Visão geral
- Requisitos
- Configuração do ambiente
- Configuração do Supabase
- Variáveis de ambiente (.env)
- Executando o projeto
- Fluxo de autenticação (Fase 2)
- Estrutura do projeto
- Troubleshooting

## Visão geral
- Frontend: React Native (Expo SDK 53), TypeScript, ESLint/Prettier
- Auth/DB/Storage: Supabase
- Detecção facial: react-native-mediapipe (implementação a partir da Fase 3)

## Requisitos
- Node.js LTS (18+)
- npm 10+ ou yarn
- Expo CLI (via npx)
- Dispositivo físico (recomendado para câmera)

## Configuração do ambiente
1) Instale dependências:
```bash
npm install
npx expo install --fix
```
2) Se usar mediapipe (após Fase 3), gere nativos:
```bash
npx expo prebuild
```
3) Se aparecer erro de plugin (ex: expo-media-library), instale:
```bash
npx expo install expo-media-library
```

## Configuração do Supabase
1) Crie um projeto em `https://supabase.com`.

2) Authentication → Providers:
- Habilite Email/Password
- Confirmação por email é opcional

3) SQL → extensões:
```sql
create extension if not exists pgcrypto;
```

4) Banco de Dados → SQL → execute:
```sql
create table if not exists public.yawn_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  timestamp timestamptz not null,
  image_url text,
  keypoints jsonb not null,
  created_at timestamptz default now()
);

alter table public.yawn_events enable row level security;

create policy "Users can view own yawn events" on public.yawn_events
  for select using (auth.uid() = user_id);

create policy "Users can insert own yawn events" on public.yawn_events
  for insert with check (auth.uid() = user_id);

create index if not exists idx_yawn_events_user_id on public.yawn_events(user_id);
create index if not exists idx_yawn_events_timestamp on public.yawn_events(timestamp desc);
```

5) Storage → crie bucket `yawn-images`:
- Leitura pública (para exibir no app)
- Escrita por usuários autenticados (opcional; bucket público já libera leitura)

Políticas (opcional, se quiser reforçar):
```sql
create policy "Authenticated can upload to yawn-images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'yawn-images');

create policy "Owner can update/delete own files in yawn-images"
  on storage.objects for update using (bucket_id = 'yawn-images' and owner = auth.uid())
  with check (bucket_id = 'yawn-images' and owner = auth.uid());

create policy "Public can read yawn-images"
  on storage.objects for select using (bucket_id = 'yawn-images');
```

## Variáveis de ambiente (.env)
Crie um arquivo `.env` na raiz com:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=SEU-ANON-KEY
# Ajustáveis futuramente
EXPO_PUBLIC_API_TIMEOUT=5000
EXPO_PUBLIC_ENABLE_DEBUG_LOGS=true
```
Após editar o `.env`, reinicie o servidor (`npm start`).

## Executando o projeto

Há dois modos: Expo Go (sem nativos) e Development Build (com nativos). Este projeto usa câmera + ONNX, então você PRECISA usar Development Build em dispositivo físico Android. Emulador Android geralmente não oferece câmera funcional para este caso.

### 1) Primeira execução (configuração inicial)
1. Requisitos no Windows:
   - JDK 17 instalado e no PATH (`java -version` → 17.x)
   - Android SDK instalado (Android Studio) e variáveis definidas:
     - `ANDROID_HOME`/`ANDROID_SDK_ROOT` → `C:\Users\SEU_USUARIO\AppData\Local\Android\Sdk`
     - PATH inclui: `%ANDROID_HOME%\platform-tools`, `%ANDROID_HOME%\emulator`, `%ANDROID_HOME%\cmdline-tools\latest\bin`
   - ADB acessível (`adb devices`)
2. Instale dependências e gere nativos:
   ```bash
   npm install
   npx expo install --fix
   npx expo prebuild
   ```
3. Conecte um dispositivo Android físico com Depuração USB ativada (emulador não serve para câmera neste projeto):
   - Ative “Opções do desenvolvedor” e “Depuração USB”
   - Se necessário, defina USB como “Transferência de arquivos (MTP)”
   - Instale drivers (Samsung USB Driver/Smart Switch, se for Samsung)
   - `adb devices` deve listar seu aparelho como `device`
4. Compile e instale o app no dispositivo:
   ```bash
   npx expo run:android
   ```
5. Inicie o bundler em modo Development Build e faça o túnel USB:
   ```bash
   npx expo start --dev-client -c
   adb reverse tcp:8081 tcp:8081
   ```
6. Abra o app “Yawn Detector” no celular (não use Expo Go). O bundle JS será carregado pelo Metro (terminal do `expo start`).

### 2) Como voltar a rodar depois de desligar/reiniciar
1. Conecte o celular (Depuração USB ativa) e confirme:
   ```bash
   adb devices
   ```
2. Na pasta do projeto, apenas inicie o bundler no modo Development Build e faça o reverse (não precisa recompilar nativos):
   ```bash
   npx expo start --dev-client -c
   adb reverse tcp:8081 tcp:8081
   ```
3. Abra o app “Yawn Detector” já instalado no celular. Se necessário, pressione `a` no terminal do Metro para abrir no Android.

Observações importantes:
- Expo Go não suporta `onnxruntime-react-native` nem VisionCamera/MediaPipe. Use sempre Development Build.
- Em caso de alterações em bibliotecas nativas (ex.: instalar VisionCamera, Reanimated, ONNX):
  - Rode novamente: `npx expo prebuild` e depois `npx expo run:android`.
- Em caso de erro de conexão com o Metro:
  - Rode `adb reverse tcp:8081 tcp:8081` e abra o app novamente.
- Em muitos PCs, usar apenas dispositivo físico para câmera é obrigatório (emuladores podem não expor câmera adequadamente).

## Fluxo de autenticação (Fase 2)
- Cliente Supabase: `services/supabase/client.ts`
- Serviços de auth: `services/supabase/authService.ts`
- Contexto global: `store/AuthContext.tsx`
- Telas: `screens/auth/LoginScreen.tsx`, `screens/auth/RegisterScreen.tsx`
- Tela pós-login: `screens/home/HomeScreen.tsx` (menu + sair)

Como testar:
1) Preencha `.env` com URL e ANON KEY do seu projeto Supabase
2) `npm start`
3) No app: Cadastre → Faça login → Verifique Home → Sair

## Estrutura do projeto
```
/app/
/components/
/screens/
/services/
  /api/
  /supabase/
/lib/
  /mediapipe/
  /utils/
/store/
/assets/
/types/
```

## Troubleshooting
- Erro: "Failed to resolve plugin expo-media-library" → instale o pacote:
```bash
npx expo install expo-media-library
```
- Erro: “Using Expo Go” no Metro → você deve iniciar com `--dev-client`. Use:
  ```bash
  npx expo start --dev-client -c
  ```
- Erro: “SDK location not found” → crie `android/local.properties`:
  ```
  sdk.dir=C:\\Users\\SEU_USUARIO\\AppData\\Local\\Android\\Sdk
  ```
- Erro de ADB não encontrado → defina `ANDROID_HOME`/`ANDROID_SDK_ROOT` e adicione `platform-tools` ao PATH. Valide com `where adb` e `adb version`.
- Dispositivo não aparece no `adb devices` → troque o cabo USB (de dados), aceite o pop‑up de depuração no celular, instale drivers (Samsung USB Driver/Smart Switch) e garanta modo MTP.
- Build falha com “ninja build.ninja dirty” (Windows) → limpe caches `.cxx`, `gradlew clean`, e force apenas `arm64-v8a`:
  - `android/gradle.properties`: `reactNativeArchitectures=arm64-v8a`
  - `android/app/build.gradle` → `defaultConfig { ndk { abiFilters 'arm64-v8a' } }`
  - Refaça: `npx expo prebuild --clean && npx expo run:android`
- Erro: "Cannot find module '@/screens/profile/ProfileScreen'" → arquivo não existe; use `HomeScreen` ou recrie a tela de perfil.
- Variáveis não carregam → confirme prefixo `EXPO_PUBLIC_` e reinicie `npm start`.
- Sessão não persiste → confirme `AsyncStorage` instalado e `AuthProvider` envolvendo o app.


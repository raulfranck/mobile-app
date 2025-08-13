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
```bash
npm start
# Escaneie o QR Code com o aplicativo Expo Go
```

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
- Erro: "Cannot find module '@/screens/profile/ProfileScreen'" → arquivo não existe; use `HomeScreen` ou recrie a tela de perfil.
- Variáveis não carregam → confirme prefixo `EXPO_PUBLIC_` e reinicie `npm start`.
- Sessão não persiste → confirme `AsyncStorage` instalado e `AuthProvider` envolvendo o app.

## Próximos passos
- Fase 3: MediaPipe (câmera + extração de keypoints)
- Fase 4: Detecção de bocejo (algoritmo + API externa)
- Fase 5: Upload de imagens (Supabase Storage) e sincronização offline


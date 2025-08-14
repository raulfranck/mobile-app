# Integração ONNX (Modelo LSTM de Fadiga)

Este guia explica como usar o modelo `.onnx` (LSTM) no app React Native, replicando a lógica do `ia/run.py`.

## 1) Dependências

Instale o runtime ONNX para React Native:
```bash
npm install onnxruntime-react-native
```

## 2) Colocar o modelo no app

- Recomendado: mover o arquivo para `assets/models/model_lstm_3_45_euclidean.onnx`.
- Alternativa: manter em outro local e obter um URI de arquivo acessível no dispositivo.

Dica: quando o arquivo está em `assets/` e é referenciado via `require`, o bundler irá empacotar para o app.

## 3) API de detecção

A classe `YawnDetector` implementa:
- Janela deslizante de 45 frames
- Normalização dos keypoints (nariz como centro; distância entre olhos como escala)
- Inferência ONNX e mapeamento para rótulos: `Alerta`, `Bocejando`, `Microsleep`

Arquivo: `lib/onnx/yawnDetector.ts`.

Uso básico:
```ts
import YawnDetector from '@/lib/onnx/yawnDetector';

const detector = new YawnDetector(45);
await detector.initializeFromUri(modelUri); // Passe um URI válido do modelo

// A cada frame (após extrair landmarks do MediaPipe)
const result = await detector.addFrameAndPredict(landmarks);
if (result) {
  console.log(result.predictedClass, result.label, result.probabilities);
}
```

Observação: `landmarks` deve ser um array de objetos `{ x, y, z? }` conforme retornado pelo MediaPipe.

## 4) Obtendo o URI do modelo

- Se o arquivo estiver em `assets/`:
```ts
import { Asset } from 'expo-asset';
const asset = Asset.fromModule(require('../assets/models/model_lstm_3_45_euclidean.onnx'));
await asset.downloadAsync();
const modelUri = asset.localUri!; // use no initializeFromUri
```

- Se o arquivo estiver fora de `assets/`, garanta que ele exista no sistema de arquivos do app (ex.: baixado de uma URL) e passe o caminho local para `initializeFromUri`.

## 5) Conectando ao MediaPipe (Fase 3)

Quando a câmera/MediaPipe estiverem implementados:
- Extraia os landmarks faciais
- Envie `landmarks` para `addFrameAndPredict`
- Só haverá resultado após preencher a janela (45 frames)

## 6) Performance

- Faça throttling (ex.: 1 a cada 10 frames)
- Faça processamento fora da UI (JS thread leve)
- Pausar quando app estiver em background

## 7) Debug

- Se o modelo for binário (1 saída), o código faz fallback para limiar 0.5
- Para multiclasses, lê o argmax das probabilidades
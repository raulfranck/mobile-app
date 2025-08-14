import * as ort from 'onnxruntime-react-native';

type Landmark = { x: number; y: number; z?: number };

const WINDOW_SIZE = 45;

// Índices selecionados baseados no run.py
const FACE_IDX: Record<string, number[]> = {
  mouth_outer: [61, 40, 37, 0, 267, 270, 291],
  mouth_inner: [78, 95, 14, 317, 308],
  left_eye: [33, 160, 158, 133, 153, 144, 145],
  right_eye: [362, 385, 387, 263, 373, 380, 381],
  left_brow: [70, 105, 107],
  right_brow: [336, 334, 300],
  nose: [1, 2, 168],
  chin: [152],
};

const ALL_INDICES: number[] = Array.from(
  new Set(Object.values(FACE_IDX).flat()),
).sort((a, b) => a - b);

function euclidean(p1: Landmark, p2: Landmark): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function normalizeKeypoints(landmarks: Landmark[]): number[] {
  const keypoints: number[] = [];

  const noseIdx = 1;
  const leftEyeIdx = 33;
  const rightEyeIdx = 263;

  const nose = landmarks[noseIdx];
  if (!nose) return new Array(ALL_INDICES.length * 2).fill(0);

  const leftEye = landmarks[leftEyeIdx];
  const rightEye = landmarks[rightEyeIdx];
  let scale = 1.0;
  if (leftEye && rightEye) {
    scale = euclidean(leftEye, rightEye) || 1.0;
  }

  for (const idx of ALL_INDICES) {
    const lm = landmarks[idx];
    if (lm) {
      const x = (lm.x - nose.x) / scale;
      const y = (lm.y - nose.y) / scale;
      keypoints.push(x, y);
    } else {
      keypoints.push(0, 0);
    }
  }

  return keypoints;
}

export type YawnState = 'Alerta' | 'Bocejando' | 'Microsleep';

export interface DetectionResult {
  predictedClass: 0 | 1 | 2;
  label: YawnState;
  probabilities?: number[];
}

export class YawnDetector {
  private session: ort.InferenceSession | null = null;
  private inputName: string | null = null;
  private readonly window: number[][] = [];
  private readonly windowSize: number;

  constructor(windowSize: number = WINDOW_SIZE) {
    this.windowSize = windowSize;
  }

  /**
   * Inicializa a sessão ONNX a partir de um URI do modelo (arquivo local no dispositivo)
   */
  async initializeFromUri(modelUri: string): Promise<void> {
    this.session = await ort.InferenceSession.create(modelUri);
    const names: string[] | undefined = (this.session as unknown as { inputNames?: string[] }).inputNames;
    this.inputName = names && names.length > 0 ? names[0] : null;
  }

  /**
   * Adiciona landmarks de um frame; quando a janela atinge o tamanho, roda a inferência
   */
  async addFrameAndPredict(landmarks: Landmark[] | null): Promise<DetectionResult | null> {
    if (!this.session) throw new Error('YawnDetector não inicializado');

    const features = landmarks ? normalizeKeypoints(landmarks) : new Array(ALL_INDICES.length * 2).fill(0);

    this.window.push(features);
    if (this.window.length > this.windowSize) {
      this.window.shift();
    }

    if (this.window.length < this.windowSize) {
      return null; // Aguardando preencher a janela
    }

    const featureSize = this.window[0].length;
    const inputData = new Float32Array(this.windowSize * featureSize);
    // Flatten [windowSize, featureSize]
    for (let i = 0; i < this.windowSize; i++) {
      inputData.set(this.window[i], i * featureSize);
    }

    const tensor = new ort.Tensor('float32', inputData, [1, this.windowSize, featureSize]);
    const feeds: Record<string, ort.Tensor> = {};
    const feedName = this.inputName ?? 'input';
    feeds[feedName] = tensor;

    const outputMap = await this.session.run(feeds);
    const first = Object.values(outputMap)[0] as ort.Tensor;
    const data = Array.from(first.data as Float32Array);

    let predicted: 0 | 1 | 2 = 0;
    if (data.length === 1) {
      predicted = data[0] > 0.5 ? 1 : 0; // binário (fallback)
    } else {
      let maxIdx = 0;
      let maxVal = -Infinity;
      for (let i = 0; i < data.length; i++) {
        if (data[i] > maxVal) {
          maxVal = data[i];
          maxIdx = i;
        }
      }
      predicted = maxIdx as 0 | 1 | 2;
    }

    const LABELS: YawnState[] = ['Alerta', 'Bocejando', 'Microsleep'];
    const label: YawnState = LABELS[predicted];
    return { predictedClass: predicted, label, probabilities: data };
  }
}

export default YawnDetector;


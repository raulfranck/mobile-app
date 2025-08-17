import type { FaceLandmarks } from '@/lib/mediapipe/types';

export interface FaceMeshOptions {
	runningMode: 'VIDEO' | 'IMAGE';
	maxNumFaces: number;
	minDetectionConfidence: number;
	minTrackingConfidence: number;
}

// Inicialização/armazenamento de opções (JSI real entra depois)
let currentOptions: FaceMeshOptions | null = null;

export function initializeFaceMesh(options: FaceMeshOptions): void {
	currentOptions = options;
}

// Worklet: quando integrarmos react-native-mediapipe, este método chamará o JSI nativo
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function detectLandmarksFromFrame(frame: any): FaceLandmarks | null {
	'worklet';
	// TODO: Integrar chamada real do MediaPipe aqui (react-native-mediapipe)
	// Por enquanto, retornar null para indicar "sem face" nesta simulação
	return null;
}


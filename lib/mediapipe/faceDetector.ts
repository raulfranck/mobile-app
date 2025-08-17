import type { FaceLandmarks, Landmark } from '@/lib/mediapipe/types';
import { VisionCameraProxy } from 'react-native-vision-camera';

export interface FaceMeshOptions {
	runningMode: 'VIDEO' | 'IMAGE';
	maxNumFaces: number;
	minDetectionConfidence: number;
	minTrackingConfidence: number;
}

// Inicialização/armazenamento de opções (JSI real entra depois)
let currentOptions: FaceMeshOptions | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let plugin: any | null = null;

function tryInitPlugin(): void {
	if (plugin) return;
	const options = currentOptions ?? {
		runningMode: 'VIDEO',
		maxNumFaces: 1,
		minDetectionConfidence: 0.7,
		minTrackingConfidence: 0.5,
	} satisfies FaceMeshOptions;
	// Tentar diferentes nomes comuns de plugin
	const candidates = ['faceMesh', 'mediapipeFaceMesh', 'faceLandmarks'];
	for (const name of candidates) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const p: any = VisionCameraProxy.initFrameProcessorPlugin?.(name, options);
		if (p) {
			plugin = p;
			break;
		}
	}
}

export function initializeFaceMesh(options: FaceMeshOptions): void {
	currentOptions = options;
	tryInitPlugin();
}

// Worklet: quando integrarmos react-native-mediapipe, este método chamará o JSI nativo
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function detectLandmarksFromFrame(frame: any): FaceLandmarks | null {
	'worklet';
	// Integração real via plugin (inicializado no thread JS)
	// @ts-expect-error plugin injected into worklet runtime
	const p = plugin;
	if (!p) return null;
	// Resultado esperado: array ou objeto com landmarks
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const result = p.call(frame);
	if (!result) return null;
	// Se plugin retornar diretamente um array de pontos
	if (Array.isArray(result)) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		const first = result[0];
		// Caso seja array de um único rosto com pontos {x,y,z}
		if (Array.isArray(first)) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const points = first as Array<{ x: number; y: number; z?: number }>;
			return { landmarks: points as unknown as Landmark[], confidence: 0.0, timestamp: Date.now() };
		}
		// Caso seja array plano de pontos
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const points = result as Array<{ x: number; y: number; z?: number }>;
		return { landmarks: points as unknown as Landmark[], confidence: 0.0, timestamp: Date.now() };
	}
	// Se vier como objeto { landmarks: [...] , confidence? }
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	const pts = (result as { landmarks?: Landmark[] }).landmarks;
	if (pts && Array.isArray(pts)) {
		return { landmarks: pts as Landmark[], confidence: 0.0, timestamp: Date.now() };
	}
	return null;
}


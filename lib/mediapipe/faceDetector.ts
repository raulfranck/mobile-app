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
let loadedPluginName: string | null = null;

function tryInitPlugin(): void {
	if (plugin) return;
	const options = currentOptions ?? {
		runningMode: 'VIDEO',
		maxNumFaces: 1,
		minDetectionConfidence: 0.7,
		minTrackingConfidence: 0.5,
	} satisfies FaceMeshOptions;
	// Tentar diferentes nomes comuns de plugin
	const candidates = ['faceLandmarks', 'faceMesh', 'mediapipeFaceMesh'];
	for (const name of candidates) {
		// Adaptar opções para o formato esperado pelo VisionCameraProxy
		const opts = {
			runningMode: options.runningMode,
			maxNumFaces: options.maxNumFaces,
			minDetectionConfidence: options.minDetectionConfidence,
			minTrackingConfidence: options.minTrackingConfidence,
		};
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const p: any = (VisionCameraProxy as any).initFrameProcessorPlugin?.(name, opts);
		if (p) {
			plugin = p;
			loadedPluginName = name;
			console.log(`[MediaPipe] Successfully loaded plugin: ${name}`);
			break;
		} else {
			console.log(`[MediaPipe] Failed to load plugin: ${name}`);
		}
	}
	if (!plugin) {
		console.error('[MediaPipe] No frame processor plugin found!');
	}
}

export function initializeFaceMesh(options: FaceMeshOptions): void {
	currentOptions = options;
	tryInitPlugin();
    // eslint-disable-next-line no-console
    console.log('[MediaPipe] plugin:', loadedPluginName ?? 'not found');
    
    // Tentar injetar plugin no contexto global do worklet
    if (plugin) {
    	try {
    		// @ts-expect-error worklet injection
    		global.faceLandmarks = plugin;
    		// @ts-expect-error worklet injection
    		global.__faceLandmarksPlugin = plugin;
    		console.log('[MediaPipe] Plugin injected into worklet context');
    	} catch (e) {
    		console.warn('[MediaPipe] Failed to inject plugin into worklet:', e);
    	}
    }
}

// Para debug: opcionalmente expor uma função de log quando landmarks chegarem (JS thread)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logFirstLandmark(data: FaceLandmarks | null): void {
	if (!data || !data.landmarks?.length) return;
	// eslint-disable-next-line no-console
	console.log('[MediaPipe] first point:', data.landmarks[0]);
}

// Função para processar frame no thread JS (chamada via runOnJS)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function processFrameOnJS(frameData: any): FaceLandmarks | null {
	if (!plugin) {
		console.log('[MediaPipe] Plugin not available on JS thread');
		return null;
	}
	
	try {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const result = plugin.call(frameData);
		if (!result) return null;
		
		// Se plugin retornar diretamente um array de pontos
		if (Array.isArray(result)) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			const first = result[0];
			// Caso seja array de um único rosto com pontos {x,y,z}
			if (Array.isArray(first)) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const points = first as Array<{ x: number; y: number; z?: number }>;
				return { landmarks: points as unknown as Landmark[], confidence: 1.0, timestamp: Date.now() };
			}
		}
	} catch (e) {
		console.error('[MediaPipe] Error processing frame on JS thread:', e);
	}
	
	return null;
}

// Worklet: quando integrarmos react-native-mediapipe, este método chamará o JSI nativo
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function detectLandmarksFromFrame(frame: any): FaceLandmarks | null {
	'worklet';
	// 1) Tentar usar plugin já injetado pelo JS thread
	// @ts-expect-error worklet global
	let p = global.__faceLandmarksPlugin ?? global.faceLandmarks;
	// 2) Se não houver, inicializar no worklet e cachear
	if (!p) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const opts: any = {
			runningMode: 'VIDEO',
			maxNumFaces: 1,
			minDetectionConfidence: 0.5,
			minTrackingConfidence: 0.3,
		};
		// Tentar inicializar o plugin diretamente no worklet
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const tmp: any = (VisionCameraProxy as any).initFrameProcessorPlugin?.('faceLandmarks', opts);
		if (tmp) {
			// @ts-expect-error worklet global
			global.__faceLandmarksPlugin = tmp;
			p = tmp;
		}
	}
	if (!p) {
		console.log('[MediaPipe] faceLandmarks plugin unavailable in worklet');
		return null;
	}
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


import type { FaceLandmarks, Landmark } from '@/lib/mediapipe/types';

// Conversão/utilitários de landmarks (placeholder)
export function toFaceLandmarks(points: Array<{ x: number; y: number; z?: number }>, confidence = 0.0): FaceLandmarks {
	const landmarks: Landmark[] = points.map((p) => ({ x: p.x, y: p.y, z: p.z }));
	return {
		landmarks,
		confidence,
		timestamp: Date.now(),
	};
}


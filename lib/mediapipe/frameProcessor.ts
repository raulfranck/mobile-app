import type { FaceLandmarks } from '@/lib/mediapipe/types';
import { detectLandmarksFromFrame } from '@/lib/mediapipe/faceDetector';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RunOnJSFn = (data: FaceLandmarks) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function processFrameWorklet(frame: any, throttleEvery: number, onResult?: RunOnJSFn): void {
	'worklet';
	// throttle simples por contador global
	// @ts-expect-error worklet global
	if (!global.__frameCounter) global.__frameCounter = 0;
	// @ts-expect-error worklet global
	global.__frameCounter = (global.__frameCounter + 1) | 0;
	// @ts-expect-error worklet global
	if (global.__frameCounter % throttleEvery !== 0) return;

	const result = detectLandmarksFromFrame(frame);
	if (result && onResult) onResult(result);
}


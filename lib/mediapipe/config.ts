export interface MediaPipeConfig {
	runningMode: 'VIDEO' | 'IMAGE';
	maxNumFaces: number;
	minDetectionConfidence: number;
	minTrackingConfidence: number;
}

// Configuração padrão (ver regras do projeto)
export const mediapipeConfig: MediaPipeConfig = {
	runningMode: 'VIDEO',
	maxNumFaces: 1,
	minDetectionConfidence: 0.7,
	minTrackingConfidence: 0.5,
};

export const CAMERA_FRAME_THROTTLE = 10; // processar 1 a cada 10 frames


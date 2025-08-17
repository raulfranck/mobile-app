export interface Landmark {
	x: number;
	y: number;
	z?: number;
}

export interface FaceLandmarks {
	landmarks: Landmark[];
	confidence: number;
	timestamp: number;
}


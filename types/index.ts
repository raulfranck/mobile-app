// Tipagens globais do projeto

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface YawnEvent {
  id: string;
  user_id: string;
  timestamp: string;
  image_url?: string;
  keypoints: FaceLandmarks;
  created_at: string;
}

export interface FaceLandmarks {
  landmarks: Array<{
    x: number;
    y: number;
    z: number;
  }>;
  confidence: number;
  timestamp: number;
}

export interface YawnDetectionData {
  landmarks: FaceLandmarks;
  mouthRatio: number;
  isYawning: boolean;
  frameCount: number;
}

export interface YawnSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  totalYawns: number;
  avgFrequency: number;
  events: YawnEvent[];
}

export interface DetectionSettings {
  sensitivity: 'low' | 'medium' | 'high';
  frequency: number;
  enableVibration: boolean;
  saveImages: boolean;
  offlineMode: boolean;
}

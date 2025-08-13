import supabase from './client';
import type { YawnEvent, FaceLandmarks } from '@/types';

export interface YawnEventData {
  userId: string;
  timestamp: string;
  imageUri?: string;
  keypoints: FaceLandmarks;
}

export class YawnEventService {
  async saveYawnEvent(data: YawnEventData): Promise<YawnEvent> {
    // Phase 2: persist basic event without storage until Phase 5
    const insertPayload = {
      user_id: data.userId,
      timestamp: data.timestamp,
      image_url: null,
      keypoints: data.keypoints,
    };

    const { data: insertData, error } = await supabase
      .from('yawn_events')
      .insert(insertPayload)
      .select()
      .single();

    if (error) throw error;
    return insertData as unknown as YawnEvent;
  }

  async getUserYawnEvents(userId: string): Promise<YawnEvent[]> {
    const { data, error } = await supabase
      .from('yawn_events')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return (data ?? []) as unknown as YawnEvent[];
  }
}

export default new YawnEventService();

import { invoke } from '@tauri-apps/api';
import { EnrichedEvent } from '../types';

export const commands = {
  startMonitoring: async (): Promise<void> => {
    return invoke('start_monitoring');
  },

  getRecentEvents: async (limit: number = 10): Promise<EnrichedEvent[]> => {
    return invoke('get_recent_events', { limit });
  }
};

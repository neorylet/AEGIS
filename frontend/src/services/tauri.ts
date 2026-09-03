import { invoke } from '@tauri-apps/api';
import { EnrichedEvent, AssetAnomaly, EventCounts, HourlyEvents } from '../types';

const withFallback = async <T,>(fn: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await fn();
  } catch (e) {
    // Browser fallback – @tauri-apps/api only works inside the Tauri window.
    console.debug('[tauri] fallback for invoke:', e);
    return fallback;
  }
};

export const commands = {
  startMonitoring: async (): Promise<void> => {
    return withFallback(async () => invoke<void>('start_monitoring'), undefined as void);
  },

  stopMonitoring: async (): Promise<void> => {
    return withFallback(async () => invoke<void>('stop_monitoring'), undefined as void);
  },

  getRecentEvents: async (limit: number = 10): Promise<EnrichedEvent[]> => {
    return withFallback<EnrichedEvent[]>(
      async () => invoke('get_recent_events', { limit }),
      [],
    );
  },

  getAnomalies: async (limit: number = 25): Promise<AssetAnomaly[]> => {
    return withFallback<AssetAnomaly[]>(
      async () => invoke('get_anomalies', { limit }),
      [],
    );
  },

  getAssetCount: async (): Promise<number> => {
    return withFallback<number>(
      async () => invoke('get_asset_count'),
      0,
    );
  },

  getEventCounts: async (): Promise<EventCounts> => {
    return withFallback<EventCounts>(
      async () => invoke('get_event_counts'),
      {
        process_events: 0,
        network_events: 0,
        total_events: 0,
        last_hour: { process: 0, network: 0, total: 0 },
      },
    );
  },

  getHourlyEvents24h: async (): Promise<HourlyEvents[]> => {
    return withFallback<HourlyEvents[]>(
      async () => invoke('get_hourly_events_24h'),
      [],
    );
  },
};

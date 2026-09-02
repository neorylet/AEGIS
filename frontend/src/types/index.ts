export type EventStatus = 'Info' | 'Warning' | 'Critical' | 'Resolved';

export type SecurityEvent = 
  | { Process: ProcessEvent }
  | { Network: NetworkEvent };

export interface EnrichedEvent {
  id?: number;
  timestamp: string;
  source: string;
  asset_id?: string;
  event: SecurityEvent;
  status?: EventStatus;
  details?: string;
}

export interface ProcessEvent {
  pid: number;
  name: string;
  parent_pid?: number;
  cpu_usage: number;
  memory_usage: number;
}

export interface NetworkEvent {
  local_ip: string;
  local_port: number;
  remote_ip: string;
  remote_port: number;
  protocol: string;
}

export interface StatCard {
  label: string;
  value: number;
  trend: 'up' | 'down' | 'neutral';
  trendValue?: number;
}

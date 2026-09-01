export interface EnrichedEvent {
  id?: number;
  timestamp: string;
  source: string;
  asset_id?: string;
  event: ProcessEvent | NetworkEvent;
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

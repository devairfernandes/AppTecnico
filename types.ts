
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  SPEEDTEST = 'SPEEDTEST',
  CHANNELS = 'CHANNELS',
  DEVICES = 'DEVICES',
  NETWORK_MAP = 'NETWORK_MAP',
  AI_ADVISOR = 'AI_ADVISOR',
  IP_CALCULATOR = 'IP_CALCULATOR',
  LATENCY_MONITOR = 'LATENCY_MONITOR',
  PORT_SCANNER = 'PORT_SCANNER',
  DNS_LOOKUP = 'DNS_LOOKUP',
  TRACEROUTE = 'TRACEROUTE',
  CHECKLISTS = 'CHECKLISTS',
  SUBNET_SCAN = 'SUBNET_SCAN',
  SERVICE_HEALTH = 'SERVICE_HEALTH',
  MAC_LOOKUP = 'MAC_LOOKUP'
}

export interface NetworkMetrics {
  ping: number;
  download: number;
  upload: number;
  jitter: number;
  isp: string;
  server: string;
  ip: string;
}

export interface WiFiChannel {
  channel: number;
  frequency: number;
  signal: number; // -100 to 0 dBm
  ssid: string;
  width: 20 | 40 | 80 | 160;
  isMine?: boolean;
}

export interface Device {
  id: string;
  name: string;
  type: 'phone' | 'laptop' | 'tv' | 'router' | 'iot' | 'desktop' | 'printer' | 'smart_speaker' | 'camera';
  ip: string;
  mac: string;
  status: 'online' | 'offline';
  signalStrength: number;
}

export type WifiNetwork = {
  ssid: string;
  bssid: string;
  signal: number;
  security: 'WPA2-PSK' | 'WPA3-SAE' | 'WEP' | 'Open';
  wps: boolean;
  channel: number;
};

export type ConnectionStatus = {
  ssid: string | null;
  mode: 'idle' | 'regular' | 'mitm';
};

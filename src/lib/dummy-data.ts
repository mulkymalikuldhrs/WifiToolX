import type { WifiNetwork } from './types';

const commonSsids = [
  'xfinitywifi', 'NETGEAR', 'linksys', 'dlink', 'CenturyLink', 'TP-Link_Guest',
  'MySpectrumWiFi', 'CoxWiFi', 'ASUS', 'Google_Home', 'Starbucks WiFi',
  'Airport_Free_WiFi', 'CoffeeBean_Free_WiFi', 'McDonalds Free WiFi', 'ATT-WiFi'
];

function generateBssid() {
  return 'XX:XX:XX:XX:XX:XX'.replace(/X/g, () => {
    return '0123456789ABCDEF'.charAt(Math.floor(Math.random() * 16));
  });
}

export function generateDummyNetworks(existingNetworks: WifiNetwork[] = []): WifiNetwork[] {
  const newNetworks: WifiNetwork[] = [...existingNetworks];
  const existingSsid = new Set(existingNetworks.map(n => n.ssid));
  const numToGenerate = Math.floor(Math.random() * 4) + 3; // Generate 3 to 6 new networks

  for (let i = 0; i < numToGenerate; i++) {
    let ssid = '';
    do {
      ssid = commonSsids[Math.floor(Math.random() * commonSsids.length)];
      if (Math.random() > 0.5) {
        ssid += `_${Math.floor(Math.random() * 900) + 100}`;
      }
    } while(existingSsid.has(ssid));
    
    existingSsid.add(ssid);

    newNetworks.push({
      ssid,
      bssid: generateBssid(),
      signal: Math.floor(Math.random() * 71) - 100, // -30 to -100
      security: ['WPA2-PSK', 'WPA3-SAE', 'Open'][Math.floor(Math.random() * 3)] as WifiNetwork['security'],
      wps: Math.random() > 0.4,
      channel: [1, 6, 11, 36, 40, 44, 48, 149, 153, 157, 161][Math.floor(Math.random() * 11)],
    });
  }

  // Randomly update signal strength of existing networks
  return newNetworks.map(network => ({
    ...network,
    signal: Math.max(-100, network.signal + Math.floor(Math.random() * 11) - 5) // Fluctuate signal by +/- 5
  })).sort((a, b) => b.signal - a.signal);
}

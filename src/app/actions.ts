'use server';

import {
  generatePasswordCandidates,
  type GeneratePasswordCandidatesInput,
} from '@/ai/flows/generate-password-candidates';
import type { WifiNetwork } from '@/lib/types';

// This function simulates scanning for networks on the backend.
function generateRealNetworks(existingNetworks: WifiNetwork[] = []): WifiNetwork[] {
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
  
  const newNetworks: WifiNetwork[] = [...existingNetworks];
  const existingSsid = new Set(existingNetworks.map(n => n.ssid));
  
  // Update signal strength of existing networks
  let updatedNetworks = newNetworks.map(network => ({
    ...network,
    signal: Math.max(-100, network.signal + Math.floor(Math.random() * 11) - 5) // Fluctuate signal by +/- 5
  }));

  const numToGenerate = Math.floor(Math.random() * 2) + 1; // Generate 1 to 2 new networks per scan to feel more real

  for (let i = 0; i < numToGenerate; i++) {
    if (updatedNetworks.length >= 15) break; // Limit total networks
    
    let ssid = '';
    let attempts = 0;
    do {
      ssid = commonSsids[Math.floor(Math.random() * commonSsids.length)];
      if (Math.random() > 0.5) {
        ssid += `_${Math.floor(Math.random() * 900) + 100}`;
      }
      attempts++;
    } while(existingSsid.has(ssid) && attempts < 20);
    
    if (!existingSsid.has(ssid)) {
        existingSsid.add(ssid);
        updatedNetworks.push({
          ssid,
          bssid: generateBssid(),
          signal: Math.floor(Math.random() * 71) - 100, // -30 to -100
          security: ['WPA2-PSK', 'WPA3-SAE', 'Open'][Math.floor(Math.random() * 3)] as WifiNetwork['security'],
          wps: Math.random() > 0.4,
          channel: [1, 6, 11, 36, 40, 44, 48, 149, 153, 157, 161][Math.floor(Math.random() * 11)],
        });
    }
  }

  return updatedNetworks.sort((a, b) => b.signal - a.signal);
}


export async function getWifiNetworks(
  currentNetworks: WifiNetwork[]
): Promise<{ networks: WifiNetwork[] } | { error: string }> {
   try {
    const networks = generateRealNetworks(currentNetworks);
    return { networks };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to scan for networks.' };
  }
}


export async function getPasswordCandidates(
  input: GeneratePasswordCandidatesInput
): Promise<{ passwordCandidates: string[] } | { error: string }> {
  try {
    if (!input.targetName) {
        return { error: 'Target name is required.' };
    }

    const result = await generatePasswordCandidates(input);
    if (result && result.passwordCandidates && result.passwordCandidates.length > 0) {
      return { passwordCandidates: result.passwordCandidates };
    }
    return { error: 'AI failed to generate candidates. Try a more specific hint.' };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return { error: `An error occurred while communicating with the AI: ${errorMessage}` };
  }
}

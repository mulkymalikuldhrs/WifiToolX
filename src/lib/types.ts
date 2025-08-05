import type {z} from 'zod';
import type {
  GeneratePasswordCandidatesInputSchema,
  GeneratePasswordCandidatesOutputSchema,
} from '@/ai/flows/generate-password-candidates';
import type {
  CyberPentestChatbotInputSchema,
  CyberPentestChatbotOutputSchema,
  ChatMessageSchema,
} from '@/ai/flows/cyber-pentest-chatbot';


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

// AI Flow Types
export type GeneratePasswordCandidatesInput = z.infer<
  typeof GeneratePasswordCandidatesInputSchema
>;
export type GeneratePasswordCandidatesOutput = z.infer<
  typeof GeneratePasswordCandidatesOutputSchema
>;

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type CyberPentestChatbotInput = z.infer<
  typeof CyberPentestChatbotInputSchema
>;
export type CyberPentestChatbotOutput = z.infer<
  typeof CyberPentestChatbotOutputSchema
>;

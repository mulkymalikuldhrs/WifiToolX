
import {z} from 'zod';

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

// AI Flow Schemas and Types

// For generate-password-candidates flow
export const GeneratePasswordCandidatesInputSchema = z.object({
  targetName: z.string().describe('The name or identifier of the target account or network.'),
  knownInformation: z
    .string()
    .optional()
    .describe(
      'Any known information about the target, such as birthdates, nicknames, or interests.'
    ),
  passwordHint: z.string().optional().describe('A hint about the password structure or content.'),
});
export type GeneratePasswordCandidatesInput = z.infer<
  typeof GeneratePasswordCandidatesInputSchema
>;
export const GeneratePasswordCandidatesOutputSchema = z.object({
  passwordCandidates: z
    .array(z.string())
    .describe('An array of potential password candidates.'),
});
export type GeneratePasswordCandidatesOutput = z.infer<
  typeof GeneratePasswordCandidatesOutputSchema
>;

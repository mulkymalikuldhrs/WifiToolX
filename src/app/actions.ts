'use server';

import {
  generatePasswordCandidates,
  type GeneratePasswordCandidatesInput,
} from '@/ai/flows/generate-password-candidates';

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


'use server';

/**
 * @fileOverview A password candidate generation AI agent.
 *
 * - generatePasswordCandidates - A function that handles the password candidate generation process.
 */

import {ai} from '@/ai/genkit';
import {
  GeneratePasswordCandidatesInputSchema,
  GeneratePasswordCandidatesOutputSchema,
  type GeneratePasswordCandidatesInput,
  type GeneratePasswordCandidatesOutput,
} from '@/lib/types';


export async function generatePasswordCandidates(
  input: GeneratePasswordCandidatesInput
): Promise<GeneratePasswordCandidatesOutput> {
  return generatePasswordCandidatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePasswordCandidatesPrompt',
  input: {schema: GeneratePasswordCandidatesInputSchema},
  output: {schema: GeneratePasswordCandidatesOutputSchema},
  prompt: `You are a password generation expert, skilled in creating potential password candidates based on patterns and common structures.

  Generate a list of password candidates based on the following information about the target:

  Target Name: {{{targetName}}}
  Known Information: {{{knownInformation}}}
  Password Hint: {{{passwordHint}}}

  Consider common password patterns, such as:
    *   Adding numbers or special characters to the end of words
    *   Using common substitutions (e.g., "a" for "@", "i" for "1")
    *   Combining words with birthdates or other personal information

  Return a diverse set of password candidates to test against the target.
  Do not include any passwords you would consider to be weak, such as "password", "123456", or the target's name directly.
  The generated passwords should be at least 8 characters long.
  The generated passwords must not contain any personally identifiable information about yourself or any other real person.
  Here are a few examples of password candidates (you do not need to follow these exactly, they are simply examples):
    *   Summer2024!
    *   Snowflake99
    *   GuitarLover
`, 
});

const generatePasswordCandidatesFlow = ai.defineFlow(
  {
    name: 'generatePasswordCandidatesFlow',
    inputSchema: GeneratePasswordCandidatesInputSchema,
    outputSchema: GeneratePasswordCandidatesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

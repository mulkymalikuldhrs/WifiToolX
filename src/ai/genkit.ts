import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const llm7 = googleAI.model('openai/gpt-4.1-nano-2025-04-14', {
  apiKey: 'unused',
  baseURL: 'https://api.llm7.io/v1',
});

export const ai = genkit({
  plugins: [googleAI()],
  model: llm7,
});

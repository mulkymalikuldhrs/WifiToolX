import {genkit} from 'genkit';
import {openai} from 'genkitx-openai';

const llm7 = openai.model('gpt-4.1-nano-2025-04-14');

export const ai = genkit({
  plugins: [
    openai({
      apiKey: 'unused',
      baseURL: 'https://api.llm7.io/v1',
    }),
  ],
  model: llm7,
});

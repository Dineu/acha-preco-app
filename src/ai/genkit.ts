'use server';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      // A apiKey é automaticamente lida da variável de ambiente GEMINI_API_KEY
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

'use server';
/**
 * @fileOverview Centralized Genkit AI initialization.
 *
 * This file exports a single, shared `ai` instance to be used across all
 * flows and tools in the application. This ensures that all components

 * are registered within the same Genkit context.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

'use server';
/**
 * @fileOverview A tool for Genkit to find supermarkets using the Google Maps API.
 *
 * - findSupermarketsTool - A Genkit tool that searches for supermarkets in a given city.
 */
import { searchNearby } from '@/services/google-maps';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { z } from 'zod';

const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export const findSupermarketsTool = ai.defineTool(
  {
    name: 'findSupermarkets',
    description: 'Busca e retorna uma lista de supermercados em uma cidade específica para ajudar a recomendar as melhores opções de compras.',
    inputSchema: z.object({
        city: z.string().describe('A cidade onde a busca por supermercados deve ser realizada, por exemplo, "Indaiatuba".'),
    }),
    outputSchema: z.object({
        supermarkets: z.array(z.string()).describe('Uma lista com os nomes dos supermercados encontrados.'),
    }),
  },
  async (input) => {
    console.log(`[AI Tool] A ferramenta findSupermarkets foi chamada com a cidade: ${input.city}`);
    
    // A simplified, broad query for major supermarket types.
    const query = `supermercado em ${input.city}`;
    console.log(`[AI Tool] Montando a query para a busca: "${query}"`);

    try {
      // The searchNearby function needs to be implemented or updated to handle this query.
      const results = await searchNearby(query, input.city);
      const names = results.map((place) => place.name).filter((name): name is string => !!name);

      // Remove duplicates
      const uniqueNames = [...new Set(names)];

      console.log(`[AI Tool] Encontrados ${uniqueNames.length} supermercados únicos. Lista:`, uniqueNames);
      return { supermarkets: uniqueNames };
    } catch (error) {
      console.error('[AI Tool] Erro dentro da ferramenta findSupermarketsTool:', error);
      // Return an empty list in case of an error to avoid breaking the flow.
      return { supermarkets: [] };
    }
  }
);

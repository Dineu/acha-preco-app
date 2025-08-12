'use server';
/**
 * @fileOverview A flow to find supermarkets using the Google Places API.
 * 
 * - findSupermarkets - A function that finds supermarkets based on a query.
 * - FindSupermarketsInput - The input type for the findSupermarkets function.
 * - FindSupermarketsOutput - The return type for the findSupermarkets function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { searchNearby } from '@/services/google-maps';

const MarketSchema = z.object({
  id: z.string().describe('The unique ID of the market.'),
  name: z.string().describe('The name of the market.'),
  location: z.object({
    lat: z.number().describe('The latitude of the market.'),
    lng: z.number().describe('The longitude of the market.'),
  }),
});

const FindSupermarketsInputSchema = z.object({
  query: z.string().describe('The search query, e.g., "supermarkets in Indaiatuba"'),
});
export type FindSupermarketsInput = z.infer<typeof FindSupermarketsInputSchema>;

const FindSupermarketsOutputSchema = z.object({
  markets: z.array(MarketSchema).describe('The list of found supermarkets.'),
});
export type FindSupermarketsOutput = z.infer<typeof FindSupermarketsOutputSchema>;

// This is a tool, not a prompt. It directly calls our service.
const findSupermarketsTool = ai.defineTool(
    {
      name: 'findSupermarketsTool',
      description: 'Finds supermarkets based on a search query using Google Places API.',
      inputSchema: FindSupermarketsInputSchema,
      outputSchema: FindSupermarketsOutputSchema,
    },
    async (input) => {
        const places = await searchNearby(input.query, 'supermarket');

        const markets = places.map(place => ({
            id: place.place_id ?? `gen-${Math.random()}`,
            name: place.name ?? 'Nome não disponível',
            location: {
                lat: place.geometry?.location.lat ?? 0,
                lng: place.geometry?.location.lng ?? 0,
            }
        }));

        return { markets };
    }
);


const findSupermarketsFlow = ai.defineFlow(
  {
    name: 'findSupermarketsFlow',
    inputSchema: FindSupermarketsInputSchema,
    outputSchema: FindSupermarketsOutputSchema,
  },
  async (input) => {
    // We don't need to call a prompt, we can just call the tool directly.
    const result = await findSupermarketsTool(input);
    return result;
  }
);

export async function findSupermarkets(input: FindSupermarketsInput): Promise<FindSupermarketsOutput> {
    return findSupermarketsFlow(input);
}
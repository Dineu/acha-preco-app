'use server';
/**
 * @fileOverview A function to find supermarkets using the Google Maps API.
 *
 * - findSupermarkets - A function that searches for supermarkets in a given city.
 */
import { searchNearby } from '@/services/google-maps';
import { z } from 'zod';

const FindSupermarketsInputSchema = z.object({
  city: z.string().describe('The city to search for supermarkets in.'),
});

type FindSupermarketsInput = z.infer<typeof FindSupermarketsInputSchema>;

export async function findSupermarkets(input: FindSupermarketsInput) {
  console.log(`Searching for supermarkets in ${input.city}`);
  const query = `supermercado OU Atacadão OU Assaí Atacadista OU Roldão OU Sonda Supermercados em ${input.city}`;

  try {
    const results = await searchNearby(query, 'supermarket');
    const names = results.map((place) => place.name).filter((name): name is string => !!name);

    // Remove duplicates
    const uniqueNames = [...new Set(names)];

    console.log(`Found ${uniqueNames.length} unique supermarkets.`);
    return { supermarkets: uniqueNames };
  } catch (error) {
    console.error('Error in findSupermarketsTool:', error);
    // Return an empty list in case of an error to avoid breaking the flow.
    return { supermarkets: [] };
  }
}

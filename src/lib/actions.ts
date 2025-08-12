'use server';

import { 
  suggestMissingItems as suggestMissingItemsFlow, 
  SuggestMissingItemsInput, 
  SuggestMissingItemsOutput 
} from '@/ai/flows/suggest-missing-items';
import { 
  suggestAlternateStores as suggestAlternateStoresFlow,
  SuggestAlternateStoresInput,
  SuggestAlternateStoresOutput
} from '@/ai/flows/suggest-alternate-stores';
import { searchNearby } from '@/services/google-maps';
import type { Place } from '@googlemaps/google-maps-services-js';


export async function suggestMissingItems(input: SuggestMissingItemsInput): Promise<SuggestMissingItemsOutput> {
  try {
    const result = await suggestMissingItemsFlow(input);
    return result;
  } catch (error) {
    console.error('Error suggesting missing items:', error);
    throw new Error('Failed to get suggestions.');
  }
}

export async function suggestAlternateStores(input: SuggestAlternateStoresInput): Promise<SuggestAlternateStoresOutput> {
    try {
        const result = await suggestAlternateStoresFlow(input);
        return result;
    } catch (error) {
        console.error('Error suggesting alternate stores:', error);
        throw new Error('Failed to get store suggestions.');
    }
}

// Simplified action to directly fetch supermarkets
export async function findSupermarkets(query: string): Promise<Partial<Place>[]> {
  try {
    const result = await searchNearby(query, 'supermarket');
    return result;
  } catch (error) {
    console.error('Error finding supermarkets:', error);
    throw new Error('Failed to find supermarkets.');
  }
}

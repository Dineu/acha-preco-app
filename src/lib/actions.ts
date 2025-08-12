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

export async function listSupermarketsInCity(input: { city: string }): Promise<{ supermarkets: string[] }> {
  try {
    console.log(`Searching for supermarkets in ${input.city}`);
    const query = `"Atacadão" OR "Assaí Atacadista" OR "Roldão Atacadista" OR "Sonda Supermercados" OR "Supermercado Sumerbol" OR "Supermercados Pague Menos" OR "Supermercado GoodBom" OR "Supermercado Pão de Acucar" OR "Covabra Supermercados" em ${input.city}`;
    const results = await searchNearby(query);
    const names = results.map((place) => place.name).filter((name): name is string => !!name);
    const uniqueNames = [...new Set(names)];
    console.log(`Found ${uniqueNames.length} unique supermarkets.`);
    return { supermarkets: uniqueNames };
  } catch (error) {
    console.error('Error listing supermarkets:', error);
    throw new Error('Failed to get supermarket list.');
  }
}

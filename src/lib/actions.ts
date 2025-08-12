'use server';

import {
  suggestMissingItems as suggestMissingItemsFlow,
  SuggestMissingItemsInput,
  SuggestMissingItemsOutput,
} from '@/ai/flows/suggest-missing-items';
import {
  suggestAlternateStores as suggestAlternateStoresFlow,
  SuggestAlternateStoresInput,
  SuggestAlternateStoresOutput,
} from '@/ai/flows/suggest-alternate-stores';
import { Client, TextSearchRequest, Place } from '@googlemaps/google-maps-services-js';

const client = new Client({});

async function searchNearby(query: string): Promise<Partial<Place>[]> {
  const request: TextSearchRequest = {
    params: {
      query,
      key: process.env.GOOGLE_MAPS_API_KEY!,
    },
  };

  try {
    const response = await client.textSearch(request);
    return response.data.results;
  } catch (error) {
    console.error('Error searching nearby places:', error);
    throw new Error('Could not search for nearby places.');
  }
}


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
    
    // Remove duplicates
    const uniqueNames = [...new Set(names)];

    console.log(`Found ${uniqueNames.length} unique supermarkets.`);
    return { supermarkets: uniqueNames };
  } catch (error) {
    console.error('Error listing supermarkets:', error);
    throw new Error('Failed to get supermarket list.');
  }
}

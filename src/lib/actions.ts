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

// Note: The @googlemaps/google-maps-services-js client is not used here
// as we are making a direct fetch call from the server action.

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
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('Google Maps API key is not configured.');
    throw new Error('API key is missing.');
  }

  try {
    const query = `"Atacadão" OR "Assaí Atacadista" OR "Roldão Atacadista" OR "Sonda Supermercados" OR "Supermercado Sumerbol" OR "Supermercados Pague Menos" OR "Supermercado GoodBom" OR "Supermercado Pão de Acucar" OR "Covabra Supermercados" em ${input.city}`;
    
    const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
    url.searchParams.append('query', query);
    url.searchParams.append('key', apiKey);

    console.log(`Fetching supermarkets from: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Google Maps API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch from Google Maps API: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Google Maps API returned a non-OK status:', data.status, data.error_message);
      throw new Error(`Google Maps API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }

    const names = data.results.map((place: any) => place.name).filter((name?: string): name is string => !!name);
    
    const uniqueNames = [...new Set(names)];

    console.log(`Found ${uniqueNames.length} unique supermarkets.`);
    return { supermarkets: uniqueNames };

  } catch (error) {
    console.error('Error in listSupermarketsInCity:', error);
    throw new Error('Failed to get supermarket list.');
  }
}

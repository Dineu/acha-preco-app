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
  console.log('[SERVER] Ação listSupermarketsInCity foi chamada com o input:', input);
  
  // Use the public key that is available on the client and server
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('[SERVER] Erro fatal: A chave de API do Google Maps (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) não está configurada no ambiente.');
    throw new Error('A chave de API do Google Maps não está configurada no servidor.');
  }
  console.log('[SERVER] Chave de API encontrada. Prosseguindo com a busca.');

  try {
    const query = `"Atacadão" OR "Assaí Atacadista" OR "Roldão Atacadista" OR "Sonda Supermercados" OR "Supermercado Sumerbol" OR "Supermercados Pague Menos" OR "Supermercado GoodBom" OR "Supermercado Pão de Acucar" OR "Covabra Supermercados" em ${input.city}`;
    
    const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
    url.searchParams.append('query', query);
    url.searchParams.append('key', apiKey);

    // Log the URL to the server console for debugging
    console.log(`[SERVER] Buscando supermercados da URL: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`[SERVER] Resposta da API do Google Maps recebida com status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[SERVER] Erro da API do Google Maps: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Falha ao buscar da API do Google Maps: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('[SERVER] API do Google Maps retornou um status não-OK:', data.status, data.error_message);
      throw new Error(`Erro da API do Google Maps: ${data.status} - ${data.error_message || 'Erro desconhecido'}`);
    }

    const names = data.results.map((place: any) => place.name).filter((name?: string): name is string => !!name);
    
    const uniqueNames = [...new Set(names)];

    console.log(`[SERVER] Encontrados ${uniqueNames.length} supermercados únicos.`);
    return { supermarkets: uniqueNames };

  } catch (error) {
    console.error('[SERVER] Erro dentro do bloco try/catch da função listSupermarketsInCity:', error);
    // Let the client know what happened
    if (error instanceof Error) {
        throw new Error(`Falha ao obter a lista de supermercados: ${error.message}`);
    }
    throw new Error('Ocorreu um erro desconhecido ao buscar a lista de supermercados.');
  }
}

'use server';

/**
 * @fileOverview A service for interacting with the Google Maps API.
 */
import { Client, Place } from '@googlemaps/google-maps-services-js';

const client = new Client({});

// Helper function to get the API key from environment variables.
// It prioritizes a specific Google Maps key, but falls back to the Gemini key.
function getApiKey(): string {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("[Service/GoogleMaps] Nenhuma chave de API encontrada. Verifique as variáveis de ambiente GOOGLE_MAPS_API_KEY ou GEMINI_API_KEY.");
        throw new Error('Google Maps API key is not configured for the server. Please set GOOGLE_MAPS_API_KEY or GEMINI_API_KEY in your .env file.');
    }
    return apiKey;
}


async function getCoordinatesForCity(city: string): Promise<{ lat: number; lng: number }> {
    console.log(`[Service/GoogleMaps] Buscando coordenadas para a cidade: ${city}`);
    try {
        const response = await client.geocode({
            params: {
                address: city,
                key: getApiKey(),
            },
        });

        if (response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            console.log(`[Service/GoogleMaps] Coordenadas encontradas para ${city}:`, location);
            return location;
        } else {
            throw new Error(`Could not find coordinates for city: ${city}`);
        }
    } catch (error) {
        console.error('[Service/GoogleMaps] Erro ao buscar dados de geocode:', error);
        throw new Error('Failed to get city coordinates.');
    }
}


/**
 * Searches for places nearby a given location using a predefined list of supermarket names.
 * This approach is more reliable than a generic query.
 * @param query A generic query (e.g., "supermercado em Indaiatuba"). The function will ignore this and use its internal list.
 * @param location The city name to search in.
 * @returns A list of places found.
 */
export async function searchNearby(query: string, location: string): Promise<Partial<Place>[]> {
  const apiKey = getApiKey();
  console.log(`[Service/GoogleMaps] Iniciando searchNearby com a query: "${query}" na localização: "${location}"`);

  try {
     const cityCenter = await getCoordinatesForCity(location);

     const supermarketQueries = [
        "Sumerbol em Indaiatuba",
        "Pague Menos em Indaiatuba",
        "GoodBom em Indaiatuba",
        "Covabra em Indaiatuba",
        "Sonda em Indaiatuba",
        "Atacadão em Indaiatuba",
        "Assaí Atacadista em Indaiatuba",
        "Roldão Atacadista em Indaiatuba",
        "Pão de Açúcar em Indaiatuba",
        "OBA Hortifruti em Indaiatuba",
        "Carrefour em Indaiatuba",
        // Add smaller or local markets as well
        "MonteKali Supermercado em Indaiatuba",
        "Cato Supermercados em Indaiatuba",
        "Pistoni Supermercados em Indaiatuba",
        "Revolução Supermercado em Indaiatuba",
        "Frutal Supermercado em Indaiatuba"
    ];

    const searchPromises = supermarketQueries.map(specificQuery => {
        const requestParams = {
            query: specificQuery,
            location: cityCenter,
            radius: 20000, // Search within a 20km radius
            key: apiKey,
            language: 'pt-BR',
        };
        console.log(`[Service/GoogleMaps] Executando busca por: "${specificQuery}"`);
        return client.textSearch({ params: requestParams });
    });

    const searchResults = await Promise.all(searchPromises);
    
    const allPlaces = searchResults.flatMap(result => result.data.results);
    const uniquePlaces = new Map<string, Partial<Place>>();

    // Filter and deduplicate results
    allPlaces.forEach((place: Place) => {
        if (place.place_id && place.name && !uniquePlaces.has(place.place_id)) {
            uniquePlaces.set(place.place_id, {
                name: place.name,
                vicinity: place.vicinity,
                rating: place.rating,
                place_id: place.place_id,
            });
        }
    });

    const places = Array.from(uniquePlaces.values());
    console.log(`[Service/GoogleMaps] A API retornou ${places.length} resultados únicos.`);
    console.log('[Service/GoogleMaps] Resultados processados:', places.map(p => p.name));
    return places;

  } catch (error) {
    console.error('[Service/GoogleMaps] Erro em searchNearby:', error);
    return [];
  }
}

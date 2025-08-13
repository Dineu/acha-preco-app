/**
 * @fileOverview A service for interacting with the Google Maps API.
 */
import { Client, Place, PlaceInputType } from '@googlemaps/google-maps-services-js';

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
 * Searches for places nearby a given location.
 * @param query The text query to search for (e.g., "supermarket").
 * @param location The city name to search in.
 * @returns A list of places found.
 */
export async function searchNearby(query: string, location: string): Promise<Partial<Place>[]> {
  const apiKey = getApiKey();
  console.log(`[Service/GoogleMaps] Iniciando searchNearby com a query: "${query}" na localização: "${location}"`);

  try {
     const cityCenter = await getCoordinatesForCity(location);

    const requestParams = {
        query: query,
        location: cityCenter,
        radius: 20000, // Search within a 20km radius of the city center
        key: apiKey,
        language: 'pt-BR',
      };

    console.log('[Service/GoogleMaps] Parâmetros da requisição para textSearch:', requestParams);

    const response = await client.textSearch({
      params: requestParams,
    });

    if (response.data.results) {
      console.log(`[Service/GoogleMaps] A API retornou ${response.data.results.length} resultados.`);
      // Return a simplified list of places
      const places = response.data.results.map(place => ({
        name: place.name,
        vicinity: place.vicinity,
        rating: place.rating,
        place_id: place.place_id,
      }));
       console.log('[Service/GoogleMaps] Resultados processados:', places.map(p => p.name));
       return places;
    }
    console.warn('[Service/GoogleMaps] A busca não retornou resultados.');
    return [];
  } catch (error) {
    console.error('[Service/GoogleMaps] Erro em searchNearby:', error);
    return [];
  }
}

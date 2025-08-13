/**
 * @fileOverview A service for interacting with the Google Maps API.
 */
import { Client, Place, PlaceInputType } from '@googlemaps/google-maps-services-js';
import { env } from 'process';

const client = new Client({});

async function getCoordinatesForCity(city: string): Promise<{ lat: number; lng: number }> {
    try {
        const response = await client.geocode({
            params: {
                address: city,
                key: env.GOOGLE_MAPS_API_KEY!,
            },
        });

        if (response.data.results.length > 0) {
            return response.data.results[0].geometry.location;
        } else {
            throw new Error(`Could not find coordinates for city: ${city}`);
        }
    } catch (error) {
        console.error('Error fetching geocode data:', error);
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
  const apiKey = env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error('Google Maps API key is not configured for the server.');
  }

  try {
     const cityCenter = await getCoordinatesForCity(location);

    const response = await client.textSearch({
      params: {
        query: query,
        location: cityCenter,
        radius: 20000, // Search within a 20km radius of the city center
        key: apiKey,
        language: 'pt-BR',
      },
    });

    if (response.data.results) {
      // Return a simplified list of places
      return response.data.results.map(place => ({
        name: place.name,
        vicinity: place.vicinity,
        rating: place.rating,
        place_id: place.place_id,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error in searchNearby:', error);
    return [];
  }
}

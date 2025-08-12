import { Client, Place, TextSearchRequest } from '@googlemaps/google-maps-services-js';

const client = new Client({});

export async function searchNearby(query: string): Promise<Partial<Place>[]> {
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

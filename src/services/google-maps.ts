import { Client, Place, TextSearchRequest } from '@googlemaps/google-maps-services-js';

const client = new Client({});

// This function is no longer needed as we can search directly with the query.
// async function getCoordinates(query: string) {
//     const request: TextSearchRequest = {
//         params: {
//             query: query,
//             key: process.env.GOOGLE_MAPS_API_KEY!,
//         },
//     };

//     try {
//         const response = await client.textSearch(request);
//         if (response.data.results.length > 0) {
//             return response.data.results[0].geometry?.location;
//         }
//         return null;
//     } catch (error) {
//         console.error('Error fetching coordinates:', error);
//         throw new Error('Could not get coordinates for query.');
//     }
// }


export async function searchNearby(query: string, type: 'supermarket'): Promise<Partial<Place>[]> {
    // We can directly use the query to search for supermarkets in the specified area.
    // The Google Places API is smart enough to understand queries like "supermarkets in Indaiatuba".
    const request: TextSearchRequest = {
        params: {
            query: `${type} in ${query}`,
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

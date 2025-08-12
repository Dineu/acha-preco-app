'use client';

import { useEffect, useState, useRef } from 'react';
import { APIProvider, Map, useMap, Marker } from '@vis.gl/react-google-maps';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2 } from 'lucide-react';

type MarketLocation = {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
};

// We create a new component to be able to use the `useMap` hook.
function SupermarketMap() {
  const map = useMap();
  const [markets, setMarkets] = useState<MarketLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // A reference to the PlacesService instance. We'll reuse it.
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    if (!map) return;

    // Initialize the PlacesService once the map is available.
    if (!placesServiceRef.current) {
        placesServiceRef.current = new google.maps.places.PlacesService(map);
    }
    
    const service = placesServiceRef.current;
    
    // A single, more robust query to find all relevant places at once.
    const request: google.maps.places.PlaceSearchRequest = {
        location: map.getCenter()!,
        radius: 10000,
        query: 'supermercado ou Atacadão ou Assaí Atacadista ou Roldão em Indaiatuba'
    };

    setIsLoading(true);
    service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const formattedMarkets = results
            .map(place => {
                if (place.place_id && place.name && place.geometry?.location) {
                return {
                    id: place.place_id,
                    name: place.name,
                    location: {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    },
                };
                }
                return null;
            })
            .filter((market): market is MarketLocation => market !== null);

            setMarkets(formattedMarkets);
            setError(null);
        } else {
            setError('Não foi possível carregar os supermercados. Verifique se a API "Places API" está ativada no seu projeto Google Cloud e se as restrições da sua chave de API estão corretas.');
            console.error('PlacesService failed with status:', status);
        }
        setIsLoading(false);
    });

  }, [map]);

  return (
     <div className="h-[600px] w-full rounded-lg overflow-hidden border relative">
        <Map
          defaultCenter={{ lat: -23.089, lng: -47.218 }} // Indaiatuba
          defaultZoom={13}
          mapId="acha-preco-map"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {markets.map((market) => (
            <Marker key={market.id} position={market.location} title={market.name} />
          ))}
        </Map>
         {isLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Buscando supermercados...</p>
          </div>
        )}
        {error && !isLoading && (
           <div className="absolute inset-0 bg-background/80 flex items-center justify-center p-4">
              <Alert variant="destructive" className="w-auto max-w-md">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Erro ao Carregar os Dados</AlertTitle>
                <AlertDescription>
                  <p>{error}</p>
                </AlertDescription>
              </Alert>
          </div>
        )}
    </div>
  )

}


export default function MapPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Mapa Interativo</CardTitle>
          <CardDescription>Localize os principais mercados e suas promoções.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>API Key não configurada</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                Para que o mapa funcione, a chave de API do Google Maps precisa ser adicionada ao seu arquivo <code>.env</code> como `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Mapa Interativo</CardTitle>
        <CardDescription>
          Localize os principais mercados e suas promoções, obtidos em tempo real.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <APIProvider apiKey={apiKey} libraries={['places']}>
           <SupermarketMap />
        </APIProvider>
      </CardContent>
    </Card>
  );
}

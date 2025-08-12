'use client';

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockMarkets } from '@/lib/data';

export default function MapPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const position = { lat: -23.089, lng: -47.218 }; // Center of Indaiatuba

  if (!apiKey) {
    return (
       <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Mapa Interativo</CardTitle>
          <CardDescription>Localize os principais mercados e suas promoções.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 bg-muted rounded-md">
            <p className="text-lg font-semibold">API Key do Google Maps não configurada.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Para exibir o mapa, por favor, adicione sua chave de API do Google Maps no arquivo `.env.local`.
            </p>
            <code className="mt-4 inline-block bg-background px-2 py-1 rounded text-sm">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="SUA_CHAVE_AQUI"
            </code>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
       <CardHeader>
        <CardTitle className="font-headline text-2xl">Mapa Interativo</CardTitle>
        <CardDescription>Localize os principais mercados e suas promoções.</CardDescription>
      </CardHeader>
      <CardContent>
         <div className="h-[600px] w-full rounded-lg overflow-hidden border">
            <APIProvider apiKey={apiKey}>
                <Map
                    defaultCenter={position}
                    defaultZoom={13}
                    mapId="acha-preco-map"
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                >
                    {mockMarkets.map((market) => (
                        <Marker key={market.id} position={market.location} title={market.name} />
                    ))}
                </Map>
            </APIProvider>
        </div>
      </CardContent>
    </Card>
  );
}

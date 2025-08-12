'use client';

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockMarkets } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

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
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>API Key não configurada</AlertTitle>
            <AlertDescription>
              <p className="mb-2">Para exibir o mapa, sua chave de API do Google Maps precisa ser adicionada.</p>
              <p>Por favor, adicione a seguinte linha ao seu arquivo <code>.env</code>:</p>
              <code className="mt-2 relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="SUA_CHAVE_AQUI"
              </code>
               <p className="mt-4 text-xs text-muted-foreground">
                Se o erro persistir após adicionar a chave, certifique-se de que a URL do seu site (visível na barra de endereço do navegador) está autorizada nas restrições da chave de API no Google Cloud Console.
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

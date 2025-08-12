'use client';

import { useEffect, useState } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2 } from 'lucide-react';
import type { Market } from '@/lib/types';
import { findSupermarkets } from '@/lib/actions';


export default function MapPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const position = { lat: -23.089, lng: -47.218 }; // Center of Indaiatuba
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setIsLoading(true);
        // We now search dynamically
        const result = await findSupermarkets({ query: 'supermercados em Indaiatuba' });
        setMarkets(result.markets);
        setError(null);
      } catch (err) {
        setError('Não foi possível carregar os supermercados. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (apiKey) {
      fetchMarkets();
    }
  }, [apiKey]);


  if (!apiKey || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
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
              <p className="mb-2">Para que o mapa funcione, a chave de API do Google Maps precisa ser adicionada ao seu arquivo <code>.env</code>.</p>
              <p>Por favor, adicione as seguintes linhas, substituindo "SUA_CHAVE_AQUI" pela sua chave:</p>
              <code className="mt-2 relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold block">
                NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="SUA_CHAVE_AQUI"<br/>
                GOOGLE_MAPS_API_KEY="SUA_CHAVE_AQUI"
              </code>
               <p className="mt-4 text-xs text-muted-foreground">
                Se o erro persistir, certifique-se de que a API "Places API" está ativada no seu projeto Google Cloud e que a URL do seu site está autorizada nas restrições da chave.
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
        <CardDescription>Localize os principais mercados e suas promoções, obtidos em tempo real.</CardDescription>
      </CardHeader>
      <CardContent>
         <div className="h-[600px] w-full rounded-lg overflow-hidden border relative">
            <APIProvider apiKey={apiKey}>
                <Map
                    defaultCenter={position}
                    defaultZoom={13}
                    mapId="acha-preco-map"
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                >
                    {markets.map((market) => (
                        <Marker key={market.id} position={market.location} title={market.name} />
                    ))}
                </Map>
            </APIProvider>
             {isLoading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Buscando supermercados...</p>
              </div>
            )}
            {error && !isLoading && (
               <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <Alert variant="destructive" className="w-auto max-w-md">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Erro ao Carregar os Dados</AlertTitle>
                    <AlertDescription>
                      <p>{error}</p>
                       <p className="mt-2 text-xs">Verifique se a API "Places API" está ativada para sua chave no Google Cloud Console e se a chave foi adicionada corretamente ao arquivo <code>.env</code>.</p>
                    </AlertDescription>
                  </Alert>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

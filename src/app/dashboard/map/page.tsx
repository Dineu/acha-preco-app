
'use client';

import { useEffect, useState } from 'react';
import { APIProvider, Map as GoogleMap, useMap, AdvancedMarker, Pin, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


type MarketLocation = {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
};

// We create a new component to be able to use the `useMap` hook.
function SupermarketMap({ 
  markets, 
  isLoading, 
  error, 
  selectedMarket, 
  onMarkerClick 
}: { 
  markets: MarketLocation[], 
  isLoading: boolean, 
  error: string | null,
  selectedMarket: MarketLocation | null,
  onMarkerClick: (market: MarketLocation | null) => void
}) {
  const map = useMap();

  useEffect(() => {
    if (map && selectedMarket) {
      map.panTo(selectedMarket.location);
      map.setZoom(17);
    }
  }, [map, selectedMarket]);

  return (
     <div className="h-[600px] w-full rounded-lg overflow-hidden border relative">
        <GoogleMap
          defaultCenter={{ lat: -23.089, lng: -47.218 }} // Indaiatuba
          defaultZoom={13}
          mapId="acha-preco-map"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {markets.map((market) => {
            const isSelected = selectedMarket?.id === market.id;
            return (
              <AdvancedMarker 
                key={market.id} 
                position={market.location} 
                title={market.name}
                onClick={() => onMarkerClick(market)}
              >
                  <Pin 
                    background={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'}
                    borderColor={'hsl(var(--destructive-foreground))'}
                    glyphColor={'hsl(var(--destructive-foreground))'}
                    scale={isSelected ? 1.5 : 1}
                  />
              </AdvancedMarker>
            )
          })}
        </GoogleMap>
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


function MapPageContent() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true); // Start loading immediately
  const [marketList, setMarketList] = useState<MarketLocation[]>([]);
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<MarketLocation | null>(null);
  
  const places = useMapsLibrary('places');
  const map = useMap();

  const handleListSupermarkets = async () => {
    if (!places || !map) {
      return;
    }
  
    console.log('[CLIENT] Buscando supermercados...');
    setIsLoading(true);
    setError(null);
  
    const supermarketQueries = [
        "Sumerbol Cidade Nova Indaiatuba",
        "Sumerbol Morada do Sol Indaiatuba",
        "Sumerbol Parque Ecologico Indaiatuba",
        "Pague Menos em Indaiatuba",
        "GoodBom em Indaiatuba",
        "Covabra em Indaiatuba",
        "Sonda em Indaiatuba",
        "Atacadão em Indaiatuba",
        "Assaí Atacadista em Indaiatuba",
        "Roldão Atacadista em Indaiatuba",
        "Pão de Açúcar em Indaiatuba",
        "MonteKali Supermercado em Indaiatuba",
        "Cato Supermercados em Indaiatuba",
        "Pistoni Supermercados em Indaiatuba",
        "Revolução Supermercado em Indaiatuba"
    ];
  
    try {
      const searchPromises = supermarketQueries.map(query => {
        const request = {
          textQuery: query,
          fields: ['id', 'displayName', 'location', 'types'],
          locationBias: map.getCenter()!,
        };
        // @ts-ignore
        return places.Place.searchByText(request);
      });
  
      const searchResults = await Promise.all(searchPromises);
      
      const allPlaces = searchResults.flatMap(result => result.places);
      const uniquePlaces = new Map<string, any>();
  
      allPlaces.forEach((place: any) => {
        if (place.id && !uniquePlaces.has(place.displayName)) {
            const name = place.displayName.toLowerCase();
            // Aditional filter to avoid undesired places like glass stores
            if (name.includes('vidraçaria')) {
                return;
            }
            uniquePlaces.set(place.displayName, place);
        }
      });
  
      const formattedMarkets = Array.from(uniquePlaces.values())
        .map((place: any) => {
          if (place.id && place.displayName && place.location) {
            return {
              id: place.id,
              name: place.displayName,
              location: {
                lat: place.location.lat(),
                lng: place.location.lng(),
              },
            };
          }
          return null;
        })
        .filter((market): market is MarketLocation => market !== null)
        .sort((a, b) => a.name.localeCompare(b.name));
  
      if (formattedMarkets.length > 0) {
        setMarketList(formattedMarkets);
        setError(null);
      } else {
        const errorMessage = 'Não foi possível encontrar supermercados. Verifique se a API "Places API" está ativada e suas chaves de API estão corretas.';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Nenhum resultado',
          description: errorMessage,
        });
      }
    } catch (e) {
      let errorMessage = 'Não foi possível obter a lista de supermercados. Verifique o console para mais detalhes.';
      if (e instanceof Error) {
        console.error('[CLIENT] Erro ao buscar lista de supermercados:', e);
        if (e.message.includes('403')) {
          errorMessage = 'Erro de permissão (403). Verifique se a Places API está ativada e se as restrições da chave de API estão corretas.';
        } else {
          errorMessage = e.message;
        }
      }
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Erro ao Listar Mercados',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Run the search automatically when the component mounts and the map is ready.
  useEffect(() => {
    if (places && map) {
      handleListSupermarkets();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places, map]); // Dependencies ensure this runs when map/places are loaded.

  const handleMarkerClick = (market: MarketLocation | null) => {
    setSelectedMarket(market);
  };

  const handleOpenMarketList = () => {
    if (marketList.length > 0) {
      setIsListDialogOpen(true);
    } else {
      toast({
        title: 'Nenhum supermercado encontrado',
        description: 'A busca não retornou resultados. Tente novamente mais tarde.',
      });
    }
  }
  
   return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Mapa Interativo</CardTitle>
            <CardDescription>
              Localize os principais mercados e suas promoções, obtidos em tempo real.
            </CardDescription>
          </div>
           <AlertDialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen}>
            <AlertDialogTrigger asChild>
                <Button onClick={handleOpenMarketList} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <List className="mr-2 h-4 w-4" />
                  )}
                  Listar Supermercados
                </Button>
            </AlertDialogTrigger>
             <AlertDialogContent>
               <AlertDialogHeader>
                 <AlertDialogTitle>Supermercados Encontrados em Indaiatuba</AlertDialogTitle>
                 <AlertDialogDescription>
                   Clique em um supermercado para vê-lo no mapa.
                 </AlertDialogDescription>
               </AlertDialogHeader>
               <div className="max-h-60 overflow-y-auto">
                 <ul className="space-y-1">
                   {marketList.map((market) => (
                     <li key={market.id}>
                        <Button 
                         variant="link" 
                         className="p-0 h-auto text-card-foreground"
                         onClick={() => {
                           setSelectedMarket(market);
                           setIsListDialogOpen(false);
                         }}
                       >
                         {market.name}
                       </Button>
                     </li>
                   ))}
                 </ul>
               </div>
               <AlertDialogFooter>
                 <AlertDialogAction onClick={() => setIsListDialogOpen(false)}>Fechar</AlertDialogAction>
               </AlertDialogFooter>
             </AlertDialogContent>
           </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <SupermarketMap 
          markets={marketList} 
          isLoading={isLoading}
          error={error}
          selectedMarket={selectedMarket}
          onMarkerClick={handleMarkerClick}
        />
      </CardContent>
    </>
  );
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
            <AlertTitle>Chave de API do Google Maps não configurada</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                Para que o mapa funcione, a chave de API do Google Maps precisa ser adicionada ao seu arquivo de ambiente.
              </p>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>
                  Crie um arquivo chamado <code>.env</code> na raiz do seu projeto.
                </li>
                <li>
                  Adicione a seguinte linha, substituindo <strong>SUA_CHAVE_AQUI</strong> pela sua chave de API real:
                  <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto my-2">
                    <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=SUA_CHAVE_AQUI</code>
                  </pre>
                </li>
                <li>
                  No Console do Google Cloud, certifique-se de que as APIs <strong>"Maps JavaScript API"</strong> e <strong>"Places API"</strong> estão ativadas para o seu projeto.
                </li>
                 <li>
                  Reinicie o servidor de desenvolvimento para que as alterações tenham efeito.
                </li>
              </ol>
               <p className="text-sm text-muted-foreground">
                Se o erro persistir, verifique as restrições da sua chave de API no Google Cloud Console.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <APIProvider apiKey={apiKey} libraries={['places']}>
          <MapPageContent />
      </APIProvider>
    </Card>
  );
}

    

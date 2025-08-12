

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
} from "@/components/ui/alert-dialog"


type MarketLocation = {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
};

type SupermarketControlsProps = {
  isLoading: boolean;
  marketList: MarketLocation[];
  isListDialogOpen: boolean;
  onListClick: () => void;
  onDialogClose: () => void;
  onMarketSelect: (market: MarketLocation) => void;
};


function SupermarketControls({ 
  isLoading, 
  marketList, 
  isListDialogOpen,
  onListClick,
  onDialogClose,
  onMarketSelect
}: SupermarketControlsProps) {
  
  return (
    <>
      <div className="absolute top-4 right-4 z-10">
        <Button onClick={onListClick} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <List className="mr-2 h-4 w-4" />
          )}
          Listar Supermercados
        </Button>
      </div>
      <AlertDialog open={isListDialogOpen} onOpenChange={onDialogClose}>
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
                      onMarketSelect(market);
                      onDialogClose();
                    }}
                  >
                    {market.name}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onDialogClose}>Fechar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

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
          {markets.map((market) => (
            <AdvancedMarker 
              key={market.id} 
              position={market.location} 
              title={market.name}
              onClick={() => onMarkerClick(market)}
            >
              <div className={selectedMarket?.id === market.id ? 'animate-pulse' : ''}>
                <Pin />
              </div>
            </AdvancedMarker>
          ))}
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
      // This will be retried by the useEffect hook once the map is ready.
      return;
    }
    
    console.log('[CLIENT] Buscando supermercados...');
    setIsLoading(true);
    setError(null);
    
    const searchQuery = `"Atacadão" OR "Assaí Atacadista" OR "Roldão Atacadista" OR "Sonda Supermercados" OR "Supermercado Sumerbol" OR "Supermercados Pague Menos" OR "Supermercado GoodBom" OR "Supermercado Pão de Acucar" OR "Covabra Supermercados" OR "MonteKali Supermercado" em Indaiatuba`;

    const request = {
      textQuery: searchQuery,
      fields: ['id', 'displayName', 'location', 'types'],
      locationBias: map.getCenter()!,
    };
    
    try {
      // @ts-ignore
      const { places: searchResults } = await places.Place.searchByText(request);
      
      if (searchResults && searchResults.length > 0) {
        const uniquePlaces = new Map<string, any>();
        searchResults
          .filter((place: any) => place.types.includes('supermarket'))
          .forEach((place: any) => {
            if (place.id) {
                uniquePlaces.set(place.id, place);
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
            .filter((market): market is MarketLocation => market !== null);
        
        if (formattedMarkets.length > 0) {
          setMarketList(formattedMarkets);
          setError(null);
        } else {
           const errorMessage = 'Não foi possível encontrar supermercados com os critérios definidos. Verifique se a API "Places API" está ativada no seu projeto Google Cloud e se as restrições da sua chave de API estão corretas.';
           setError(errorMessage);
           toast({
              variant: 'destructive',
              title: 'Nenhum resultado',
              description: errorMessage,
           });
        }
      } else {
        setError('Não foram encontrados supermercados para a busca.');
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
    <div className="relative">
      <SupermarketMap 
        markets={marketList} 
        isLoading={isLoading}
        error={error}
        selectedMarket={selectedMarket}
        onMarkerClick={handleMarkerClick}
      />
      <SupermarketControls
        isLoading={isLoading}
        marketList={marketList}
        isListDialogOpen={isListDialogOpen}
        onListClick={handleOpenMarketList}
        onDialogClose={() => setIsListDialogOpen(false)}
        onMarketSelect={setSelectedMarket}
      />
    </div>
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
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Mapa Interativo</CardTitle>
        <CardDescription>
          Localize os principais mercados e suas promoções, obtidos em tempo real.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <APIProvider apiKey={apiKey} libraries={['places']}>
           <MapPageContent />
        </APIProvider>
      </CardContent>
    </Card>
  );
}

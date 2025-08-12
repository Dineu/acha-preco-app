'use client';

import { useEffect, useState, useRef } from 'react';
import { APIProvider, Map as GoogleMap, useMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { listSupermarketsInCity } from '@/lib/actions';
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
  isListing: boolean;
  marketList: string[];
  isListDialogOpen: boolean;
  onListClick: () => void;
  onDialogClose: () => void;
};


function SupermarketControls({ 
  isListing, 
  marketList, 
  isListDialogOpen,
  onListClick,
  onDialogClose
}: SupermarketControlsProps) {
  
  return (
    <>
      <div className="absolute top-4 right-4 z-10">
        <Button onClick={onListClick} disabled={isListing}>
          {isListing ? (
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
              Esta é uma lista dos supermercados encontrados no Google Maps.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-60 overflow-y-auto">
            <ul className="list-disc list-inside space-y-1">
              {marketList.map((market, index) => (
                <li key={index}>{market}</li>
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
function SupermarketMap() {
  const map = useMap();
  const [markets, setMarkets] = useState<MarketLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!map) return;
    
    const searchQuery = `"Atacadão" OR "Assaí Atacadista" OR "Roldão Atacadista" OR "Sonda Supermercados" OR "Supermercado Sumerbol" OR "Supermercados Pague Menos" OR "Supermercado GoodBom" OR "Supermercado Pão de Acucar" OR "Covabra Supermercados" em Indaiatuba`;

    setIsLoading(true);

    const request = {
      textQuery: searchQuery,
      fields: ['displayName', 'location'],
      locationBias: map.getCenter()!,
    };

    const findPlaces = async () => {
      try {
        // @ts-ignore
        const {places} = await google.maps.places.Place.searchByText(request);
        
        setIsLoading(false);

        if (places && places.length > 0) {
            const uniquePlaces = new Map<string, any>();
            places.forEach((place: any) => {
                if (place.id) {
                    uniquePlaces.set(place.id, place);
                }
            });
            
            const formattedMarkets = Array.from(uniquePlaces.values())
                .map(place => {
                    if (place.id && place.displayName && place.location) {
                        return {
                            id: place.id,
                            name: place.displayName,
                            location: {
                                lat: place.location.latitude,
                                lng: place.location.longitude,
                            },
                        };
                    }
                    return null;
                })
                .filter((market): market is MarketLocation => market !== null);
            
            if (formattedMarkets.length > 0) {
              setMarkets(formattedMarkets);
              setError(null);
            } else {
              setError('Não foi possível encontrar supermercados. Verifique se a API "Places API" está ativada no seu projeto Google Cloud e se as restrições da sua chave de API estão corretas.');
            }
        } else {
            setError('Nenhum supermercado encontrado para a busca realizada.');
        }
      } catch (e) {
        console.error('Error finding places:', e);
        setError('Ocorreu um erro ao buscar os supermercados. Verifique a chave de API e as configurações no console do Google Cloud.');
        setIsLoading(false);
      }
    };
    
    findPlaces();

  }, [map]);

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
            <AdvancedMarker key={market.id} position={market.location} title={market.name} />
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


export default function MapPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { toast } = useToast();
  const [isListing, setIsListing] = useState(false);
  const [marketList, setMarketList] = useState<string[]>([]);
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);

  const handleListSupermarkets = async () => {
    setIsListing(true);
    try {
      const result = await listSupermarketsInCity({ city: 'Indaiatuba' });
      setMarketList(result.supermarkets);
      setIsListDialogOpen(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao Listar Mercados',
        description: 'Não foi possível obter a lista de supermercados.',
      });
    } finally {
      setIsListing(false);
    }
  };


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
          <div className="relative">
             <SupermarketMap />
             <SupermarketControls
                isListing={isListing}
                marketList={marketList}
                isListDialogOpen={isListDialogOpen}
                onListClick={handleListSupermarkets}
                onDialogClose={() => setIsListDialogOpen(false)}
             />
           </div>
        </APIProvider>
      </CardContent>
    </Card>
  );
}

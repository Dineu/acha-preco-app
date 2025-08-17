
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { suggestMissingItems, suggestAlternateStores, extractPromotionDetails } from '@/lib/actions';

type FlowResult = {
  flow: string;
  result: any;
  error: string | null;
  executionTime: number;
}

export default function TestAiPage() {
  const [results, setResults] = useState<FlowResult[]>([]);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const runFlow = async (flowName: string, flowFunction: () => Promise<any>) => {
    setIsLoading(prev => ({ ...prev, [flowName]: true }));
    const startTime = performance.now();
    let result: any = null;
    let error: string | null = null;
    
    try {
      result = await flowFunction();
    } catch (e: any) {
      error = e.message || 'An unknown error occurred.';
    }
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;

    setResults(prev => [...prev, { flow: flowName, result, error, executionTime }]);
    setIsLoading(prev => ({ ...prev, [flowName]: false }));
  };

  const handleTestSuggestItems = () => {
    const input = { existingItems: ['Café', 'Filtro de papel', 'Açucar'] };
    runFlow('suggestMissingItems', () => suggestMissingItems(input));
  };
  
  const handleTestSuggestStores = () => {
    const input = { shoppingList: ['Arroz 5kg', 'Óleo de Soja', 'Leite Condensado'], currentStore: 'Pão de Açucar', city: 'Indaiatuba' };
    runFlow('suggestAlternateStores', () => suggestAlternateStores(input));
  };

  const handleTestExtractDetails = () => {
    // This is a base64 encoded 1x1 transparent pixel.
    // The AI might not find anything, but it tests if the flow runs without error.
    const photoDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    const input = { photoDataUri };
    runFlow('extractPromotionDetails', () => extractPromotionDetails(input));
  };


  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Página de Teste da IA</h1>
        <p className="text-muted-foreground">
          Use esta página para executar manualmente os fluxos de IA e diagnosticar problemas.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Executar Fluxos</CardTitle>
          <CardDescription>Clique nos botões abaixo para executar cada fluxo de IA com dados de teste.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
            <Button onClick={handleTestSuggestItems} disabled={isLoading['suggestMissingItems']}>
                {isLoading['suggestMissingItems'] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Testar "Sugerir Itens"
            </Button>
            <Button onClick={handleTestSuggestStores} disabled={isLoading['suggestAlternateStores']}>
                {isLoading['suggestAlternateStores'] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Testar "Sugerir Mercados"
            </Button>
             <Button onClick={handleTestExtractDetails} disabled={isLoading['extractPromotionDetails']}>
                {isLoading['extractPromotionDetails'] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Testar "Extrair Promoção"
            </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight font-headline">Resultados</h2>
        {results.length === 0 && <p className="text-muted-foreground">Nenhum fluxo foi executado ainda.</p>}
        {results.slice().reverse().map((res, index) => (
          <Card key={index}>
             <CardHeader>
               <CardTitle className={`flex justify-between items-center text-lg ${res.error ? 'text-destructive' : 'text-primary'}`}>
                <span>{res.flow}</span>
                <span className="text-sm font-mono text-muted-foreground">{res.executionTime.toFixed(0)}ms</span>
              </CardTitle>
             </CardHeader>
            <CardContent>
              {res.error ? (
                <div>
                  <h4 className="font-bold text-destructive">Erro</h4>
                  <pre className="mt-2 w-full whitespace-pre-wrap rounded-md bg-muted p-4 text-sm font-mono text-destructive">
                    {res.error}
                  </pre>
                </div>
              ) : (
                 <div>
                  <h4 className="font-bold">Resultado</h4>
                   <pre className="mt-2 w-full whitespace-pre-wrap rounded-md bg-muted p-4 text-sm font-mono">
                    {JSON.stringify(res.result, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

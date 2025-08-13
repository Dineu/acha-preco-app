
'use client';

import { useState, useRef, useMemo } from 'react';
import type { ShoppingList, Item, PromotionItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Lightbulb,
  Store,
  Trash2,
  PlusCircle,
  Upload,
  Loader2,
  Tags,
  Package,
} from 'lucide-react';
import { suggestMissingItems, suggestAlternateStores, extractPromotionDetails, comparePrices } from '@/lib/actions';
import type { ExtractPromotionDetailsOutput } from '@/ai/flows/extract-promotion-details';
import type { ComparePricesOutput } from '@/ai/flows/price-comparison-flow';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import * as pdfjsLib from 'pdfjs-dist';
import { MarkdownTable } from './markdown-table';

// Configura o worker para o processamento de PDFs no lado do cliente.
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}


/**
 * @fileoverview Este componente de cliente gerencia toda a interatividade da página de detalhes da lista de compras.
 * Ele lida com o estado da lista (adição/remoção/marcação de itens), e também com todas as
 * interações de IA, como sugerir itens, comparar preços e extrair promoções de arquivos.
 * @param {{ initialList: ShoppingList }} props - As propriedades do componente, contendo a lista inicial.
 */
export default function ShoppingListClientPage({ initialList }: { initialList: ShoppingList }) {
  // Estado principal da lista de compras.
  const [list, setList] = useState(initialList);
  // Estados para os campos de adição de novo item.
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemStore, setNewItemStore] = useState('');
  // Estados para armazenar os resultados das chamadas de IA.
  const [missingItems, setMissingItems] = useState<string[]>([]);
  const [alternateStores, setAlternateStores] = useState<{ stores: string[]; reasoning: string } | null>(null);
  const [priceComparisonResult, setPriceComparisonResult] = useState<ComparePricesOutput | null>(null);
  const [extractedPromotion, setExtractedPromotion] = useState<ExtractPromotionDetailsOutput | null>(null);
  // Estados para controlar o loading de cada chamada de IA.
  const [isSuggestingItems, setIsSuggestingItems] = useState(false);
  const [isSuggestingStores, setIsSuggestingStores] = useState(false);
  const [isExtractingPromotion, setIsExtractingPromotion] = useState(false);
  const [isComparingPrices, setIsComparingPrices] = useState(false);
  // Estados para controlar a abertura dos diálogos (modals).
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);
  
  // Referência para o input de arquivo, para acioná-lo programaticamente.
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  // Marca ou desmarca um item da lista.
  const handleToggleItem = (itemId: string) => {
    setList((prevList) => ({
      ...prevList,
      items: prevList.items.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  // Adiciona um novo item à lista. Pode receber um item preenchido (ex: vindo de uma promoção).
  const handleAddItem = (prefilledItem?: Partial<Item>) => {
    const name = prefilledItem?.name || newItemName;
    if (name.trim() === '') return;

    const newItem: Item = {
      id: `item-${Date.now()}`,
      name: name.trim(),
      quantity: 1,
      checked: false,
      price: prefilledItem?.price || (newItemPrice ? parseFloat(newItemPrice) : undefined),
      store: prefilledItem?.store || newItemStore.trim(),
    };
    setList((prevList) => ({
      ...prevList,
      items: [...prevList.items, newItem],
    }));

    // Limpa os campos do formulário.
    setNewItemName('');
    setNewItemPrice('');
    setNewItemStore('');
  };

  // Remove um item da lista.
  const handleRemoveItem = (itemId: string) => {
    setList((prevList) => ({
      ...prevList,
      items: prevList.items.filter((item) => item.id !== itemId),
    }));
  };
  
  // Chama a IA para sugerir itens com base na lista atual.
  const handleSuggestMissingItems = async () => {
    setIsSuggestingItems(true);
    setMissingItems([]);
    try {
      const existingItems = list.items.map(item => item.name);
      const result = await suggestMissingItems({ existingItems });
      setMissingItems(result.suggestedItems);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na Sugestão",
        description: "Não foi possível obter sugestões de itens.",
      });
    } finally {
      setIsSuggestingItems(false);
    }
  };

  // Chama a IA para sugerir mercados alternativos.
  const handleSuggestAlternateStores = async () => {
    setIsSuggestingStores(true);
    setAlternateStores(null);
    try {
      const shoppingList = list.items.map(item => item.name);
      const result = await suggestAlternateStores({ shoppingList, currentStore: "Carrefour", city: "Indaiatuba" });
      setAlternateStores({ stores: result.alternateStores, reasoning: result.reasoning });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na Sugestão",
        description: "Não foi possível obter sugestões de mercados.",
      });
    } finally {
      setIsSuggestingStores(false);
    }
  };

  // Chama a IA para comparar os preços dos itens da lista.
  const handleComparePrices = async () => {
    setIsComparingPrices(true);
    setPriceComparisonResult(null);
    try {
      const shoppingList = list.items.map(item => item.name);
      const result = await comparePrices({ shoppingList, city: 'Indaiatuba' });
      setPriceComparisonResult(result);
      setIsPriceDialogOpen(true); // Abre o diálogo com os resultados.
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Erro ao Comparar Preços",
            description: error.message || "Não foi possível obter a comparação de preços.",
        });
    } finally {
        setIsComparingPrices(false);
    }
  };

  // Aciona o clique no input de arquivo oculto.
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  // Processa o arquivo (imagem ou PDF) e chama a IA para extrair os detalhes da promoção.
  const processAndExtract = async (photoDataUri: string) => {
    setIsExtractingPromotion(true);
    setExtractedPromotion(null);
    try {
      const result = await extractPromotionDetails({ photoDataUri });
      setExtractedPromotion(result);
      setIsPromotionDialogOpen(true); // Abre o diálogo com as promoções extraídas.
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na Extração",
        description: "Não foi possível extrair detalhes da promoção do arquivo.",
      });
      console.error("Extraction error:", error);
    } finally {
      setIsExtractingPromotion(false);
    }
  };

  // Lida com a mudança no input de arquivo (quando o usuário seleciona um arquivo).
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Se for imagem, lê diretamente.
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        processAndExtract(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    // Se for PDF, converte para imagem antes de processar.
    } else if (file.type === 'application/pdf') {
      try {
        setIsExtractingPromotion(true);
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        const page = await pdf.getPage(1); // Processa apenas a primeira página.
        const viewport = page.getViewport({ scale: 1.5 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport: viewport }).promise;
          const dataUri = canvas.toDataURL('image/jpeg');
          processAndExtract(dataUri); // Envia a imagem convertida para a IA.
        } else {
            throw new Error('Could not get canvas context');
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao processar PDF",
          description: "Não foi possível converter o PDF para imagem.",
        });
        setIsExtractingPromotion(false);
      }
    } else {
        toast({
            variant: "destructive",
            title: "Tipo de arquivo não suportado",
            description: "Por favor, envie um arquivo de imagem (JPG, PNG) ou PDF.",
        });
    }

    event.target.value = ''; // Reseta o input de arquivo.
  };
  
  // Adiciona um item de uma promoção extraída pela IA para a lista de compras.
  const handleAddPromotionToList = (promo: PromotionItem, store?: string) => {
    handleAddItem({
        name: promo.productName,
        price: promo.price,
        store: store || '',
    });
    toast({
        title: "Item Adicionado!",
        description: `"${promo.productName}" foi adicionado à sua lista.`,
    });
  };

  // Ordena os itens da lista: primeiro por mercado, depois por nome do item.
  const sortedItems = useMemo(() => {
    return [...list.items].sort((a, b) => {
        // Usa um placeholder para agrupar itens sem mercado no final.
        const storeA = a.store?.trim() || 'zzzz_no_store';
        const storeB = b.store?.trim() || 'zzzz_no_store';

        // Ordenação primária por nome do mercado.
        if (storeA < storeB) return -1;
        if (storeA > storeB) return 1;

        // Ordenação secundária por nome do item.
        return a.name.localeCompare(b.name);
    });
  }, [list.items]);


  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Coluna principal com a lista de compras */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{list.name}</CardTitle>
            <CardDescription>Adicione novos itens e organize sua lista.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Formulário para adicionar novos itens */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <Input
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Ex: Leite, Ovos, Pão..."
                className="flex-grow"
              />
               <Input
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                placeholder="Preço (opcional)"
                type="number"
                className="w-full sm:w-24"
              />
              <Input
                value={newItemStore}
                onChange={(e) => setNewItemStore(e.target.value)}
                placeholder="Mercado (opcional)"
                className="w-full sm:w-40"
              />
              <Button onClick={() => handleAddItem()} className="w-full sm:w-auto">
                <PlusCircle className="h-4 w-4 mr-2" /> Adicionar
              </Button>
            </div>
             {/* Tabela de itens da lista */}
             {list.items.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Package className="h-12 w-12 mx-auto mb-4" />
                  <p>Sua lista está vazia.</p>
                  <p>Adicione itens acima para começar.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">OK</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead>Mercado</TableHead>
                                <TableHead className="text-right">Preço</TableHead>
                                <TableHead className="w-[50px] text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {sortedItems.map((item) => (
                            <TableRow key={item.id}>
                            <TableCell>
                                <Checkbox
                                checked={item.checked}
                                onCheckedChange={() => handleToggleItem(item.id)}
                                aria-label={`Marcar ${item.name} como comprado`}
                                />
                            </TableCell>
                            <TableCell className={`font-medium ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                                {item.name}
                            </TableCell>
                            <TableCell className={`${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                                {item.store || '-'}
                            </TableCell>
                            <TableCell className="text-right">
                                {item.price ? `R$ ${item.price.toFixed(2)}` : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(item.id)}
                                >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remover item</span>
                                </Button>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Coluna lateral com as funcionalidades de IA */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Lightbulb /> Assistente IA
            </CardTitle>
            <CardDescription>
              Receba sugestões para otimizar suas compras.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full" onClick={handleComparePrices} disabled={isComparingPrices || list.items.length === 0}>
                {isComparingPrices ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Tags className="mr-2 h-4 w-4" />
                )}
                Comparar Preços
            </Button>

            <Button variant="secondary" className="w-full" onClick={handleSuggestMissingItems} disabled={isSuggestingItems}>
              {isSuggestingItems ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lightbulb className="mr-2 h-4 w-4" />
              )}
              Sugerir itens esquecidos
            </Button>
            {/* Exibe itens sugeridos pela IA */}
            {missingItems.length > 0 && (
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2 text-sm">Itens sugeridos:</h4>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  {missingItems.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </div>
            )}
            
            <Button className="w-full" onClick={handleSuggestAlternateStores} disabled={isSuggestingStores}>
              {isSuggestingStores ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Store className="mr-2 h-4 w-4" />
              )}
              Melhor preço
            </Button>
            {/* Exibe mercados alternativos sugeridos pela IA */}
            {alternateStores && (
               <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2 text-sm">Mercados alternativos:</h4>
                <p className="text-sm mb-2 text-muted-foreground">{alternateStores.reasoning}</p>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  {alternateStores.stores.map((store, index) => <li key={index}>{store}</li>)}
                </ul>
              </div>
            )}

          </CardContent>
        </Card>
        {/* Card para carregar ofertas */}
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Upload /> Enviar Oferta
            </CardTitle>
            <CardDescription>
              Ajude a comunidade enviando fotos de ofertas que você encontrar.
            </CardDescription>
          </CardHeader>
          <CardContent>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange}
                accept="image/*,application/pdf"
              />
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={handleUploadButtonClick}
                disabled={isExtractingPromotion}
              >
                {isExtractingPromotion ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Carregar foto ou PDF
            </Button>
          </CardContent>
        </Card>
        
        {/* Diálogo para exibir promoções extraídas */}
        <AlertDialog open={isPromotionDialogOpen} onOpenChange={setIsPromotionDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Promoções Extraídas com Sucesso!</AlertDialogTitle>
                <AlertDialogDescription>
                    A IA analisou a imagem e encontrou os seguintes detalhes.
                    {extractedPromotion?.store && ` As ofertas parecem ser do supermercado: **${extractedPromotion.store}**.`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              {extractedPromotion && (
                <div className="max-h-60 overflow-y-auto text-sm space-y-2 border-t pt-4 mt-2">
                  {Array.isArray(extractedPromotion.promotions) && extractedPromotion.promotions.length > 0 ? (
                    extractedPromotion.promotions.map((promo, index) => (
                      <div key={index} className="p-2 bg-muted rounded-md flex items-center justify-between">
                          <div>
                            <p><strong>Produto:</strong> {promo.productName}</p>
                            <p><strong>Preço:</strong> R$ {promo.price.toFixed(2)}</p>
                          </div>
                           <Button 
                             size="sm" 
                             variant="outline"
                             onClick={() => handleAddPromotionToList(promo, extractedPromotion.store)}
                           >
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Adicionar
                           </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Nenhuma promoção clara foi encontrada na imagem.</p>
                  )}
                </div>
              )}
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setIsPromotionDialogOpen(false)}>Ótimo!</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        {/* Diálogo para exibir comparação de preços */}
        <AlertDialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
          <AlertDialogContent className="max-w-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Comparativo de Preços</AlertDialogTitle>
              <AlertDialogDescription>
                A IA estimou os preços da sua lista nos supermercados da região.
                {priceComparisonResult?.recommendation}
              </AlertDialogDescription>
            </AlertDialogHeader>
            {priceComparisonResult && (
              <div className="max-h-[60vh] overflow-y-auto text-sm border-t pt-4 mt-2">
                 <MarkdownTable markdown={priceComparisonResult.priceTable} />
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setIsPriceDialogOpen(false)}>Entendi</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>


      </div>
    </div>
  );
}

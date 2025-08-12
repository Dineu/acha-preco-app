'use client';

import { useState, useRef } from 'react';
import type { ShoppingList, Item } from '@/lib/types';
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
} from 'lucide-react';
import { suggestMissingItems, suggestAlternateStores, extractPromotionDetails } from '@/lib/actions';
import type { ExtractPromotionDetailsOutput } from '@/ai/flows/extract-promotion-details';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';


export default function ShoppingListClientPage({ initialList }: { initialList: ShoppingList }) {
  const [list, setList] = useState(initialList);
  const [newItemName, setNewItemName] = useState('');
  const [missingItems, setMissingItems] = useState<string[]>([]);
  const [alternateStores, setAlternateStores] = useState<{ stores: string[]; reasoning: string } | null>(null);
  const [isSuggestingItems, setIsSuggestingItems] = useState(false);
  const [isSuggestingStores, setIsSuggestingStores] = useState(false);
  const [isExtractingPromotion, setIsExtractingPromotion] = useState(false);
  const [extractedPromotion, setExtractedPromotion] = useState<ExtractPromotionDetailsOutput | null>(null)
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const handleToggleItem = (itemId: string) => {
    setList((prevList) => ({
      ...prevList,
      items: prevList.items.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const handleAddItem = () => {
    if (newItemName.trim() === '') return;
    const newItem: Item = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      quantity: 1,
      checked: false,
    };
    setList((prevList) => ({
      ...prevList,
      items: [...prevList.items, newItem],
    }));
    setNewItemName('');
  };

  const handleRemoveItem = (itemId: string) => {
    setList((prevList) => ({
      ...prevList,
      items: prevList.items.filter((item) => item.id !== itemId),
    }));
  };
  
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

  const handleSuggestAlternateStores = async () => {
    setIsSuggestingStores(true);
    setAlternateStores(null);
    try {
      const shoppingList = list.items.map(item => item.name);
      // Assuming a default current store for the example
      const currentStore = "Carrefour"; 
      const result = await suggestAlternateStores({ shoppingList, currentStore });
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

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const photoDataUri = e.target?.result as string;
        setIsExtractingPromotion(true);
        setExtractedPromotion(null);
        try {
          const result = await extractPromotionDetails({ photoDataUri });
          setExtractedPromotion(result);
          setIsPromotionDialogOpen(true);
        } catch (error) {
           toast({
            variant: "destructive",
            title: "Erro na Extração",
            description: "Não foi possível extrair detalhes da promoção da imagem.",
          });
          console.error("Extraction error:", error);
        } finally {
          setIsExtractingPromotion(false);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset file input to allow uploading the same file again
    event.target.value = '';
  };


  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{list.name}</CardTitle>
            <CardDescription>Adicione, remova e marque os itens da sua lista.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Ex: Leite, Ovos, Pão..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
              />
              <Button onClick={handleAddItem}>
                <PlusCircle className="h-4 w-4 mr-2" /> Adicionar
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Comprado</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="w-[100px] text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.items.map((item) => (
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
                      <TableCell className="text-center">
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
          </CardContent>
        </Card>
      </div>

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
            <Button variant="secondary" className="w-full" onClick={handleSuggestMissingItems} disabled={isSuggestingItems}>
              {isSuggestingItems ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lightbulb className="mr-2 h-4 w-4" />
              )}
              Sugerir itens esquecidos
            </Button>

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
              Encontrar mercados mais baratos
            </Button>

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
                accept="image/*"
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
                Carregar foto da oferta
            </Button>
          </CardContent>
        </Card>
        
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
                      <div key={index} className="p-2 bg-muted rounded-md">
                          <p><strong>Produto:</strong> {promo.productName}</p>
                          <p><strong>Preço:</strong> R$ {promo.price.toFixed(2)}</p>
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

      </div>
    </div>
  );
}

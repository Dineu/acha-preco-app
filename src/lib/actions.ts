'use server';

import {
  suggestMissingItems as suggestMissingItemsFlow,
  SuggestMissingItemsInput,
  SuggestMissingItemsOutput,
} from '@/ai/flows/suggest-missing-items';
import {
  suggestAlternateStores as suggestAlternateStoresFlow,
  SuggestAlternateStoresInput,
  SuggestAlternateStoresOutput,
} from '@/ai/flows/suggest-alternate-stores';
import {
  extractPromotionDetails as extractPromotionDetailsFlow,
  ExtractPromotionDetailsInput,
  ExtractPromotionDetailsOutput,
} from '@/ai/flows/extract-promotion-details';
import {
    comparePrices as comparePricesFlow,
    ComparePricesInput,
    ComparePricesOutput,
} from '@/ai/flows/price-comparison-flow';
import {
  getShoppingListsByUser as getShoppingListsByUserSvc,
  createShoppingList as createShoppingListSvc,
  updateShoppingList as updateShoppingListSvc,
  deleteShoppingList as deleteShoppingListSvc,
} from '@/lib/shopping-list-service';
import type { ShoppingList } from '@/lib/types';


export async function suggestMissingItems(input: SuggestMissingItemsInput): Promise<SuggestMissingItemsOutput> {
  console.log('[Action] Iniciando suggestMissingItems com input:', input);
  try {
    const result = await suggestMissingItemsFlow(input);
    console.log('[Action] suggestMissingItems concluído com sucesso. Resultado:', result);
    return result;
  } catch (error: any) {
    console.error('[Action] Erro em suggestMissingItems:', error);
    throw new Error(`Falha ao obter sugestões de itens: ${error.message}`);
  }
}

export async function suggestAlternateStores(input: SuggestAlternateStoresInput): Promise<SuggestAlternateStoresOutput> {
  console.log('[Action] Iniciando suggestAlternateStores com input:', input);
  try {
    const result = await suggestAlternateStoresFlow(input);
    console.log('[Action] suggestAlternateStores concluído com sucesso. Resultado:', result);
    return result;
  } catch (error: any) {
    console.error('[Action] Erro em suggestAlternateStores:', error);
    throw new Error(`Falha ao obter sugestões de lojas: ${error.message}`);
  }
}

export async function extractPromotionDetails(input: ExtractPromotionDetailsInput): Promise<ExtractPromotionDetailsOutput> {
  // Não logar o input aqui pois ele contém a imagem inteira em base64, o que poluiria o log.
  console.log('[Action] Iniciando extractPromotionDetails.');
  try {
    const result = await extractPromotionDetailsFlow(input);
    console.log('[Action] extractPromotionDetails concluído com sucesso. Resultado:', result);
    return result;
  } catch (error: any) {
    console.error('[Action] Erro em extractPromotionDetails:', error);
    throw new Error(`Falha ao extrair detalhes da promoção: ${error.message}`);
  }
}


export async function comparePrices(input: ComparePricesInput): Promise<ComparePricesOutput> {
    console.log('[Action] Iniciando comparePrices com input:', input);
    try {
      const result = await comparePricesFlow(input);
      console.log('[Action] comparePrices concluído com sucesso.');
      return result;
    } catch (error: any) {
      console.error('[Action] Erro em comparePrices:', error);
      throw new Error(`Falha ao comparar preços: ${error.message}`);
    }
}

// Shopping list CRUD (delegates to Firestore service)
export async function getShoppingListsByUser(userId: string): Promise<ShoppingList[]> {
  try {
    return await getShoppingListsByUserSvc(userId);
  } catch (error: any) {
    console.error('[Action] Erro em getShoppingListsByUser:', error);
    throw new Error(error.message || 'Falha ao buscar listas');
  }
}

export async function createShoppingList(name: string, userId: string): Promise<ShoppingList> {
  try {
    return await createShoppingListSvc(name, userId);
  } catch (error: any) {
    console.error('[Action] Erro em createShoppingList:', error);
    throw new Error(error.message || 'Falha ao criar lista');
  }
}

export async function updateShoppingList(updatedList: ShoppingList): Promise<void> {
  try {
    await updateShoppingListSvc(updatedList);
  } catch (error: any) {
    console.error('[Action] Erro em updateShoppingList:', error);
    throw new Error(error.message || 'Falha ao atualizar lista');
  }
}

export async function deleteShoppingList(listId: string): Promise<void> {
  try {
    await deleteShoppingListSvc(listId);
  } catch (error: any) {
    console.error('[Action] Erro em deleteShoppingList:', error);
    throw new Error(error.message || 'Falha ao excluir lista');
  }
}

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

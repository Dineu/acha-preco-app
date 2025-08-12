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
  try {
    const result = await suggestMissingItemsFlow(input);
    return result;
  } catch (error) {
    console.error('Error suggesting missing items:', error);
    throw new Error('Failed to get suggestions.');
  }
}

export async function suggestAlternateStores(input: SuggestAlternateStoresInput): Promise<SuggestAlternateStoresOutput> {
  try {
    const result = await suggestAlternateStoresFlow(input);
    return result;
  } catch (error) {
    console.error('Error suggesting alternate stores:', error);
    throw new Error('Failed to get store suggestions.');
  }
}

export async function extractPromotionDetails(input: ExtractPromotionDetailsInput): Promise<ExtractPromotionDetailsOutput> {
  try {
    const result = await extractPromotionDetailsFlow(input);
    return result;
  } catch (error) {
    console.error('Error extracting promotion details:', error);
    throw new Error('Failed to extract promotion details.');
  }
}

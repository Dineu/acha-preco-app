'use server';

/**
 * @fileOverview A flow that suggests alternate stores based on a shopping list.
 *
 * - suggestAlternateStores - A function that handles the suggestion of alternate stores.
 * - SuggestAlternateStoresInput - The input type for the suggestAlternateStores function.
 * - SuggestAlternateStoresOutput - The return type for the suggestAlternateStores function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAlternateStoresInputSchema = z.object({
  shoppingList: z
    .array(z.string())
    .describe('The list of items to buy.'),
  currentStore: z.string().describe('The store the user is currently considering.'),
});
export type SuggestAlternateStoresInput = z.infer<typeof SuggestAlternateStoresInputSchema>;

const SuggestAlternateStoresOutputSchema = z.object({
  alternateStores: z
    .array(z.string())
    .describe('A list of alternate stores that might have better prices for the items on the list.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested alternate stores.'),
});
export type SuggestAlternateStoresOutput = z.infer<typeof SuggestAlternateStoresOutputSchema>;

export async function suggestAlternateStores(input: SuggestAlternateStoresInput): Promise<SuggestAlternateStoresOutput> {
  return suggestAlternateStoresFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAlternateStoresPrompt',
  input: {schema: SuggestAlternateStoresInputSchema},
  output: {schema: SuggestAlternateStoresOutputSchema},
  prompt: `You are a helpful shopping assistant. Given a list of items and the current store a user is considering, suggest alternate stores that might have better prices for the items on the list.

List of items: {{shoppingList}}
Current store: {{currentStore}}

Consider stores in Indaiatuba only.

Respond with a list of alternate stores and a brief explanation of why you are suggesting them.`,
});

const suggestAlternateStoresFlow = ai.defineFlow(
  {
    name: 'suggestAlternateStoresFlow',
    inputSchema: SuggestAlternateStoresInputSchema,
    outputSchema: SuggestAlternateStoresOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

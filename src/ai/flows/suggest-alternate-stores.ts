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
  prompt: `Você é um assistente de compras especialista na cidade de Indaiatuba, São Paulo. Dada uma lista de itens e a loja atual que um usuário está considerando, sugira lojas alternativas que possam ter preços melhores para os itens da lista.

Lista de itens: {{shoppingList}}
Loja atual: {{currentStore}}

INSTRUÇÕES IMPORTANTES:
1.  **Foco em Indaiatuba:** Considere apenas os seguintes supermercados que são os principais da cidade: Atacadão, Assaí Atacadista, Roldão Atacadista, Sonda Supermercados, Supermercado Sumerbol, Supermercados Pague Menos, Supermercado GoodBom, Pão de Açúcar, Covabra Supermercados, MonteKali Supermercado.
2.  **Preços Competitivos:** Lembre-se que "Atacadão", "Assaí Atacadista" e "Roldão Atacadista" são "atacarejos", e geralmente possuem preços mais baixos, especialmente para compras maiores.
3.  **Não invente lojas:** Não sugira lojas que não estão na lista acima. O supermercado "Paulistão" não existe mais na cidade.

Responda com uma lista de lojas alternativas e uma breve explicação do motivo pelo qual você as está sugerindo. A resposta deve ser em português.`,
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

'use server';

/**
 * @fileOverview A flow that suggests alternate stores based on a shopping list.
 *
 * - suggestAlternateStores - A function that handles the suggestion of alternate stores.
 * - SuggestAlternateStoresInput - The input type for the suggestAlternateStores function.
 * - SuggestAlternateStoresOutput - The return type for the suggestAlternateStores function.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import { searchNearby } from '@/services/google-maps';


const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

// Define the tool directly in this file
const findSupermarketsTool = ai.defineTool(
  {
    name: 'findSupermarkets',
    description: 'Busca e retorna uma lista de supermercados em uma cidade específica para ajudar a recomendar as melhores opções de compras.',
    inputSchema: z.object({
        city: z.string().describe('A cidade onde a busca por supermercados deve ser realizada, por exemplo, "Indaiatuba".'),
    }),
    outputSchema: z.object({
        supermercados: z.array(z.string()).describe('Uma lista com os nomes dos supermercados encontrados.'),
    }),
  },
  async (input) => {
    console.log(`[AI Tool] A ferramenta findSupermarkets foi chamada com a cidade: ${input.city}`);
    
    const query = `supermercado em ${input.city}`;
    console.log(`[AI Tool] Montando a query para a busca: "${query}"`);

    try {
      const results = await searchNearby(query, input.city);
      const names = results.map((place) => place.name).filter((name): name is string => !!name);
      const uniqueNames = [...new Set(names)];

      console.log(`[AI Tool] Encontrados ${uniqueNames.length} supermercados únicos. Lista:`, uniqueNames);
      return { supermercados: uniqueNames };
    } catch (error) {
      console.error('[AI Tool] Erro dentro da ferramenta findSupermarketsTool:', error);
      return { supermercados: [] };
    }
  }
);


const SuggestAlternateStoresInputSchema = z.object({
  shoppingList: z
    .array(z.string())
    .describe('The list of items to buy.'),
  currentStore: z.string().describe('The store the user is currently considering.'),
  city: z.string().describe('The city where the user is located.'),
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
  model: 'googleai/gemini-1.5-flash',
  input: {schema: SuggestAlternateStoresInputSchema},
  output: {schema: SuggestAlternateStoresOutputSchema},
  tools: [findSupermarketsTool],
  prompt: `Você é um assistente de compras especialista na cidade de Indaiatuba, São Paulo. Dada uma lista de itens e a loja atual que um usuário está considerando, sugira lojas alternativas que possam ter preços melhores para os itens da lista.

Lista de itens: {{shoppingList}}
Loja atual: {{currentStore}}

INSTRUÇÕES IMPORTANTES:
1.  **Use a Ferramenta findSupermarkets**: Antes de responder, use a ferramenta 'findSupermarkets' para a cidade de "{{city}}". Baseie suas sugestões APENAS nos resultados dessa ferramenta. Se a ferramenta não retornar supermercados, informe ao usuário que não foi possível encontrar lojas e que, por isso, não pode fazer sugestões.
2.  **Preços Competitivos:** Lembre-se que "Atacadão", "Assaí Atacadista" e "Roldão Atacadista" são "atacarejos", e geralmente possuem preços mais baixos, especialmente para compras maiores.
3.  **Não invente lojas:** Não sugira lojas que não foram retornadas pela ferramenta.

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

'use server';

/**
 * @fileOverview A flow to compare shopping list prices across different supermarkets.
 *
 * - comparePrices - A function that estimates prices and provides a comparison table.
 * - ComparePricesInput - The input type for the comparePrices function.
 * - ComparePricesOutput - The return type for the comparePrices function.
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


const ComparePricesInputSchema = z.object({
  shoppingList: z
    .array(z.string())
    .describe('The list of items to buy.'),
  city: z.string().describe('The city to search for supermarkets in.'),
});
export type ComparePricesInput = z.infer<typeof ComparePricesInputSchema>;

const ComparePricesOutputSchema = z.object({
  priceTable: z
    .string()
    .describe('A Markdown formatted table comparing the prices of each item across different supermarkets.'),
  recommendation: z
    .string()
    .describe('A brief recommendation on where to shop for the best value.'),
});
export type ComparePricesOutput = z.infer<typeof ComparePricesOutputSchema>;


export async function comparePrices(input: ComparePricesInput): Promise<ComparePricesOutput> {
  return comparePricesFlow(input);
}


const prompt = ai.definePrompt({
  name: 'comparePricesPrompt',
  model: 'googleai/gemini-1.5-flash',
  tools: [findSupermarketsTool],
  input: {schema: ComparePricesInputSchema},
  output: {schema: ComparePricesOutputSchema},
  prompt: `Você é um especialista em preços de supermercados na cidade de Indaiatuba, São Paulo.
Sua tarefa é criar uma tabela comparativa de preços para uma dada lista de compras.

Lista de Compras:
{{#each shoppingList}}
- {{this}}
{{/each}}

INSTRUÇÕES:
1.  **Obtenha a Lista de Supermercados**: Use a ferramenta 'findSupermarkets' para a cidade de "{{city}}" para obter a lista de supermercados a serem comparados. Use no máximo 7 supermercados da lista, priorizando uma mistura de atacarejos e varejos.
2.  **Estime os Preços**: Para cada item da lista, estime o preço em cada um dos supermercados selecionados. Baseie suas estimativas no seu conhecimento geral de preços e no perfil de cada loja (ex: Atacadão, Assaí e Roldão são atacarejos e geralmente mais baratos em itens básicos e em quantidade. Pão de Açúcar é um varejo premium com preços mais altos. Sumerbol, Pague Menos, GoodBom e Sonda são varejos tradicionais com preços intermediários).
3.  **Crie a Tabela**: Formate a saída como uma tabela em Markdown. A primeira coluna deve ser o nome do produto. As colunas seguintes devem ser os supermercados. A última linha da tabela deve ser o "Total" estimado para a soma dos itens em cada supermercado. **NUNCA inclua uma coluna de "Total" no final da tabela.**
4.  **Crie a Recomendação**: Com base na tabela, forneça uma recomendação curta e objetiva sobre qual supermercado (ou combinação de supermercados) oferece o melhor custo-benefício para essa lista específica.

Se a ferramenta não retornar nenhum supermercado, informe que não é possível fazer a comparação.
A resposta deve ser em português.`,
});


const comparePricesFlow = ai.defineFlow(
  {
    name: 'comparePricesFlow',
    inputSchema: ComparePricesInputSchema,
    outputSchema: ComparePricesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

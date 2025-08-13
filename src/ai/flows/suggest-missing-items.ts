'use server';

/**
 * @fileOverview A flow to suggest missing items for a shopping list.
 *
 * - suggestMissingItems - A function that suggests missing items based on a list of existing items.
 * - SuggestMissingItemsInput - The input type for the suggestMissingItems function.
 * - SuggestMissingItemsOutput - The return type for the suggestMissingItems function.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

const SuggestMissingItemsInputSchema = z.object({
  existingItems: z
    .array(z.string())
    .describe('The items currently in the shopping list.'),
});
export type SuggestMissingItemsInput = z.infer<typeof SuggestMissingItemsInputSchema>;

const SuggestMissingItemsOutputSchema = z.object({
  suggestedItems: z
    .array(z.string())
    .describe('The list of suggested items to add to the shopping list.'),
});
export type SuggestMissingItemsOutput = z.infer<typeof SuggestMissingItemsOutputSchema>;

export async function suggestMissingItems(input: SuggestMissingItemsInput): Promise<SuggestMissingItemsOutput> {
  return suggestMissingItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMissingItemsPrompt',
  input: {schema: SuggestMissingItemsInputSchema},
  output: {schema: SuggestMissingItemsOutputSchema},
  prompt: `You are a helpful shopping assistant. Given a list of items already in a user's shopping list, suggest other items that they might have forgotten to add.

Existing Items:
{{#each existingItems}}- {{this}}\n{{/each}}

Suggested Items:`,
});

const suggestMissingItemsFlow = ai.defineFlow(
  {
    name: 'suggestMissingItemsFlow',
    inputSchema: SuggestMissingItemsInputSchema,
    outputSchema: SuggestMissingItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';
/**
 * @fileOverview A flow to list supermarkets in a city using a tool.
 *
 * - listSupermarkets - A function that lists supermarkets.
 * - ListSupermarketsInput - The input type for the listSupermarkets function.
 * - ListSupermarketsOutput - The return type for the listSupermarkets function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { findSupermarketsTool, FindSupermarketsInputSchema, FindSupermarketsOutputSchema } from '../tools/findSupermarkets';

export type ListSupermarketsInput = z.infer<typeof FindSupermarketsInputSchema>;
export type ListSupermarketsOutput = z.infer<typeof FindSupermarketsOutputSchema>;

const prompt = ai.definePrompt({
  name: 'listSupermarketsPrompt',
  input: { schema: FindSupermarketsInputSchema },
  output: { schema: FindSupermarketsOutputSchema },
  tools: [findSupermarketsTool],
  prompt: `You are a helpful assistant. Use the findSupermarkets tool to list all supermarkets in the given city: {{city}}. Then, output the list of supermarkets you found.`,
});

const listSupermarketsFlow = ai.defineFlow(
  {
    name: 'listSupermarketsFlow',
    inputSchema: FindSupermarketsInputSchema,
    outputSchema: FindSupermarketsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    // The tool directly returns the desired output format, so we can just return it.
    return output!;
  }
);

export async function listSupermarkets(input: ListSupermarketsInput): Promise<ListSupermarketsOutput> {
  return listSupermarketsFlow(input);
}

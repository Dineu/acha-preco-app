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
import { findSupermarketsTool } from '../tools/findSupermarkets';

export const ListSupermarketsInputSchema = z.object({
  city: z.string().describe('The city to search for supermarkets in.'),
});
export type ListSupermarketsInput = z.infer<typeof ListSupermarketsInputSchema>;

export const ListSupermarketsOutputSchema = z.object({
  supermarkets: z.array(z.string()).describe('A list of supermarket names.'),
});
export type ListSupermarketsOutput = z.infer<typeof ListSupermarketsOutputSchema>;

const prompt = ai.definePrompt({
  name: 'listSupermarketsPrompt',
  input: { schema: ListSupermarketsInputSchema },
  output: { schema: ListSupermarketsOutputSchema },
  tools: [findSupermarketsTool],
  prompt: `You are a helpful assistant. Use the findSupermarkets tool to list all supermarkets in the given city: {{city}}. Then, output the list of supermarkets you found.`,
});

const listSupermarketsFlow = ai.defineFlow(
  {
    name: 'listSupermarketsFlow',
    inputSchema: ListSupermarketsInputSchema,
    outputSchema: ListSupermarketsOutputSchema,
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

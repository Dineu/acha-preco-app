'use server';

/**
 * @fileOverview A flow to test the AI connection.
 *
 * - testAi - A function that returns a simple message to confirm the AI is working.
 * - TestAiOutput - The return type for the testAi function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';


const TestAiOutputSchema = z.object({
  message: z.string().describe('The success message from the AI.'),
});
export type TestAiOutput = z.infer<typeof TestAiOutputSchema>;

export async function testAi(): Promise<TestAiOutput> {
  return testAiFlow();
}

const prompt = ai.definePrompt({
  name: 'testAiPrompt',
  prompt: `You are a helpful assistant. Respond with a short, friendly message in Portuguese confirming that you are online and working. Start with "Olá!".`,
  output: {schema: TestAiOutputSchema},
});

const testAiFlow = ai.defineFlow(
  {
    name: 'testAiFlow',
    outputSchema: TestAiOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);

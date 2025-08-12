'use server';

/**
 * @fileOverview A flow that extracts promotion details from an image.
 *
 * - extractPromotionDetails - A function that handles the promotion extraction process.
 * - ExtractPromotionDetailsInput - The input type for the extractPromotionDetails function.
 * - ExtractPromotionDetailsOutput - The return type for the extractPromotionDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractPromotionDetailsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a promotion, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractPromotionDetailsInput = z.infer<typeof ExtractPromotionDetailsInputSchema>;

const ExtractPromotionDetailsOutputSchema = z.object({
  productName: z.string().describe('The name of the product on promotion.'),
  price: z.number().describe('The price of the product.'),
  store: z.string().optional().describe('The name of the supermarket, if visible.'),
});
export type ExtractPromotionDetailsOutput = z.infer<typeof ExtractPromotionDetailsOutputSchema>;


export async function extractPromotionDetails(input: ExtractPromotionDetailsInput): Promise<ExtractPromotionDetailsOutput> {
    return extractPromotionDetailsFlow(input);
}


const prompt = ai.definePrompt({
    name: 'extractPromotionDetailsPrompt',
    input: {schema: ExtractPromotionDetailsInputSchema},
    output: {schema: ExtractPromotionDetailsOutputSchema},
    prompt: `You are an expert at extracting information from images of supermarket promotions.
    
    Analyze the provided image and extract the following details:
    - The name of the product being promoted.
    - The price of the product.
    - The name of the supermarket, if it's visible in the image.
    
    Image: {{media url=photoDataUri}}
    
    Return the information in the specified JSON format. The price should be a number.`,
});


const extractPromotionDetailsFlow = ai.defineFlow(
    {
        name: 'extractPromotionDetailsFlow',
        inputSchema: ExtractPromotionDetailsInputSchema,
        outputSchema: ExtractPromotionDetailsOutputSchema,
    },
    async (input) => {
        const {output} = await prompt(input);
        return output!;
    }
);

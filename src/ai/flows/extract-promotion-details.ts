'use server';

/**
 * @fileOverview A flow that extracts promotion details from an image.
 *
 * - extractPromotionDetails - A function that handles the promotion extraction process.
 * - ExtractPromotionDetailsInput - The input type for the extractPromotionDetails function.
 * - ExtractPromotionDetailsOutput - The return type for the extractPromotionDetails function.
 */

import {ai} from '@/ai/init';
import {z} from 'genkit';

const ExtractPromotionDetailsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a promotion, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractPromotionDetailsInput = z.infer<typeof ExtractPromotionDetailsInputSchema>;

const PromotionItemSchema = z.object({
  productName: z.string().describe('The full name of a product on promotion, including brand and weight/volume if available.'),
  price: z.number().describe('The price of the product.'),
});

const ExtractPromotionDetailsOutputSchema = z.object({
  store: z.string().optional().describe('The name of the supermarket, if visible.'),
  promotions: z.array(PromotionItemSchema).describe('A list of all promotions found in the image.'),
});
export type ExtractPromotionDetailsOutput = z.infer<typeof ExtractPromotionDetailsOutputSchema>;


export async function extractPromotionDetails(input: ExtractPromotionDetailsInput): Promise<ExtractPromotionDetailsOutput> {
    return extractPromotionDetailsFlow(input);
}


const prompt = ai.definePrompt({
    name: 'extractPromotionDetailsPrompt',
    input: {schema: ExtractPromotionDetailsInputSchema},
    output: {schema: ExtractPromotionDetailsOutputSchema},
    prompt: `You are an expert at extracting information from images of supermarket promotions flyers.
    
    Analyze the provided image and extract all the promotions you can find. For each promotion, identify:
    - The full name of the product being promoted (e.g., "Leite Condensado Moça 395g").
    - The price of the product.
    - Also, identify the name of the supermarket if it's visible in the image.
    
    Image: {{media url=photoDataUri}}
    
    Return the information in the specified JSON format. The price must be a number. Return an array of all promotions found.`,
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

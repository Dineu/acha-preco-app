import { z } from 'zod';

export type Item = {
  id: string;
  name: string;
  quantity: number;
  checked: boolean;
  price?: number;
  store?: string;
};

export type ShoppingList = {
  id: string;
  name: string;
  items: Item[];
  createdAt: string;
  updatedAt: string;
};

// Market type is now derived in the map page, so we can remove it from here.


// Schema for a single item in a promotion, shared between client and server.
export const PromotionItemSchema = z.object({
  productName: z.string().describe('The full name of a product on promotion, including brand and weight/volume if available.'),
  price: z.number().describe('The price of the product.'),
});

// Type for a single item in a promotion.
export type PromotionItem = z.infer<typeof PromotionItemSchema>;

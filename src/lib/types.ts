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

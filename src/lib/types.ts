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

export type Market = {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
};

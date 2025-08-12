import type { ShoppingList, Market } from '@/lib/types';

export const mockShoppingLists: ShoppingList[] = [
  {
    id: 'list-1',
    name: 'Compras da Semana',
    items: [
      { id: 'item-1a', name: 'Leite Integral', quantity: 2, checked: false, price: 4.50, store: 'Pão de Açúcar' },
      { id: 'item-1b', name: 'Pão de Forma', quantity: 1, checked: true, price: 6.00, store: 'Sumerbol' },
      { id: 'item-1c', name: 'Café em Pó', quantity: 1, checked: false, price: 12.80, store: 'Carrefour' },
      { id: 'item-1d', name: 'Arroz 5kg', quantity: 1, checked: false },
      { id: 'item-1e', name: 'Feijão Carioca 1kg', quantity: 2, checked: false },
    ],
    createdAt: '2024-05-20T10:00:00Z',
    updatedAt: '2024-05-21T11:30:00Z',
  },
  {
    id: 'list-2',
    name: 'Churrasco do Fim de Semana',
    items: [
      { id: 'item-2a', name: 'Picanha', quantity: 1.5, checked: false },
      { id: 'item-2b', name: 'Linguiça Toscana', quantity: 1, checked: false },
      { id: 'item-2c', name: 'Carvão', quantity: 1, checked: true, price: 15.00, store: 'Sonda' },
      { id: 'item-2d', name: 'Pão de Alho', quantity: 2, checked: false },
    ],
    createdAt: '2024-05-18T15:00:00Z',
    updatedAt: '2024-05-18T15:00:00Z',
  },
  {
    id: 'list-3',
    name: 'Produtos de Limpeza',
    items: [
      { id: 'item-3a', name: 'Detergente', quantity: 3, checked: false },
      { id: 'item-3b', name: 'Sabão em Pó', quantity: 1, checked: false },
      { id: 'item-3c', name: 'Água Sanitária', quantity: 2, checked: false },
    ],
    createdAt: '2024-05-15T09:00:00Z',
    updatedAt: '2024-05-15T09:00:00Z',
  },
];


export const mockMarkets: Market[] = [
    { id: 'market-1', name: 'Carrefour', location: { lat: -23.087, lng: -47.217 } },
    { id: 'market-2', name: 'Pão de Açúcar', location: { lat: -23.089, lng: -47.206 } },
    { id: 'market-3', name: 'Sumerbol', location: { lat: -23.095, lng: -47.218 } },
    { id: 'market-4', name: 'Sonda Supermercados', location: { lat: -23.081, lng: -47.199 } },
    { id: 'market-5', name: 'Tenda Atacado', location: { lat: -23.109, lng: -47.213 } },
    { id: 'market-6', name: 'Pague Menos', location: { lat: -23.107, lng: -47.228 } },
    { id: 'market-7', name: 'Roldão Atacadista', location: { lat: -23.123, lng: -47.211 } },
    { id: 'market-8', name: 'Assaí Atacadista', location: { lat: -23.125, lng: -47.210 } },
];

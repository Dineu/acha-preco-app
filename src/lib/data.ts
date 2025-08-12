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

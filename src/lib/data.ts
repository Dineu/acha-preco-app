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
    { id: 'market-1', name: 'Carrefour', location: { lat: -23.1020, lng: -47.2222 } }, // Av. Filtros Mann, 670
    { id: 'market-2', name: 'Pão de Açúcar', location: { lat: -23.0890, lng: -47.2060 } }, // Av. Pres. Kennedy, 1235
    { id: 'market-3', name: 'Sumerbol', location: { lat: -23.0949, lng: -47.2181 } }, // Av. Pres. Kennedy, 895
    { id: 'market-4', name: 'Sonda Supermercados', location: { lat: -23.0817, lng: -47.1998 } }, // R. dos Indaiás, 1145
    { id: 'market-5', name: 'Tenda Atacado', location: { lat: -23.1095, lng: -47.2136 } }, // Rod. Lix da Cunha, 2800
    { id: 'market-6', name: 'Pague Menos', location: { lat: -23.1068, lng: -47.2285 } }, // Av. Ário Barnabé, 1330
    { id: 'market-7', name: 'Roldão Atacadista', location: { lat: -23.0903, lng: -47.2127 } }, // R. Almirante Tamandaré, 1345
    { id: 'market-8', name: 'Assaí Atacadista', location: { lat: -23.1245, lng: -47.2099 } }, // Av. Visc. de Indaiatuba, 1211
    { id: 'market-9', name: 'Atacadão', location: { lat: -23.0833, lng: -47.1844 } }, // Rod. Eng. Ermênio de Oliveira Penteado (SP-075)
];

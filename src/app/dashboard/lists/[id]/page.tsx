import { mockShoppingLists } from '@/lib/data';
import ShoppingListClientPage from '@/components/shopping-list-client-page';
import { notFound } from 'next/navigation';

export default function ShoppingListPage({ params }: { params: { id: string } }) {
  const list = mockShoppingLists.find((l) => l.id === params.id);

  if (!list) {
    notFound();
  }

  return <ShoppingListClientPage initialList={list} />;
}

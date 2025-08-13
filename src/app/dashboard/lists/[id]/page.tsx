import { mockShoppingLists } from '@/lib/data';
import ShoppingListClientPage from '@/components/shopping-list-client-page';
import { notFound } from 'next/navigation';

// Helper function to fetch the list.
// This ensures data fetching logic is clearly separated.
async function getList(id: string) {
  // In a real app, this would be a database call.
  // The find method is synchronous, so we can wrap it in a resolved promise
  // to ensure the function is always async.
  return Promise.resolve(mockShoppingLists.find((l) => l.id === id));
}

export default async function ShoppingListPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params to access the id property.
  const { id } = await params;

  // Await the data fetching to ensure params are resolved correctly.
  const list = await getList(id);

  if (!list) {
    notFound();
  }

  return <ShoppingListClientPage initialList={list} />;
}

import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import type { ShoppingList } from '@/lib/types';

const COLLECTION_NAME = 'shoppingLists';

function toIsoString(timestamp: Timestamp | string | undefined): string {
  if (!timestamp) return new Date().toISOString();
  if (typeof timestamp === 'string') return timestamp;
  return timestamp.toDate().toISOString();
}

export async function getShoppingListsByUser(userId: string): Promise<ShoppingList[]> {
  const listsRef = collection(db, COLLECTION_NAME);
  const q = query(listsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => {
    const data = d.data() as any;
    return {
      id: d.id,
      name: data.name ?? 'Lista',
      items: Array.isArray(data.items) ? data.items : [],
      createdAt: toIsoString(data.createdAt),
      updatedAt: toIsoString(data.updatedAt),
    } as ShoppingList;
  });
}

export async function createShoppingList(name: string, userId: string): Promise<ShoppingList> {
  const listsRef = collection(db, COLLECTION_NAME);
  const now = serverTimestamp();
  const docRef = await addDoc(listsRef, {
    name,
    userId,
    items: [],
    createdAt: now,
    updatedAt: now,
  });
  return {
    id: docRef.id,
    name,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function updateShoppingList(updatedList: ShoppingList): Promise<void> {
  const listDoc = doc(db, COLLECTION_NAME, updatedList.id);
  await updateDoc(listDoc, {
    name: updatedList.name,
    items: updatedList.items,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteShoppingList(listId: string): Promise<void> {
  const listDoc = doc(db, COLLECTION_NAME, listId);
  await deleteDoc(listDoc);
}


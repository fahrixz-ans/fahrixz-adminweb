import { useState, useEffect, useCallback } from 'react';
import { collection, query, onSnapshot, doc, addDoc, updateDoc, deleteDoc, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Category } from '@/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        } as Category;
      });
      setCategories(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  const addCategory = useCallback(async (category: Omit<Category, 'id' | 'productCount' | 'createdAt' | 'updatedAt'>) => {
    await addDoc(collection(db, 'categories'), {
      ...category,
      productCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }, []);

  const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
    await updateDoc(doc(db, 'categories', id), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'categories', id));
  }, []);

  return { categories, loading, addCategory, updateCategory, deleteCategory };
}

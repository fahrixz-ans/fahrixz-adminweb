import { useState, useEffect, useCallback } from 'react';
import { collection, query, onSnapshot, doc, addDoc, deleteDoc, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ProductKey } from '@/types';

export function useProductKeys() {
  const [keys, setKeys] = useState<ProductKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'product_keys'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          assignedAt: data.assignedAt?.toDate ? data.assignedAt.toDate() : data.assignedAt,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        } as ProductKey;
      });
      setKeys(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  const importKeys = useCallback(async (productId: string, productName: string, variantId: string | undefined, variantName: string | undefined, keyList: string[]) => {
    const batch = keyList.filter(k => k.trim()).map(key =>
      addDoc(collection(db, 'product_keys'), {
        productId,
        productName,
        variantId: variantId || null,
        variantName: variantName || null,
        key: key.trim(),
        status: 'available',
        createdAt: Timestamp.now(),
      })
    );
    await Promise.all(batch);
  }, []);

  const deleteKey = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'product_keys', id));
  }, []);

  return {
    keys,
    loading,
    importKeys,
    deleteKey,
  };
}

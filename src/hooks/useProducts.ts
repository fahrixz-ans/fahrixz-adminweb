import { useState, useEffect, useCallback } from 'react';
import { collection, query, onSnapshot, doc, addDoc, updateDoc, deleteDoc, getDoc, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product, ProductVariant } from '@/types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        } as Product;
      });
      setProducts(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  const addProduct = useCallback(async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'soldCount' | 'rating' | 'reviewCount'>) => {
    const docRef = await addDoc(collection(db, 'products'), {
      ...product,
      soldCount: 0,
      rating: 0,
      reviewCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    await updateDoc(doc(db, 'products', id), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
  }, []);

  const getProduct = useCallback(async (id: string): Promise<Product | null> => {
    const snap = await getDoc(doc(db, 'products', id));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      id: snap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
    } as Product;
  }, []);

  const addVariant = useCallback(async (productId: string, variant: Omit<ProductVariant, 'id'>) => {
    const product = await getProduct(productId);
    if (!product) return;
    const newVariant = { ...variant, id: crypto.randomUUID() };
    await updateDoc(doc(db, 'products', productId), {
      variants: [...product.variants, newVariant],
      updatedAt: Timestamp.now(),
    });
  }, [getProduct]);

  const updateVariant = useCallback(async (productId: string, variantId: string, updates: Partial<ProductVariant>) => {
    const product = await getProduct(productId);
    if (!product) return;
    const updated = product.variants.map(v =>
      v.id === variantId ? { ...v, ...updates } : v
    );
    await updateDoc(doc(db, 'products', productId), {
      variants: updated,
      updatedAt: Timestamp.now(),
    });
  }, [getProduct]);

  const deleteVariant = useCallback(async (productId: string, variantId: string) => {
    const product = await getProduct(productId);
    if (!product) return;
    const updated = product.variants.filter(v => v.id !== variantId);
    await updateDoc(doc(db, 'products', productId), {
      variants: updated,
      updatedAt: Timestamp.now(),
    });
  }, [getProduct]);

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    addVariant,
    updateVariant,
    deleteVariant,
  };
}

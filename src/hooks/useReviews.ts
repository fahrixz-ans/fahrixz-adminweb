import { useState, useEffect, useCallback } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Review } from '@/types';

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        } as Review;
      });
      setReviews(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  const updateStatus = useCallback(async (id: string, status: Review['status']) => {
    await updateDoc(doc(db, 'reviews', id), { status, updatedAt: new Date() });
  }, []);

  const deleteReview = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'reviews', id));
  }, []);

  return { reviews, loading, updateStatus, deleteReview };
}

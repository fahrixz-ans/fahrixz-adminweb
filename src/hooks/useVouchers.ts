import { useState, useEffect, useCallback } from 'react';
import { collection, query, onSnapshot, doc, addDoc, updateDoc, deleteDoc, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Voucher } from '@/types';

export function useVouchers() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'vouchers'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          expiresAt: data.expiresAt?.toDate?.() || data.expiresAt,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        } as Voucher;
      });
      setVouchers(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  const addVoucher = useCallback(async (voucher: Omit<Voucher, 'id' | 'used' | 'createdAt' | 'updatedAt'>) => {
    await addDoc(collection(db, 'vouchers'), {
      ...voucher,
      used: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }, []);

  const updateVoucher = useCallback(async (id: string, updates: Partial<Voucher>) => {
    await updateDoc(doc(db, 'vouchers', id), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }, []);

  const deleteVoucher = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'vouchers', id));
  }, []);

  return { vouchers, loading, addVoucher, updateVoucher, deleteVoucher };
}

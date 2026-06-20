import { useState, useEffect, useCallback } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { WithdrawRequest } from '@/types';

export function useWithdraws() {
  const [withdraws, setWithdraws] = useState<WithdrawRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'withdraw_requests'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          processedAt: data.processedAt?.toDate?.() || data.processedAt,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        } as WithdrawRequest;
      });
      setWithdraws(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  const approveWithdraw = useCallback(async (id: string, adminUid: string) => {
    await updateDoc(doc(db, 'withdraw_requests', id), {
      status: 'approved',
      processedAt: Timestamp.now(),
      processedBy: adminUid,
      updatedAt: Timestamp.now(),
    });
  }, []);

  const rejectWithdraw = useCallback(async (id: string, reason: string, adminUid: string) => {
    await updateDoc(doc(db, 'withdraw_requests', id), {
      status: 'rejected',
      adminNote: reason,
      processedAt: Timestamp.now(),
      processedBy: adminUid,
      updatedAt: Timestamp.now(),
    });
  }, []);

  return {
    withdraws,
    loading,
    approveWithdraw,
    rejectWithdraw,
  };
}

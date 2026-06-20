import { useState, useEffect, useCallback } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, addDoc, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Wallet, Transaction } from '@/types';

export function useWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'wallets'), orderBy('updatedAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        } as Wallet;
      });
      setWallets(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
        } as Transaction;
      });
      setTransactions(items);
    });
    return unsub;
  }, []);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    await addDoc(collection(db, 'transactions'), {
      ...transaction,
      createdAt: Timestamp.now(),
    });
  }, []);

  const adjustBalance = useCallback(async (walletId: string, amount: number, type: string, reason: string, adminId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    if (!wallet) return;

    const newBalance = wallet.balance + amount;
    await updateDoc(doc(db, 'wallets', walletId), {
      balance: newBalance,
      updatedAt: Timestamp.now(),
    });

    await addTransaction({
      userId: wallet.userId,
      userName: wallet.userName,
      type: 'adjust',
      amount,
      balanceBefore: wallet.balance,
      balanceAfter: newBalance,
      description: reason,
      status: 'success',
      metadata: { adminNote: reason, adminId, adjustType: type },
    });
  }, [wallets, addTransaction]);

  return {
    wallets,
    transactions,
    loading,
    adjustBalance,
  };
}

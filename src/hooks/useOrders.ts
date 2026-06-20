import { useState, useEffect, useCallback } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order, OrderStatus, OrderTimelineItem } from '@/types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate ? (data.createdAt.toDate as any)() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? (data.updatedAt.toDate as any)() : data.updatedAt,
          paidAt: data.paidAt?.toDate ? (data.paidAt.toDate as any)() : data.paidAt,
          deliveredAt: data.deliveredAt?.toDate ? (data.deliveredAt.toDate as any)() : data.deliveredAt,
          timeline: (data.timeline || []).map((t: OrderTimelineItem) => ({
            ...t,
            timestamp: (t.timestamp as any)?.toDate ? (t.timestamp as any).toDate() : t.timestamp,
          })),
        } as Order;
      });
      setOrders(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  const updateStatus = useCallback(async (orderId: string, newStatus: OrderStatus, note?: string) => {
    const orderRef = doc(db, 'orders', orderId);
    const timelineItem: OrderTimelineItem = {
      status: newStatus,
      timestamp: new Date(),
      updatedBy: 'admin',
      note,
    };

    const updates: any = {
      status: newStatus,
      updatedAt: Timestamp.now(),
    };

    if (newStatus === 'completed') {
      updates.deliveredAt = Timestamp.now();
    }
    if (newStatus === 'paid') {
      updates.paidAt = Timestamp.now();
      updates.paymentStatus = 'paid';
    }

    const currentOrder = orders.find(o => o.id === orderId);
    if (currentOrder) {
      updates.timeline = [...(currentOrder.timeline || []), timelineItem];
    }

    await updateDoc(orderRef, updates);
  }, [orders]);

  const assignProductKey = useCallback(async (orderId: string, key: string) => {
    await updateDoc(doc(db, 'orders', orderId), {
      productKey: key,
      updatedAt: Timestamp.now(),
    });
  }, []);

  return {
    orders,
    loading,
    updateStatus,
    assignProductKey,
  };
}

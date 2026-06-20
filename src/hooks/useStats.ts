import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { DashboardStats, ChartDataPoint, OrderStatusChartData, CategorySalesData } from '@/types';
import { format, subDays, startOfDay } from 'date-fns';

export function useStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalRevenueChange: 0,
    totalOrders: 0,
    totalOrdersChange: 0,
    totalCustomers: 0,
    totalCustomersChange: 0,
    totalProducts: 0,
    totalProductsChange: 0,
    activeMissions: 0,
    activeMissionsChange: 0,
    pendingWithdraws: 0,
    pendingWithdrawsChange: 0,
  });
  const [loading, setLoading] = useState(true);

  const [revenueChart, setRevenueChart] = useState<ChartDataPoint[]>([]);
  const [ordersChart, setOrdersChart] = useState<OrderStatusChartData[]>([]);
  const [salesByCategory, setSalesByCategory] = useState<CategorySalesData[]>([]);
  const [daysRange, setDaysRange] = useState(7);

  useEffect(() => {
    setLoading(true);
    const today = startOfDay(new Date());
    const prevPeriodStart = subDays(today, daysRange * 2);
    const currentPeriodStart = subDays(today, daysRange);

    // Stats listeners
    const ordersQuery = query(collection(db, 'orders'));
    const usersQuery = query(collection(db, 'users'), where('isAdmin', '==', false));
    const productsQuery = query(collection(db, 'products'));
    const missionsQuery = query(collection(db, 'missions'), where('status', '==', 'active'));
    const withdrawsQuery = query(collection(db, 'withdraw_requests'), where('status', '==', 'pending'));

    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      const orders = snapshot.docs.map(d => d.data());
      
      // Current period
      const currentOrders = orders.filter(o => {
        const d = o.createdAt?.toDate?.() || new Date(o.createdAt);
        return d >= currentPeriodStart;
      });
      const prevOrders = orders.filter(o => {
        const d = o.createdAt?.toDate?.() || new Date(o.createdAt);
        return d >= prevPeriodStart && d < currentPeriodStart;
      });

      const currentRevenue = currentOrders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const prevRevenue = prevOrders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      const revenueChange = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;
      const orderChange = prevOrders.length > 0 ? ((currentOrders.length - prevOrders.length) / prevOrders.length) * 100 : 0;

      setStats(prev => ({
        ...prev,
        totalOrders: orders.length,
        totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.totalAmount || 0), 0),
        totalOrdersChange: Math.round(orderChange),
        totalRevenueChange: Math.round(revenueChange),
      }));

      // Order status chart
      const statusCounts: Record<string, number> = {};
      orders.forEach(o => {
        statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
      });
      const statusColors: Record<string, string> = {
        pending: '#F59E0B',
        paid: '#3B82F6',
        processing: '#7C3AED',
        completed: '#10B981',
        cancelled: '#EF4444',
        refunded: '#6B7280',
      };
      setOrdersChart(
        Object.entries(statusCounts).map(([status, count]) => ({
          status: status.charAt(0).toUpperCase() + status.slice(1),
          count,
          color: statusColors[status] || '#6B7280',
        }))
      );
    });

    const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
      const count = snapshot.size;
      setStats(prev => ({ ...prev, totalCustomers: count }));
    });

    const unsubProducts = onSnapshot(productsQuery, (snapshot) => {
      setStats(prev => ({ ...prev, totalProducts: snapshot.size }));
    });

    const unsubMissions = onSnapshot(missionsQuery, (snapshot) => {
      setStats(prev => ({ ...prev, activeMissions: snapshot.size }));
    });

    const unsubWithdraws = onSnapshot(withdrawsQuery, (snapshot) => {
      setStats(prev => ({ ...prev, pendingWithdraws: snapshot.size }));
    });

    // Revenue chart
    const fetchRevenueChart = async () => {
      const chartData: ChartDataPoint[] = [];
      for (let i = daysRange - 1; i >= 0; i--) {
        const date = subDays(today, i);
        const nextDate = subDays(date, -1);
        const dayQuery = query(
          collection(db, 'orders'),
          where('status', '==', 'completed'),
          where('createdAt', '>=', Timestamp.fromDate(date)),
          where('createdAt', '<', Timestamp.fromDate(nextDate))
        );
        const daySnap = await getDocs(dayQuery);
        const revenue = daySnap.docs.reduce((sum, d) => sum + (d.data().totalAmount || 0), 0);
        chartData.push({
          date: format(date, 'dd MMM'),
          value: revenue,
        });
      }
      setRevenueChart(chartData);
    };

    // Sales by category
    const fetchCategorySales = async () => {
      const productsSnap = await getDocs(collection(db, 'products'));
      const categoryMap: Record<string, number> = {};
      productsSnap.docs.forEach(d => {
        const data = d.data();
        const cat = data.categoryName || 'Uncategorized';
        categoryMap[cat] = (categoryMap[cat] || 0) + (data.soldCount || 0);
      });
      const total = Object.values(categoryMap).reduce((s, v) => s + v, 0) || 1;
      setSalesByCategory(
        Object.entries(categoryMap).map(([category, sales]) => ({
          category,
          sales,
          percentage: Math.round((sales / total) * 100),
        })).sort((a, b) => b.sales - a.sales).slice(0, 8)
      );
    };

    fetchRevenueChart();
    fetchCategorySales();
    setLoading(false);

    return () => {
      unsubOrders();
      unsubUsers();
      unsubProducts();
      unsubMissions();
      unsubWithdraws();
    };
  }, [daysRange]);

  return { stats, loading, revenueChart, ordersChart, salesByCategory, daysRange, setDaysRange };
}

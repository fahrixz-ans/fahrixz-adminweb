import { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Wallet,
  ShoppingCart,
  Users,
  Package,
  Target,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import type { DashboardStats } from '@/types';

interface StatsCardsProps {
  stats: DashboardStats;
  loading: boolean;
}

interface StatItem {
  key: keyof DashboardStats;
  label: string;
  icon: React.ElementType;
  gradient: string;
  format?: (val: number) => string;
  changeKey: keyof DashboardStats;
}

const statItems: StatItem[] = [
  {
    key: 'totalRevenue',
    label: 'Total Pendapatan',
    icon: Wallet,
    gradient: 'from-emerald-500 to-teal-400',
    format: (val) => `Rp ${val.toLocaleString('id-ID')}`,
    changeKey: 'totalRevenueChange',
  },
  {
    key: 'totalOrders',
    label: 'Total Order',
    icon: ShoppingCart,
    gradient: 'from-blue-500 to-cyan-400',
    changeKey: 'totalOrdersChange',
  },
  {
    key: 'totalCustomers',
    label: 'Total Customer',
    icon: Users,
    gradient: 'from-purple-500 to-violet-400',
    changeKey: 'totalCustomersChange',
  },
  {
    key: 'totalProducts',
    label: 'Total Produk',
    icon: Package,
    gradient: 'from-orange-500 to-amber-400',
    changeKey: 'totalProductsChange',
  },
  {
    key: 'activeMissions',
    label: 'Misi Aktif',
    icon: Target,
    gradient: 'from-yellow-500 to-amber-400',
    changeKey: 'activeMissionsChange',
  },
  {
    key: 'pendingWithdraws',
    label: 'Withdraw Pending',
    icon: DollarSign,
    gradient: 'from-red-500 to-rose-400',
    changeKey: 'pendingWithdrawsChange',
  },
];

function AnimatedValue({ value, format }: { value: number; format?: (val: number) => string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) {
      setDisplay(value);
      return;
    }
    hasAnimated.current = true;
    const duration = 1000;
    const start = 0;
    const end = value;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * easeProgress);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span ref={ref}>{format ? format(display) : display.toLocaleString('id-ID')}</span>;
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-5 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statItems.map((item) => {
        const value = stats[item.key] as number;
        const change = stats[item.changeKey] as number;
        const isPositive = change >= 0;
        const Icon = item.icon;

        return (
          <Card
            key={item.key}
            className="group cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    <AnimatedValue value={value} format={item.format} />
                  </p>
                  <div className="flex items-center gap-1">
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}{change}%
                    </span>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

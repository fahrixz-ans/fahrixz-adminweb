import { cn } from '@/lib/utils';

type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'default' | 'pending';

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
  pulse?: boolean;
}

const statusMap: Record<string, StatusVariant> = {
  active: 'success',
  inactive: 'default',
  completed: 'success',
  paid: 'info',
  pending: 'warning',
  processing: 'info',
  cancelled: 'danger',
  refunded: 'default',
  approved: 'success',
  rejected: 'danger',
  blocked: 'danger',
  available: 'success',
  sold: 'info',
  used: 'default',
  hidden: 'warning',
  expired: 'danger',
  success: 'success',
  failed: 'danger',
  true: 'success',
  false: 'default',
};

const variantClasses: Record<StatusVariant, string> = {
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
  pending: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export default function StatusBadge({ status, variant, className, pulse = false }: StatusBadgeProps) {
  const normalizedStatus = status?.toString().toLowerCase() || '';
  const detectedVariant = variant || statusMap[normalizedStatus] || 'default';

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
        variantClasses[detectedVariant],
        pulse && (detectedVariant === 'warning' || detectedVariant === 'pending') && 'animate-pulse',
        className
      )}
    >
      {status}
    </span>
  );
}

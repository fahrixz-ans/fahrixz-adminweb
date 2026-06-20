import { useState } from 'react';
import { useWallets } from '@/hooks/useWallets';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Transactions() {
  const { transactions, loading } = useWallets();
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = typeFilter === 'all' ? transactions : transactions.filter(t => t.type === typeFilter);

  const typeLabels: Record<string, string> = { reward: 'Reward', withdraw: 'Withdraw', adjust: 'Adjust', coin_exchange: 'Tukar Koin', purchase: 'Pembelian' };

  return (
    <div className="space-y-6">
      <PageHeader title="Transaksi" description="Riwayat transaksi saldo semua user" />

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Tipe Transaksi" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              {Object.entries(typeLabels).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <DataTable
        columns={[
          { key: 'id', header: 'ID', cell: (t) => <span className="text-xs font-mono text-gray-500">{t.id.slice(0, 8)}...</span> },
          { key: 'user', header: 'User', cell: (t) => <div><p className="text-sm font-medium">{t.userName}</p></div> },
          { key: 'type', header: 'Tipe', cell: (t) => <span className="text-sm">{typeLabels[t.type] || t.type}</span> },
          {
            key: 'amount', header: 'Jumlah',
            cell: (t) => (
              <span className={`text-sm font-medium flex items-center gap-1 ${t.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {t.amount >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {t.amount >= 0 ? '+' : ''}Rp {Math.abs(t.amount).toLocaleString('id-ID')}
              </span>
            ),
          },
          { key: 'description', header: 'Deskripsi', cell: (t) => <p className="text-sm text-gray-600 max-w-xs truncate">{t.description}</p> },
          { key: 'status', header: 'Status', cell: (t) => <StatusBadge status={t.status} /> },
          { key: 'date', header: 'Tanggal', cell: (t) => <span className="text-sm text-gray-500">{t.createdAt ? format(new Date(t.createdAt), 'dd MMM yyyy HH:mm') : '-'}</span> },
        ]}
        data={filtered}
        loading={loading}
      />
    </div>
  );
}

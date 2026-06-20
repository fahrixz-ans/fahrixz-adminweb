import { useState } from 'react';
import { useWallets } from '@/hooks/useWallets';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import type { Wallet as WalletType } from '@/types';

export default function Wallets() {
  const { wallets, loading, adjustBalance } = useWallets();
  const [search, setSearch] = useState('');
  const [adjustWallet, setAdjustWallet] = useState<WalletType | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustType, setAdjustType] = useState('bonus');
  const [adjustReason, setAdjustReason] = useState('');

  const totalBalance = wallets.reduce((s, w) => s + (w.balance || 0), 0);
  const totalWithdrawn = wallets.reduce((s, w) => s + (w.totalWithdraw || 0), 0);
  const totalRewarded = wallets.reduce((s, w) => s + (w.totalReward || 0), 0);

  const filtered = wallets.filter(w => {
    if (!search) return true;
    const s = search.toLowerCase();
    return w.userName?.toLowerCase().includes(s) || w.userEmail?.toLowerCase().includes(s);
  });

  const handleAdjust = async () => {
    if (!adjustWallet || !adjustAmount || !adjustReason) return;
    await adjustBalance(adjustWallet.id, Number(adjustAmount), adjustType, adjustReason, 'admin');
    setAdjustWallet(null);
    setAdjustAmount('');
    setAdjustReason('');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Wallets" description="Monitor dan adjust saldo user" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-gray-800"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"><Wallet className="w-5 h-5 text-emerald-600" /></div><div><p className="text-xs text-gray-500">Total Saldo</p><p className="text-xl font-bold">Rp {totalBalance.toLocaleString('id-ID')}</p></div></CardContent></Card>
        <Card className="bg-white dark:bg-gray-800"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-blue-600" /></div><div><p className="text-xs text-gray-500">Total Reward</p><p className="text-xl font-bold">Rp {totalRewarded.toLocaleString('id-ID')}</p></div></CardContent></Card>
        <Card className="bg-white dark:bg-gray-800"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center"><TrendingDown className="w-5 h-5 text-red-600" /></div><div><p className="text-xs text-gray-500">Total Withdraw</p><p className="text-xl font-bold">Rp {totalWithdrawn.toLocaleString('id-ID')}</p></div></CardContent></Card>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-4">
          <Input placeholder="Cari user..." value={search} onChange={e => setSearch(e.target.value)} className="w-full sm:w-80" />
        </CardContent>
      </Card>

      <DataTable
        columns={[
          { key: 'user', header: 'User', cell: (w) => <div><p className="text-sm font-medium">{w.userName}</p><p className="text-xs text-gray-500">{w.userEmail}</p></div> },
          { key: 'balance', header: 'Saldo', cell: (w) => <span className="text-sm font-bold">Rp {(w.balance || 0).toLocaleString('id-ID')}</span> },
          { key: 'coins', header: 'Koin', cell: (w) => <span className="text-sm text-purple-600">{(w.coins || 0).toLocaleString('id-ID')}</span> },
          { key: 'reward', header: 'Total Reward', cell: (w) => <span className="text-sm">Rp {(w.totalReward || 0).toLocaleString('id-ID')}</span> },
          { key: 'withdrawn', header: 'Total Withdraw', cell: (w) => <span className="text-sm">Rp {(w.totalWithdraw || 0).toLocaleString('id-ID')}</span> },
          { key: 'spent', header: 'Total Belanja', cell: (w) => <span className="text-sm">Rp {(w.totalSpent || 0).toLocaleString('id-ID')}</span> },
          { key: 'status', header: 'Status', cell: (w) => <StatusBadge status={w.status} /> },
          {
            key: 'actions', header: '', className: 'w-32',
            cell: (w) => (
              <Button variant="outline" size="sm" className="h-8" onClick={() => setAdjustWallet(w)}>
                <DollarSign className="w-3 h-3 mr-1" /> Adjust
              </Button>
            ),
          },
        ]}
        data={filtered}
        loading={loading}
        searchable={false}
      />

      {/* Adjust Dialog */}
      <Dialog open={!!adjustWallet} onOpenChange={() => setAdjustWallet(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Adjust Saldo - {adjustWallet?.userName}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-center">
              <p className="text-xs text-gray-500">Saldo Saat Ini</p>
              <p className="text-2xl font-bold">Rp {(adjustWallet?.balance || 0).toLocaleString('id-ID')}</p>
            </div>
            <div className="space-y-2">
              <Label>Jumlah (+ untuk tambah, - untuk kurangi) *</Label>
              <Input type="number" value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)} placeholder="50000" />
            </div>
            <div className="space-y-2">
              <Label>Tipe *</Label>
              <Select value={adjustType} onValueChange={setAdjustType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="reward">Reward</SelectItem>
                  <SelectItem value="compensation">Kompensasi</SelectItem>
                  <SelectItem value="penalty">Penalty</SelectItem>
                  <SelectItem value="correction">Koreksi</SelectItem>
                  <SelectItem value="bonus">Bonus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Alasan *</Label>
              <Textarea value={adjustReason} onChange={e => setAdjustReason(e.target.value)} placeholder="Alasan adjust saldo..." />
            </div>
            <Button onClick={handleAdjust} className="w-full bg-gradient-to-r from-purple-600 to-blue-500" disabled={!adjustAmount || !adjustReason}>
              Adjust Saldo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

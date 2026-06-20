import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Eye, Wallet, ShoppingBag, Target } from 'lucide-react';
import type { UserProfile } from '@/types';

export default function Users() {
  const { users, loading, updateUserStatus } = useUsers();
  const [search, setSearch] = useState('');
  const [detailUser, setDetailUser] = useState<UserProfile | null>(null);
  const [blockConfirm, setBlockConfirm] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return u.displayName?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s) || u.phone?.includes(s);
  });

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Data customer terdaftar" />

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-4">
          <Input placeholder="Cari nama, email, atau nomor HP..." value={search} onChange={e => setSearch(e.target.value)} className="w-full sm:w-80" />
        </CardContent>
      </Card>

      <DataTable
        columns={[
          {
            key: 'avatar', header: '', className: 'w-12',
            cell: (u) => (
              <Avatar className="w-9 h-9">
                {u.photoURL ? <img src={u.photoURL} alt="" className="w-full h-full object-cover rounded-full" /> : <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs">{getInitials(u.displayName)}</AvatarFallback>}
              </Avatar>
            ),
          },
          { key: 'name', header: 'Nama', cell: (u) => <span className="font-medium text-gray-900 dark:text-white">{u.displayName || '-'}</span> },
          { key: 'email', header: 'Email', cell: (u) => <span className="text-sm text-gray-500">{u.email}</span> },
          { key: 'phone', header: 'Telepon', cell: (u) => <span className="text-sm text-gray-500">{u.phone || '-'}</span> },
          { key: 'orders', header: 'Order', cell: (u) => <span className="text-sm">{u.totalOrders || 0}</span> },
          { key: 'spent', header: 'Total Belanja', cell: (u) => <span className="text-sm font-medium">Rp {(u.totalSpent || 0).toLocaleString('id-ID')}</span> },
          { key: 'wallet', header: 'Saldo', cell: (u) => <span className="text-sm font-medium">Rp {(u.walletBalance || 0).toLocaleString('id-ID')}</span> },
          { key: 'coins', header: 'Koin', cell: (u) => <span className="text-sm">{u.coins || 0}</span> },
          { key: 'status', header: 'Status', cell: (u) => <StatusBadge status={u.status} /> },
          {
            key: 'actions', header: '', className: 'w-16',
            cell: (u) => (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetailUser(u)}><Eye className="w-4 h-4" /></Button>
            ),
          },
        ]}
        data={filtered}
        loading={loading}
        searchable={false}
      />

      {/* Detail Dialog */}
      <Dialog open={!!detailUser} onOpenChange={() => setDetailUser(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Detail Customer</DialogTitle></DialogHeader>
          {detailUser && (
            <div className="py-4">
              <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Profil</TabsTrigger>
                  <TabsTrigger value="wallet">Wallet</TabsTrigger>
                  <TabsTrigger value="activity">Aktivitas</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4 mt-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      {detailUser.photoURL ? <img src={detailUser.photoURL} alt="" className="rounded-full" /> : <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-lg">{getInitials(detailUser.displayName)}</AvatarFallback>}
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{detailUser.displayName || '-'}</h3>
                      <p className="text-sm text-gray-500">{detailUser.email}</p>
                      <p className="text-xs text-gray-400">ID: {detailUser.uid}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label className="text-xs text-gray-500">Telepon</Label><p className="text-sm">{detailUser.phone || '-'}</p></div>
                    <div className="space-y-1"><Label className="text-xs text-gray-500">Alamat</Label><p className="text-sm">{detailUser.address || '-'}</p></div>
                    <div className="space-y-1"><Label className="text-xs text-gray-500">Bergabung</Label><p className="text-sm">{detailUser.createdAt ? format(new Date(detailUser.createdAt), 'dd MMMM yyyy') : '-'}</p></div>
                    <div className="space-y-1"><Label className="text-xs text-gray-500">Status</Label><StatusBadge status={detailUser.status} /></div>
                  </div>
                  {detailUser.status !== 'blocked' && (
                    <Button variant="destructive" size="sm" onClick={() => setBlockConfirm(detailUser.id)}>Blokir Akun</Button>
                  )}
                </TabsContent>

                <TabsContent value="wallet" className="mt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card><CardContent className="p-4 text-center"><Wallet className="w-6 h-6 mx-auto mb-2 text-blue-500" /><p className="text-xs text-gray-500">Saldo</p><p className="text-lg font-bold">Rp {(detailUser.walletBalance || 0).toLocaleString('id-ID')}</p></CardContent></Card>
                    <Card><CardContent className="p-4 text-center"><Target className="w-6 h-6 mx-auto mb-2 text-purple-500" /><p className="text-xs text-gray-500">Koin</p><p className="text-lg font-bold">{detailUser.coins || 0}</p></CardContent></Card>
                    <Card><CardContent className="p-4 text-center"><ShoppingBag className="w-6 h-6 mx-auto mb-2 text-emerald-500" /><p className="text-xs text-gray-500">Total Belanja</p><p className="text-lg font-bold">Rp {(detailUser.totalSpent || 0).toLocaleString('id-ID')}</p></CardContent></Card>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="mt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <div><p className="text-sm font-medium">Total Order</p><p className="text-xs text-gray-500">Jumlah pesanan</p></div>
                      <span className="text-lg font-bold">{detailUser.totalOrders || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <div><p className="text-sm font-medium">Total Belanja</p><p className="text-xs text-gray-500">Akumulasi belanja</p></div>
                      <span className="text-lg font-bold">Rp {(detailUser.totalSpent || 0).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Block Confirm */}
      <ConfirmDialog
        open={!!blockConfirm}
        onClose={() => setBlockConfirm(null)}
        onConfirm={() => { if (blockConfirm) { updateUserStatus(blockConfirm, 'blocked'); setBlockConfirm(null); setDetailUser(null); } }}
        title="Blokir Akun"
        description="Apakah Anda yakin ingin memblokir akun ini? User tidak akan bisa login."
      />
    </div>
  );
}

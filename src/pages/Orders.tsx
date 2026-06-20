import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
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
import { format } from 'date-fns';
import { Eye, FileText } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';

const statusOptions: OrderStatus[] = ['pending', 'paid', 'processing', 'completed', 'cancelled', 'refunded'];

export default function Orders() {
  const { orders, loading, updateStatus } = useOrders();
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  const [statusNote, setStatusNote] = useState('');
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState<Order | null>(null);

  const filtered = orders.filter((o: any) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        o.orderId?.toLowerCase().includes(s) ||
        o.userName?.toLowerCase().includes(s) ||
        o.userEmail?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const openStatusUpdate = (order: Order) => {
    setUpdatingOrder(order);
    setNewStatus(order.status);
    setStatusNote('');
    setShowStatusUpdate(true);
  };

  const handleStatusUpdate = async () => {
    if (!updatingOrder) return;
    await updateStatus(updatingOrder.id, newStatus, statusNote);
    setShowStatusUpdate(false);
    setUpdatingOrder(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="Kelola pesanan customer" />

      {/* Filters */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-4 flex flex-wrap gap-3">
          <Input placeholder="Cari order ID, nama, email..." value={search} onChange={e => setSearch(e.target.value)} className="w-full sm:w-72" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {statusOptions.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <DataTable
        columns={[
          { key: 'orderId', header: 'Order ID', cell: (o: any) => <span className="font-mono text-sm text-purple-600">{o.orderId}</span> },
          { key: 'customer', header: 'Customer', cell: (o: any) => <div><p className="font-medium text-sm">{o.userName}</p><p className="text-xs text-gray-500">{o.userEmail}</p></div> },
          { key: 'product', header: 'Produk', cell: (o: any) => <span className="text-sm text-gray-600">{o.items?.[0]?.productName || '-'}</span> },
          { key: 'total', header: 'Total', cell: (o: any) => <span className="font-medium">Rp {o.totalAmount?.toLocaleString('id-ID')}</span> },
          { key: 'status', header: 'Status', cell: (o: any) => <StatusBadge status={o.status} pulse={o.status === 'pending' || o.status === 'processing'} /> },
          { key: 'payment', header: 'Pembayaran', cell: (o: any) => <span className="text-sm text-gray-500">{o.paymentMethod || '-'}</span> },
          { key: 'date', header: 'Tanggal', cell: (o: any) => <span className="text-sm text-gray-500">{o.createdAt ? format(new Date(o.createdAt), 'dd MMM yyyy HH:mm') : '-'}</span> },
          {
            key: 'actions', header: '', className: 'w-28',
            cell: (o: any) => (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetailOrder(o)}><Eye className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openStatusUpdate(o)}><FileText className="w-4 h-4" /></Button>
              </div>
            ),
          },
        ]}
        data={filtered}
        loading={loading}
        searchable={false}
      />

      {/* Detail Dialog */}
      <Dialog open={!!detailOrder} onOpenChange={() => setDetailOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Detail Order {detailOrder?.orderId}</DialogTitle></DialogHeader>
          {detailOrder && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Status</Label>
                  <StatusBadge status={detailOrder.status} pulse={detailOrder.status === 'pending' || detailOrder.status === 'processing'} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Metode Pembayaran</Label>
                  <p className="text-sm font-medium">{detailOrder.paymentMethod || '-'}</p>
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm">Customer Info</h4>
                <p className="text-sm"><span className="text-gray-500">Nama:</span> {detailOrder.userName}</p>
                <p className="text-sm"><span className="text-gray-500">Email:</span> {detailOrder.userEmail}</p>
                <p className="text-sm"><span className="text-gray-500">Telepon:</span> {detailOrder.userPhone || '-'}</p>
              </div>

              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm">Produk</h4>
                {detailOrder.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs overflow-hidden">
                        {item.productImage ? <img src={item.productImage} alt="" className="w-full h-full object-cover" /> : 'IMG'}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.productName}</p>
                        {item.variantName && <p className="text-xs text-gray-500">{item.variantName}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Rp {item.subtotal?.toLocaleString('id-ID')}</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm">Ringkasan</h4>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>Rp {detailOrder.subtotal?.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Diskon</span><span>Rp {detailOrder.discount?.toLocaleString('id-ID') || 0}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Biaya Layanan</span><span>Rp {detailOrder.serviceFee?.toLocaleString('id-ID') || 0}</span></div>
                <div className="flex justify-between text-base font-bold border-t pt-2"><span>Total</span><span>Rp {detailOrder.totalAmount?.toLocaleString('id-ID')}</span></div>
              </div>

              {detailOrder.productKey && (
                <div className="border rounded-lg p-4 space-y-2 bg-emerald-50 dark:bg-emerald-900/20">
                  <h4 className="font-medium text-sm text-emerald-700">Product Key</h4>
                  <p className="text-sm font-mono bg-white dark:bg-gray-800 p-2 rounded">{detailOrder.productKey}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={showStatusUpdate} onOpenChange={() => setShowStatusUpdate(false)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Update Status Order</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Status Baru</Label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as OrderStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statusOptions.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Catatan (opsional)</Label>
              <Textarea value={statusNote} onChange={e => setStatusNote(e.target.value)} placeholder="Catatan internal..." />
            </div>
            <Button onClick={handleStatusUpdate} className="w-full bg-gradient-to-r from-purple-600 to-blue-500">Update Status</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

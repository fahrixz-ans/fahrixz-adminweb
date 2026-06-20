import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Eye, Send, Download } from 'lucide-react';
import { format } from 'date-fns';

interface MockInvoice {
  id: string;
  type: 'purchase' | 'withdraw';
  orderId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: 'sent' | 'resent' | 'failed';
  sentAt: Date;
  createdAt: Date;
}

const mockInvoices: MockInvoice[] = [
  { id: '1', type: 'purchase', orderId: 'INV-20250120-001', customerName: 'Ahmad Fauzi', customerEmail: 'ahmad@email.com', amount: 150000, status: 'sent', sentAt: new Date('2025-01-20'), createdAt: new Date('2025-01-20') },
  { id: '2', type: 'purchase', orderId: 'INV-20250119-002', customerName: 'Budi Santoso', customerEmail: 'budi@email.com', amount: 275000, status: 'sent', sentAt: new Date('2025-01-19'), createdAt: new Date('2025-01-19') },
  { id: '3', type: 'withdraw', orderId: 'WD-20250118-001', customerName: 'Citra Dewi', customerEmail: 'citra@email.com', amount: 50000, status: 'resent', sentAt: new Date('2025-01-18'), createdAt: new Date('2025-01-18') },
  { id: '4', type: 'purchase', orderId: 'INV-20250117-003', customerName: 'Dedi Pratama', customerEmail: 'dedi@email.com', amount: 89000, status: 'failed', sentAt: new Date('2025-01-17'), createdAt: new Date('2025-01-17') },
  { id: '5', type: 'purchase', orderId: 'INV-20250116-004', customerName: 'Eka Sari', customerEmail: 'eka@email.com', amount: 420000, status: 'sent', sentAt: new Date('2025-01-16'), createdAt: new Date('2025-01-16') },
];

export default function Invoices() {
  const [invoices] = useState<MockInvoice[]>(mockInvoices);

  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" description="Lihat dan kirim ulang invoice" />

      <DataTable
        columns={[
          { key: 'type', header: 'Tipe', cell: (i) => <StatusBadge status={i.type === 'purchase' ? 'Purchase' : 'Withdraw'} variant={i.type === 'purchase' ? 'info' : 'warning'} /> },
          { key: 'orderId', header: 'ID', cell: (i) => <span className="text-sm font-mono">{i.orderId}</span> },
          { key: 'customer', header: 'Customer', cell: (i) => <div><p className="text-sm font-medium">{i.customerName}</p><p className="text-xs text-gray-500">{i.customerEmail}</p></div> },
          { key: 'amount', header: 'Jumlah', cell: (i) => <span className="text-sm font-medium">Rp {i.amount.toLocaleString('id-ID')}</span> },
          { key: 'date', header: 'Tanggal', cell: (i) => <span className="text-sm text-gray-500">{format(i.sentAt, 'dd MMM yyyy')}</span> },
          { key: 'status', header: 'Status', cell: (i) => <StatusBadge status={i.status} /> },
          {
            key: 'actions', header: '', className: 'w-28',
            cell: (_i: any) => (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Send className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="w-4 h-4" /></Button>
              </div>
            ),
          },
        ]}
        data={invoices}
        loading={false}
      />
    </div>
  );
}

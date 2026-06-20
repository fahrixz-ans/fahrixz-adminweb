import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Store, Mail, Phone, MapPin, FileText, Save } from 'lucide-react';

export default function Settings() {
  const [maintenance, setMaintenance] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState('Situs sedang dalam maintenance. Silakan kembali lagi nanti.');
  const [storeName, setStoreName] = useState('Fahri Xz Store');
  const [storeEmail, setStoreEmail] = useState('support@fahrixz.store');
  const [storePhone, setStorePhone] = useState('0812-3456-7890');
  const [storeAddress, setStoreAddress] = useState('Jakarta, Indonesia');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Pengaturan toko dan sistem" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Mode */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-5 h-5 text-amber-500" />
              Maintenance Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div>
                <p className="font-medium">Mode Maintenance</p>
                <p className="text-sm text-gray-500">Nonaktifkan akses publik ke web user</p>
              </div>
              <Switch checked={maintenance} onCheckedChange={setMaintenance} />
            </div>
            {maintenance && (
              <div className="space-y-2">
                <Label>Pesan Maintenance</Label>
                <Textarea value={maintenanceMsg} onChange={e => setMaintenanceMsg(e.target.value)} rows={3} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Store Info */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Store className="w-5 h-5 text-purple-500" />
              Info Toko
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Store className="w-3 h-3" /> Nama Toko</Label>
              <Input value={storeName} onChange={e => setStoreName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Mail className="w-3 h-3" /> Email</Label>
              <Input value={storeEmail} onChange={e => setStoreEmail(e.target.value)} type="email" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Phone className="w-3 h-3" /> Telepon</Label>
              <Input value={storePhone} onChange={e => setStorePhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><MapPin className="w-3 h-3" /> Alamat</Label>
              <Textarea value={storeAddress} onChange={e => setStoreAddress(e.target.value)} rows={2} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-blue-500">
          <Save className="w-4 h-4 mr-2" /> Simpan Pengaturan
        </Button>
      </div>
      {saved && <p className="text-right text-sm text-emerald-600">Pengaturan berhasil disimpan!</p>}
    </div>
  );
}

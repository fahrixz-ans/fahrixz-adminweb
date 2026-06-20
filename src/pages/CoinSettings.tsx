import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coins, ArrowRightLeft } from 'lucide-react';

export default function CoinSettings() {
  const [exchangeRate, setExchangeRate] = useState(15);
  const [minExchange, setMinExchange] = useState(150);
  const [maxExchange, setMaxExchange] = useState(15000);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Coin Settings" description="Atur rate penukaran koin" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ArrowRightLeft className="w-5 h-5 text-purple-500" />
              Rate Penukaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-6 py-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-2">
                  <Coins className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-2xl font-bold">{exchangeRate}</p>
                <p className="text-xs text-gray-500">Koin</p>
              </div>
              <div className="text-2xl text-gray-400">=</div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold text-emerald-600">Rp</span>
                </div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-gray-500">Rupiah</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Exchange Rate (koin per Rp 1) *</Label>
                <Input type="number" value={exchangeRate} onChange={e => setExchangeRate(Number(e.target.value))} min={1} />
                <p className="text-xs text-gray-500">Contoh: 15 koin = Rp 1</p>
              </div>
              <div className="space-y-2">
                <Label>Minimal Tukar (koin)</Label>
                <Input type="number" value={minExchange} onChange={e => setMinExchange(Number(e.target.value))} min={0} />
              </div>
              <div className="space-y-2">
                <Label>Maksimal Tukar (koin)</Label>
                <Input type="number" value={maxExchange} onChange={e => setMaxExchange(Number(e.target.value))} min={0} />
              </div>
            </div>

            <Button onClick={handleSave} className="w-full bg-gradient-to-r from-purple-600 to-blue-500">
              Simpan Pengaturan
            </Button>
            {saved && <p className="text-center text-sm text-emerald-600">Pengaturan berhasil disimpan!</p>}
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-base">Simulasi Tukar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 space-y-3">
              <div className="flex justify-between text-sm"><span className="text-gray-500">150 koin</span><span>= Rp {Math.floor(150 / exchangeRate).toLocaleString('id-ID')}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">1.500 koin</span><span>= Rp {Math.floor(1500 / exchangeRate).toLocaleString('id-ID')}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">15.000 koin</span><span>= Rp {Math.floor(15000 / exchangeRate).toLocaleString('id-ID')}</span></div>
            </div>
            <p className="text-xs text-gray-500">Rate saat ini: 1 Rupiah = {exchangeRate} koin</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center mx-auto">
          <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">404</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-500 max-w-md">
          Halaman yang Anda cari tidak ada atau telah dipindahkan. Silakan kembali ke dashboard.
        </p>
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
          </Button>
          <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-purple-600 to-blue-500">
            <Home className="w-4 h-4 mr-2" /> Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

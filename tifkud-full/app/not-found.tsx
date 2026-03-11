import Link from 'next/link';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-[#0b2a55] rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-[#c9a227]" />
        </div>
        <h1 className="text-4xl font-bold text-[#0b2a55] mb-4">דילמה לא נמצאה</h1>
        <p className="text-gray-600 mb-8">הדילמה שחיפשת אינה קיימת במערכת</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#c9a227] hover:bg-[#d4b545] text-[#0b2a55] px-6 py-3 rounded-xl font-bold transition-colors duration-200"
        >
          <Home className="w-5 h-5" />
          <span>חזרה לדף הראשי</span>
        </Link>
      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

export default function LoginClient() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('יש למלא שם משתמש וסיסמה');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'שגיאה בכניסה');
      }
    } catch {
      setError('שגיאת רשת, נסה שוב');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-[#0b2a55] to-[#1a4a8a] flex flex-col">
      {/* Header */}
      <header className="bg-[#0b2a55]/80 text-white py-4 px-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white overflow-hidden">
          <img
            src="https://static.wixstatic.com/media/c408f1_08cd4663caf8461795a4102a21770149~mv2.jpg/v1/fill/w_277,h_211,al_c,lg_1,q_80/c408f1_08cd4663caf8461795a4102a21770149~mv2.jpg"
            alt="לוגו"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-bold text-lg">מחולל הדילמות הפיקודיות</span>
      </header>

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-10 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0b2a55] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-[#c9a227]" />
            </div>
            <h1 className="text-2xl font-bold text-[#0b2a55]">כניסת מנהל</h1>
            <p className="text-gray-500 text-sm mt-1">גישה לעריכת דילמות</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">שם משתמש</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="הכנס שם משתמש"
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0b2a55] text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">סיסמה</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="הכנס סיסמה"
                  className="w-full pr-10 pl-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0b2a55] text-right"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm font-medium text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#0b2a55] text-white py-3 rounded-xl font-bold text-base hover:bg-[#0e3568] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'מתחבר...' : 'כניסה'}
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full text-gray-500 text-sm py-2 hover:text-gray-700 transition-colors"
            >
              ← חזרה לאתר
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

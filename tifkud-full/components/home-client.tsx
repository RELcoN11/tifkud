'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Target, Shield, Users, Zap, Settings, LogOut } from 'lucide-react';
import type { Dilemma } from '@/lib/dilemmas';

interface HomeClientProps {
  dilemmas: Dilemma[];
  isAdmin: boolean;
}

export default function HomeClient({ dilemmas, isAdmin }: HomeClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDilemma, setSelectedDilemma] = useState<Dilemma | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDilemmas = dilemmas.filter(d =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.situation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (dilemma: Dilemma) => {
    setSelectedDilemma(dilemma);
    setIsOpen(false);
    router.push(`/dilemma/${dilemma.id}`);
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.refresh();
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-[#0b2a55] text-white py-4 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white flex-shrink-0">
              <img
                src="https://static.wixstatic.com/media/c408f1_08cd4663caf8461795a4102a21770149~mv2.jpg/v1/fill/w_277,h_211,al_c,lg_1,q_80/c408f1_08cd4663caf8461795a4102a21770149~mv2.jpg"
                alt="לוגו"
                className="object-contain p-1 w-full h-full"
              />
            </div>
            <h1 className="text-xl md:text-2xl font-bold">רציפות תפקודית למפקד</h1>
          </div>
          <div className="flex gap-2">
            {isAdmin ? (
              <>
                <button
                  onClick={() => router.push('/admin')}
                  className="flex items-center gap-2 bg-[#c9a227] text-[#0b2a55] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#d4b545] transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  ניהול דילמות
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  יציאה
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push('/admin/login')}
                className="flex items-center gap-2 bg-[#c9a227] text-[#0b2a55] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#d4b545] transition-colors"
              >
                כניסת מנהל
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 md:py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-[#c9a227]/20 text-[#0b2a55] px-4 py-2 rounded-full mb-6">
              <Shield className="w-5 h-5" />
              <span className="font-medium">מודל הרצפים לפתרון דילמות</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#0b2a55] mb-4">
              מחולל <span className="text-[#c9a227]">הדילמות</span> הפיקודיות
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              בחר דילמה מהרשימה וקבל פתרון מובנה לפי מודל הרצפים —{' '}
              <br className="hidden md:block" />
              כלי עזר מעשי למפקדים בשטח
            </p>
          </div>

          {/* Dropdown */}
          <div className="animate-fadeIn relative z-50 pb-4" ref={dropdownRef}>
            <div className="w-full max-w-2xl mx-auto">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white border-2 border-[#0b2a55] rounded-xl px-6 py-4 text-right flex items-center justify-between shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-[#c9a227]" />
                  <span className="text-lg text-[#0b2a55] font-medium">
                    {selectedDilemma?.title ?? 'בחר דילמה מהרשימה...'}
                  </span>
                </div>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="w-6 h-6 text-[#0b2a55]" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#0b2a55] rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="חפש דילמה..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          autoFocus
                          className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c9a227] text-right"
                        />
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {filteredDilemmas.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">לא נמצאו תוצאות</div>
                      ) : (
                        filteredDilemmas.map((dilemma, index) => (
                          <motion.button
                            key={dilemma.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.02 }}
                            onClick={() => handleSelect(dilemma)}
                            className="w-full px-4 py-3 text-right hover:bg-[#0b2a55] hover:text-white transition-colors duration-200 border-b border-gray-100 last:border-b-0 group"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 flex items-center justify-center bg-[#c9a227] text-white rounded-full text-sm font-bold group-hover:bg-white group-hover:text-[#0b2a55]">
                                {dilemma.id}
                              </span>
                              <div>
                                <div className="font-semibold text-[#0b2a55] group-hover:text-white">
                                  {dilemma.title}
                                </div>
                                <div className="text-sm text-gray-500 group-hover:text-gray-200 truncate max-w-md">
                                  {dilemma.situation}
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4 bg-white/50 relative z-0">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Target className="w-6 h-6 text-[#c9a227]" />, title: `${dilemmas.length} דילמות מבצעיות`, desc: 'מגוון רחב של סיטואציות פיקודיות מהשטח' },
              { icon: <Users className="w-6 h-6 text-[#c9a227]" />, title: 'ניתוח מקצועי', desc: 'זיהוי כוחות מפרקים ובונים לכל דילמה' },
              { icon: <Zap className="w-6 h-6 text-[#c9a227]" />, title: 'פעולות מומלצות', desc: 'המלצות פיקודיות מעשיות ומיידיות' },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-[#0b2a55] rounded-xl flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-[#0b2a55] mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#0b2a55] text-white py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-300">© מחולל רציפות תפקודית למפקד | מודל הרצפים</p>
        </div>
      </footer>
    </main>
  );
}

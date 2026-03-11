'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, AlertTriangle, Lightbulb, FileText, Pencil } from 'lucide-react';
import type { Dilemma } from '@/lib/dilemmas';

const SEQ_COLORS: Record<string, string> = {
  'שליטה': '#3b82f6', 'שייכות': '#10b981',
  'מסוגלות': '#f59e0b', 'משמעות': '#8b5cf6', 'ודאות': '#ef4444',
};

interface DilemmaContentProps {
  dilemma: Dilemma;
  isAdmin: boolean;
}

export default function DilemmaContent({ dilemma, isAdmin }: DilemmaContentProps) {
  return (
    <main className="min-h-screen pb-12">
      <header className="bg-[#0b2a55] text-white py-4 shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white">
              <Image
                src="https://static.wixstatic.com/media/c408f1_08cd4663caf8461795a4102a21770149~mv2.jpg/v1/fill/w_277,h_211,al_c,lg_1,q_80/c408f1_08cd4663caf8461795a4102a21770149~mv2.jpg"
                alt="לוגו"
                fill
                className="object-contain p-1"
              />
            </div>
            <h1 className="text-lg md:text-xl font-bold">מחולל הדילמות הפיקודיות</h1>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Link
                href={`/admin`}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Pencil className="w-4 h-4" />
                ערוך דילמה זו
              </Link>
            )}
            <Link
              href="/"
              className="flex items-center gap-2 bg-[#c9a227] hover:bg-[#d4b545] text-[#0b2a55] px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              חזרה למחולל
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-14 h-14 flex items-center justify-center bg-[#c9a227] text-[#0b2a55] rounded-full text-2xl font-bold shadow-lg">
              {dilemma.id}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0b2a55]">{dilemma.title}</h2>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#0b2a55] rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-[#c9a227]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0b2a55] mb-2">תיאור הדילמה</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{dilemma.situation}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0b2a55] mb-3">רצפים נפגעים</h3>
              <div className="flex flex-wrap gap-2">
                {dilemma.affectedSequences.split(',').map(s => s.trim()).filter(Boolean).map(seq => (
                  <span key={seq} className="px-4 py-1.5 rounded-full font-bold text-white text-sm" style={{ background: SEQ_COLORS[seq] || '#6b7280' }}>
                    {seq}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {dilemma.recommendedActions.length > 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-[#0b2a55] to-[#1a3d6e] rounded-2xl p-6 shadow-xl text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#c9a227] rounded-xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-[#0b2a55]" />
              </div>
              <h3 className="text-xl font-bold">פעולות פיקודיות מומלצות (מבוסס הנחיות ממד"ה)</h3>
            </div>
            <div className="space-y-4">
              {dilemma.recommendedActions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.1 }}
                  className="flex items-start gap-4 bg-white/10 rounded-xl p-4"
                >
                  <span className="w-8 h-8 flex items-center justify-center bg-[#c9a227] text-[#0b2a55] rounded-full font-bold flex-shrink-0">{index + 1}</span>
                  <p className="text-lg">{action}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-100 rounded-2xl p-6 shadow-lg text-center">
            <p className="text-gray-600 text-lg">לא נמצאו פעולות מומלצות לדילמה זו</p>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3 bg-[#c9a227] hover:bg-[#d4b545] text-[#0b2a55] px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <ArrowRight className="w-5 h-5" />
            חזרה למחולל הדילמות
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Target } from 'lucide-react';
import { dilemmas, type Dilemma } from '@/lib/dilemmas';

export default function DilemmaDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDilemma, setSelectedDilemma] = useState<Dilemma | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef?.current && !dropdownRef.current.contains(event?.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDilemmas = (dilemmas ?? []).filter(d => 
    d?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase() ?? '') ||
    d?.situation?.toLowerCase()?.includes(searchTerm?.toLowerCase() ?? '')
  );

  const handleSelect = (dilemma: Dilemma) => {
    setSelectedDilemma(dilemma);
    setIsOpen(false);
    router.push(`/dilemma/${dilemma?.id ?? 1}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto" ref={dropdownRef}>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border-2 border-[#0b2a55] rounded-xl px-6 py-4 text-right flex items-center justify-between shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-[#c9a227]" />
            <span className="text-lg text-[#0b2a55] font-medium">
              {selectedDilemma?.title ?? 'בחר דילמה מהרשימה...'}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
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
                    onChange={(e) => setSearchTerm(e?.target?.value ?? '')}
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c9a227] text-right"
                  />
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {(filteredDilemmas ?? [])?.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    לא נמצאו תוצאות
                  </div>
                ) : (
                  (filteredDilemmas ?? []).map((dilemma, index) => (
                    <motion.button
                      key={dilemma?.id ?? index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleSelect(dilemma)}
                      className="w-full px-4 py-3 text-right hover:bg-[#0b2a55] hover:text-white transition-colors duration-200 border-b border-gray-100 last:border-b-0 group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 flex items-center justify-center bg-[#c9a227] text-white rounded-full text-sm font-bold group-hover:bg-white group-hover:text-[#0b2a55]">
                          {dilemma?.id ?? 0}
                        </span>
                        <div>
                          <div className="font-semibold text-[#0b2a55] group-hover:text-white">
                            {dilemma?.title ?? ''}
                          </div>
                          <div className="text-sm text-gray-500 group-hover:text-gray-200 truncate max-w-md">
                            {dilemma?.situation ?? ''}
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
  );
}

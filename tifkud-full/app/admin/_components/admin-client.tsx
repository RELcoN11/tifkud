'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, LogOut, Home, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { Dilemma } from '@/lib/dilemmas';

const ALL_SEQUENCES = ['שליטה', 'שייכות', 'מסוגלות', 'משמעות', 'ודאות'];
const SEQ_COLORS: Record<string, string> = {
  'שליטה': '#3b82f6', 'שייכות': '#10b981',
  'מסוגלות': '#f59e0b', 'משמעות': '#8b5cf6', 'ודאות': '#ef4444',
};

type EditState = {
  id?: number;
  title: string;
  situation: string;
  affectedSequences: string;
  recommendedActions: string[];
};

interface AdminClientProps {
  dilemmas: Dilemma[];
  adminUsername: string;
}

export default function AdminClient({ dilemmas: initial, adminUsername }: AdminClientProps) {
  const [dilemmas, setDilemmas] = useState<Dilemma[]>(initial);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openNew = () => {
    setEditState({ title: '', situation: '', affectedSequences: '', recommendedActions: [''] });
    setIsNew(true);
  };

  const openEdit = (d: Dilemma) => {
    setEditState({ id: d.id, title: d.title, situation: d.situation, affectedSequences: d.affectedSequences, recommendedActions: d.recommendedActions.length ? [...d.recommendedActions] : [''] });
    setIsNew(false);
  };

  const cancelEdit = () => { setEditState(null); setIsNew(false); };

  const toggleSeq = (seq: string) => {
    if (!editState) return;
    const current = editState.affectedSequences.split(',').map(s => s.trim()).filter(Boolean);
    const updated = current.includes(seq) ? current.filter(s => s !== seq) : [...current, seq];
    setEditState({ ...editState, affectedSequences: updated.join(', ') });
  };

  const handleSave = async () => {
    if (!editState) return;
    if (!editState.title.trim() || !editState.situation.trim()) {
      showToast('יש למלא כותרת ותיאור', 'error'); return;
    }
    setSaving(true);
    const payload = {
      title: editState.title.trim(),
      situation: editState.situation.trim(),
      affectedSequences: editState.affectedSequences.trim(),
      recommendedActions: editState.recommendedActions.filter(a => a.trim()),
    };
    try {
      const res = isNew
        ? await fetch('/api/dilemmas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch(`/api/dilemmas/${editState.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); showToast(d.error || 'שגיאה', 'error'); return; }
      const saved: Dilemma = await res.json();
      if (isNew) {
        setDilemmas(prev => [...prev, saved].sort((a, b) => a.id - b.id));
        showToast('דילמה חדשה נוספה ✓');
      } else {
        setDilemmas(prev => prev.map(d => d.id === saved.id ? saved : d));
        showToast('הדילמה עודכנה ✓');
      }
      cancelEdit();
    } catch { showToast('שגיאת רשת', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`למחוק את "${title}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/dilemmas/${id}`, { method: 'DELETE' });
      if (!res.ok) { showToast('שגיאה במחיקה', 'error'); return; }
      setDilemmas(prev => prev.filter(d => d.id !== id));
      showToast('הדילמה נמחקה');
    } catch { showToast('שגיאת רשת', 'error'); }
    finally { setDeletingId(null); }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/');
    router.refresh();
  };

  const currentSeqs = (editState?.affectedSequences || '').split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl font-bold text-white shadow-xl text-sm transition-all ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-[#0b2a55] text-white py-4 px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white overflow-hidden">
            <img src="https://static.wixstatic.com/media/c408f1_08cd4663caf8461795a4102a21770149~mv2.jpg/v1/fill/w_277,h_211,al_c,lg_1,q_80/c408f1_08cd4663caf8461795a4102a21770149~mv2.jpg" alt="לוגו" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">ניהול דילמות</h1>
            <p className="text-xs text-gray-300 mt-0.5">מחובר כ: {adminUsername}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => router.push('/')} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
            <Home className="w-4 h-4" /> לאתר
          </button>
          <button onClick={handleLogout} className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
            <LogOut className="w-4 h-4" /> יציאה
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Edit / New Form */}
        {editState && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-[#0b2a55]/20">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#0b2a55]">{isNew ? '➕ הוספת דילמה חדשה' : `✏️ עריכת דילמה #${editState.id}`}</h2>
              <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">כותרת *</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-right focus:outline-none focus:border-[#0b2a55] text-sm"
                  value={editState.title}
                  onChange={e => setEditState({ ...editState, title: e.target.value })}
                  placeholder="לדוגמה: צוות שחוק"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">תיאור הדילמה *</label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-right focus:outline-none focus:border-[#0b2a55] text-sm resize-y"
                  value={editState.situation}
                  onChange={e => setEditState({ ...editState, situation: e.target.value })}
                  placeholder="תיאור המצב הפיקודי..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">רצפים נפגעים</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SEQUENCES.map(seq => {
                    const active = currentSeqs.includes(seq);
                    return (
                      <button
                        key={seq}
                        onClick={() => toggleSeq(seq)}
                        className="px-3 py-1.5 rounded-full text-sm font-bold transition-all"
                        style={{
                          background: active ? (SEQ_COLORS[seq] || '#6b7280') : '#f3f4f6',
                          color: active ? 'white' : '#374151',
                          border: `2px solid ${active ? (SEQ_COLORS[seq] || '#6b7280') : '#e5e7eb'}`,
                        }}
                      >
                        {active && '✓ '}{seq}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">פעולות פיקודיות מומלצות</label>
                <div className="space-y-2">
                  {editState.recommendedActions.map((action, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <span className="w-6 h-6 flex items-center justify-center bg-[#c9a227] text-[#0b2a55] rounded-full text-xs font-bold flex-shrink-0">{i + 1}</span>
                      <input
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right focus:outline-none focus:border-[#0b2a55] text-sm"
                        value={action}
                        onChange={e => {
                          const arr = [...editState.recommendedActions];
                          arr[i] = e.target.value;
                          setEditState({ ...editState, recommendedActions: arr });
                        }}
                        placeholder="תיאור הפעולה..."
                      />
                      <button
                        onClick={() => {
                          const arr = editState.recommendedActions.filter((_, j) => j !== i);
                          setEditState({ ...editState, recommendedActions: arr.length ? arr : [''] });
                        }}
                        className="text-red-400 hover:text-red-600 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setEditState({ ...editState, recommendedActions: [...editState.recommendedActions, ''] })}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-sm hover:border-gray-400 hover:text-gray-600 transition-colors"
                  >
                    + הוסף פעולה
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#0b2a55] text-white py-3 rounded-xl font-bold hover:bg-[#0e3568] transition-colors disabled:opacity-60"
                >
                  <Check className="w-4 h-4" />
                  {saving ? 'שומר...' : 'שמור'}
                </button>
                <button onClick={cancelEdit} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                  ביטול
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#0b2a55]">כל הדילמות</h2>
            <p className="text-sm text-gray-500">{dilemmas.length} דילמות במערכת</p>
          </div>
          {!editState && (
            <button
              onClick={openNew}
              className="flex items-center gap-2 bg-[#c9a227] text-[#0b2a55] px-5 py-2.5 rounded-xl font-bold hover:bg-[#d4b545] transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              הוסף דילמה
            </button>
          )}
        </div>

        {/* Dilemmas List */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {dilemmas.map((d, i) => (
            <div
              key={d.id}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-blue-50 transition-colors ${i < dilemmas.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <span className="w-9 h-9 flex items-center justify-center bg-[#c9a227] text-[#0b2a55] rounded-full font-bold text-sm flex-shrink-0">
                {d.id}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[#0b2a55] text-sm">{d.title}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {d.affectedSequences.split(',').map(s => s.trim()).filter(Boolean).map(seq => (
                    <span key={seq} className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: SEQ_COLORS[seq] || '#6b7280' }}>{seq}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(d)}
                  className="flex items-center gap-1 bg-[#0b2a55] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#0e3568] transition-colors"
                >
                  <Pencil className="w-3 h-3" /> עריכה
                </button>
                <button
                  onClick={() => handleDelete(d.id, d.title)}
                  disabled={deletingId === d.id}
                  className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-3 h-3" />
                  {deletingId === d.id ? '...' : 'מחיקה'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * @author Raja Haikal
 * @description Admin modal form to add/edit Skull Race events
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Calendar, Pencil } from 'lucide-react';
import type { SkullRaceEvent } from './AdminDashboard';

interface EventFormProps {
  event: SkullRaceEvent | null;
  onSave: (event: SkullRaceEvent) => void;
  onClose: () => void;
  existingEvents: SkullRaceEvent[];
}

//date calculation
const IND_BASE_MS = Date.UTC(2026, 4, 9); // 9 may
const TEAM_BASE_MS = Date.UTC(2026, 4, 9); // 9 may
const fmtDate = (date: string) => new Date(date + 'T12:00:00').toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' });

export default function EventForm({ event, onSave, onClose, existingEvents }: EventFormProps) {
  const [form, setForm] = useState<SkullRaceEvent>(event ?? makeEmptyEvent());
  const [confirmEdit, setConfirmEdit] = useState(false);
  const isDuplicate = existingEvents.some(
    (e) => e.date === form.date && e.category === form.category && e.id !== form.id
  );
  const handleWeekSelect = (counter: number) => {
    setForm((p) => ({ ...p, counter, date: getEventDate(p.category, counter) }));
  };
  const handleCategoryChange = (cat: 'individual' | 'team') => {
    const counter = getCurrentCounter();
    setForm((p) => ({ ...p, category: cat, counter, date: getEventDate(cat, counter) }));
  };
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isDuplicate) 
      return;
    if (event) 
      { 
        setConfirmEdit(true); 
        return; 
      }
    onSave(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md rounded-2xl p-6"
        style={{ background: '#13131a', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-lg">
            {event ? 'Edit Event' : 'New Event'}
          </h2>
          <button onClick={onClose} style={{ color: 'rgba(255,255,255,0.4)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Category
            </label>
            <div className="flex gap-2">
              {(['individual', 'team'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors"
                  style={{
                    background: form.category === cat ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : 'rgba(255,255,255,0.06)',
                    color: form.category === cat ? '#fff' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {form.category === 'individual' ? 'Week' : 'Round'}
            </label>
            <div className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                type="button"
                onClick={() => form.counter > 1 && handleWeekSelect(form.counter - 1)}
                disabled={form.counter <= 1}
                className="w-9 h-9 rounded-lg text-xl font-bold flex items-center justify-center transition-all"
                style={{
                  background: form.counter <= 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.08)',
                  color: form.counter <= 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
                }}
              >
                −
              </button>
              <div className="text-center">
                <p className="text-2xl font-black text-white leading-none">{form.counter}</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {form.category === 'individual' ? `Week ${form.counter}` : `Round ${form.counter}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleWeekSelect(form.counter + 1)}
                className="w-9 h-9 rounded-lg text-xl font-bold flex items-center justify-center transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Calendar size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Date: <span className="text-white font-medium">{fmtDate(form.date)}</span>
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {form.category === 'individual' ? 'Player Name' : 'Team Name'}
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              placeholder={form.category === 'individual' ? 'e.g. SteveXD' : 'e.g. Team Alpha'}
              className="rounded-lg px-3 py-2.5 text-sm text-white outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          {isDuplicate && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
              style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)' }}>
              <AlertCircle size={14} style={{ color: '#f87171', flexShrink: 0 }} />
              <p className="text-xs" style={{ color: '#f87171' }}>
                A {form.category} result for this {form.category === 'individual' ? 'week' : 'round'} already exists.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Publish</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Visible on Skull Race page
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, is_published: !p.is_published }))}
              className="relative w-11 h-6 rounded-full transition-colors"
              style={{ background: form.is_published ? '#6366f1' : 'rgba(255,255,255,0.1)' }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                style={{ transform: form.is_published ? 'translateX(20px)' : 'translateX(0)' }}
              />
            </button>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium"
              style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDuplicate}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                opacity: isDuplicate ? 0.4 : 1,
                cursor: isDuplicate ? 'not-allowed' : 'pointer',
              }}
            >
              Save
            </button>
          </div>
        </form>
        {/* confirm edit popup */}
        <AnimatePresence>
          {confirmEdit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center rounded-2xl p-6"
              style={{ background: 'rgba(10,10,15,0.92)' }}
            >
              <div className="w-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(99,102,241,0.15)' }}>
                    <Pencil size={15} style={{ color: '#a5b4fc' }} />
                  </div>
                  <h3 className="text-white font-semibold">Confirm Edit</h3>
                </div>
                <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Save changes to:
                </p>
                <p className="text-white font-bold mb-1">
                  {form.category === 'individual' ? 'Week' : 'Round'} {form.counter} — {form.name}
                </p>
                <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {fmtDate(form.date)}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmEdit(false)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium"
                    style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onSave(form)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function getEventDate(category: 'individual' | 'team', counter: number): string {
  const base = category === 'individual' ? IND_BASE_MS : TEAM_BASE_MS;
  const days = (counter - 1) * (category === 'individual' ? 7 : 14);
  return new Date(base + days * 86400000).toISOString().split('T')[0];
}

function getCurrentCounter(): number {
  const diff = Date.now() - IND_BASE_MS;
  if (diff < 0) 
    return 1;
    return Math.floor(diff / (7 * 86400000)) + 1;
}

function makeEmptyEvent(): SkullRaceEvent {
  const counter = getCurrentCounter();
  return { 
    id: '', category: 'individual', name: '', counter, date: getEventDate('individual', counter), is_published: false 
  };
}
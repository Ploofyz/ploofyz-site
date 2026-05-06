/**
 * @author Raja Haikal
 * @description Hall of Fame page
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import type { SkullRaceEvent } from '../../pages/admin/AdminDashboard';
import { fmt } from './utils';

type HistoryTab = 'all' | 'individual' | 'team';

interface HistoryPageProps {
  individual: SkullRaceEvent[];
  team: SkullRaceEvent[];
  onBack: () => void;
}

export default function HistoryPage({ individual, team, onBack }: HistoryPageProps) {
  const [tab, setTab] = useState<HistoryTab>('all');

  const all = [...individual, ...team].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const filtered = tab === 'all' ? all : tab === 'individual' ? individual : team;

  return (
    <div className="min-h-screen px-4 py-24" style={{ color: '#fff' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={onBack} className="flex items-center gap-2 text-sm mb-8"
            style={{ color: 'rgba(255,255,255,0.4)' }}>
            <ArrowLeft size={15} /> Back
          </button>

          <h2 className="text-3xl font-black mb-6">Hall of Fame</h2>

          <div className="flex rounded-xl p-1 mb-6 w-fit"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            {(['all', 'individual', 'team'] as HistoryTab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className="px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
                style={{
                  background: tab === t ? 'rgba(99,102,241,0.3)' : 'transparent',
                  color: tab === t ? '#a5b4fc' : 'rgba(255,255,255,0.4)',
                }}>
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {filtered.map((event, i) => {
              const isIndividual = event.category === 'individual';
              const accentColor = isIndividual ? '#a5b4fc' : '#4ade80';
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="rounded-2xl flex flex-col overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="px-3 pt-4 pb-3 text-center">
                    <p className="text-xs font-bold uppercase tracking-wide" style={{ color: accentColor }}>
                      {isIndividual ? 'Week' : 'Round'}
                    </p>
                    <p className="text-2xl font-black text-white leading-none mt-0.5">{event.counter}</p>
                  </div>
                  <div className="flex-1 px-3 pb-3 flex items-center justify-center">
                    <p className="text-sm font-bold text-white text-center leading-tight">{event.name}</p>
                  </div>
                  <div className="px-3 py-2 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{fmt(event.date, true)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

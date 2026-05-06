/**
 * @author Raja Haikal
 * @description Displays individual week/round winner
 */

import { motion } from 'framer-motion';
import type { SkullRaceEvent } from '../../pages/admin/AdminDashboard';
import { fmt } from './utils';

export default function ResultCard({ event, term, delay }: { event: SkullRaceEvent; term: string; delay: number }) {
  const isIndividual = event.category === 'individual';
  const accentColor = isIndividual ? '#a5b4fc' : '#4ade80';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl flex flex-col overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="px-5 pt-5 pb-4 text-center">
        <p className="text-2xl font-black tracking-tight" style={{ color: accentColor }}>
          {term} {event.counter}
        </p>
      </div>
      <div className="flex-1 px-5 pb-4 flex items-center justify-center">
        <p className="text-lg font-bold text-white text-center">{event.name}</p>
      </div>
      <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {fmt(event.date, true)}
        </p>
      </div>
    </motion.div>
  );
}

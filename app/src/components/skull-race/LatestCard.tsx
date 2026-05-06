/**
 * @author Raja Haikal
 * @description Displays latest/current champion
 */

import { motion } from 'framer-motion';
import type { SkullRaceEvent } from '../../pages/admin/AdminDashboard';
import { fmt } from './utils';

interface LatestCardProps {
  label: string;
  icon: React.ReactNode;
  color: string;
  event: SkullRaceEvent | undefined;
  term: string;
  delay: number;
  subtitle: string;
}

export default function LatestCard({ label, icon, color, event, term, delay, subtitle }: LatestCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative overflow-hidden rounded-2xl p-6"
      style={{
        background: `linear-gradient(135deg, ${color}10 0%, rgba(255,255,255,0.02) 100%)`,
        border: `1px solid ${color}30`,
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color}15, transparent 70%)`, transform: 'translate(30%, -30%)' }} />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <span style={{ color }}>{icon}</span>
          <p className="text-sm font-bold" style={{ color }}>Latest {label}</p>
        </div>
        <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>{subtitle}</p>
        {event ? (
          <>
            <p className="text-3xl font-black mb-2 leading-none">{event.name}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-1 rounded-lg"
                style={{ background: `${color}18`, color }}>
                {term} {event.counter}
              </span>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {fmt(event.date, true)}
              </span>
            </div>
          </>
        ) : (
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.2)' }}>No data yet</p>
        )}
      </div>
    </motion.div>
  );
}

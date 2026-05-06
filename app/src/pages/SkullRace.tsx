/**
 * @author Raja Haikal
 * @description Public Skull Race page
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, ChevronRight, Skull, User, Clock, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { SkullRaceEvent } from './admin/AdminDashboard';
import ResultCard from '../components/skull-race/ResultCard';
import LatestCard from '../components/skull-race/LatestCard';
import HistoryPage from '../components/skull-race/HistoryPage';
import './Vote.css';

export default function SkullRace() {
  const [events, setEvents] = useState<SkullRaceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    supabase
      .from('skull_race_events')
      .select('*')
      .eq('is_published', true)
      .order('counter', { ascending: false })
      .then(({ data }) => {
        if (data) 
          setEvents(data);
          setLoading(false);
      });
  }, []);

  const individual = events.filter((e) => e.category === 'individual');
  const team = events.filter((e) => e.category === 'team');
  const latestIndividual = individual[0];
  const latestTeam = team[0];

  if (showHistory) {
    return <HistoryPage individual={individual} team={team} onBack={() => setShowHistory(false)} />;
  }

  return (
    <div className="min-h-screen" style={{ color: '#fff' }}>
      {/* hero section */}
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Ploofyz Weekly Event
            </span>
          </div>
          <h1 className="page-hero-title">
            <span className="gradient-text">Skull Race</span>
          </h1>
          <p className="page-hero-subtitle">
            Individual & Team categories · Updated every week
          </p>
          <div style={{ marginTop: '1rem' }}>
            <span
              className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-1.5 rounded-full"
              style={{ background: '#ef4444', color: '#fff', boxShadow: '0 0 20px rgba(239,68,68,0.4)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </span>
          </div>
        </div>
      </section>

      {/*intro for skull race*/}
      <div className="px-4 pt-8 pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl px-6 py-6 mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(234,88,12,0.08) 50%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(251,191,36,0.25)',
            }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.15), transparent 70%)', transform: 'translate(20%, -20%)' }} />
            <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.1), transparent 70%)', transform: 'translate(-20%, 20%)' }} />

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(251,191,36,0.6)' }}>
                  Weekly Prize
                </p>
                <p className="text-3xl font-black text-white mb-1">1× Wither Skull</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Awarded to top individual & team each week
                </p>
              </div>
              <div className="flex flex-col items-center gap-1 shrink-0 ml-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.2)' }}>
                  <Skull size={32} style={{ color: '#fbbf24' }} />
                </div>
              </div>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="relative overflow-hidden rounded-2xl p-5"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(255,255,255,0.02))',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)', transform: 'translate(30%, -30%)' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(99,102,241,0.2)' }}>
                    <User size={15} style={{ color: '#a5b4fc' }} />
                  </div>
                  <p className="text-sm font-bold" style={{ color: '#a5b4fc' }}>Individual</p>
                </div>
                <ul className="flex flex-col gap-2.5">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: 'rgba(165,180,252,0.5)' }} />
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>Based on solo player balance</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: 'rgba(165,180,252,0.5)' }} />
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      Win limit: <span className="text-white font-semibold">once per month</span>
                    </p>
                  </li>
                </ul>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl p-5"
              style={{
                background: 'linear-gradient(135deg, rgba(74,222,128,0.08), rgba(255,255,255,0.02))',
                border: '1px solid rgba(74,222,128,0.2)',
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.12), transparent 70%)', transform: 'translate(30%, -30%)' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(74,222,128,0.15)' }}>
                    <Users size={15} style={{ color: '#4ade80' }} />
                  </div>
                  <p className="text-sm font-bold" style={{ color: '#4ade80' }}>Team</p>
                </div>
                <ul className="flex flex-col gap-2.5">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: 'rgba(74,222,128,0.5)' }} />
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>Based on BetterTeams balance</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: 'rgba(74,222,128,0.5)' }} />
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      Win limit: <span className="text-white font-semibold">up to 2× per month</span>
                    </p>
                  </li>
                </ul>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="relative overflow-hidden rounded-2xl p-5"
              style={{
                background: 'linear-gradient(135deg, rgba(148,163,184,0.06), rgba(255,255,255,0.02))',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <ShieldCheck size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
                  </div>
                  <p className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>General</p>
                </div>
                <ul className="flex flex-col gap-2.5">
                  <li className="flex items-start gap-2">
                    <Clock size={12} className="shrink-0 mt-1" style={{ color: 'rgba(255,255,255,0.25)' }} />
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      Checked every <span className="text-white font-semibold">Saturday, 10:00 PM MYT</span>
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck size={12} className="shrink-0 mt-1" style={{ color: 'rgba(255,255,255,0.25)' }} />
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>Admin decision is final</p>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

      {/*loading*/}
        {loading && (
          <p className="text-center text-sm py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>Loading results...</p>
        )}
        {!loading && events.length === 0 && (
          <p className="text-center text-sm py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>No results published yet.</p>
        )}

        {!loading && events.length > 0 && (
          <>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Current Champions
            </p>
            {/* latest winner display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <LatestCard label="Individual" icon={<Trophy size={16} />} color="#fbbf24"
                event={latestIndividual} term="Week" delay={0.05} subtitle="#1 winner spotlight" />
              <LatestCard label="Team" icon={<Users size={16} />} color="#4ade80"
                event={latestTeam} term="Round" delay={0.1} subtitle="Biweekly team winners" />
            </div>
            {/* recent winners display */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Recent Results
              </p>
              {/* view all winners (history) */}
              {[...individual.slice(1), ...team.slice(1)].length > 0 && (
                <button onClick={() => setShowHistory(true)}
                  className="flex items-center gap-1 text-sm font-medium"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>
                  View all <ChevronRight size={14} />
                </button>
              )}
            </div>
            {/* individual winners */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-px" style={{ background: '#a5b4fc' }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#a5b4fc' }}>Individual</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {individual.slice(0, 4).map((event, i) => (
                  <ResultCard key={event.id} event={event} term="Week" delay={0.06 + i * 0.04} />
                ))}
              </div>
            </div>
            {/* team winners */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-px" style={{ background: '#4ade80' }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#4ade80' }}>Team</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {team.slice(0, 4).map((event, i) => (
                  <ResultCard key={event.id} event={event} term="Round" delay={0.18 + i * 0.04} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  );
}

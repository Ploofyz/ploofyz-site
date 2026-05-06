/**
 * @author Raja Haikal
 * @description Admin dashboard to manage Skull Race events
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, EyeOff, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import EventForm from './EventForm';

export interface SkullRaceEvent {
  id: string;
  category: 'individual' | 'team';
  name: string;
  counter: number;
  date: string;
  is_published: boolean;
  created_at?: string;
}

type Tab = 'individual' | 'team';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [events, setEvents] = useState<SkullRaceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('individual');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SkullRaceEvent | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<SkullRaceEvent | null>(null);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from('skull_race_events')
      .select('*')
      .order('counter', { ascending: false });
    if (data) setEvents(data);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const filtered = events.filter((e) => e.category === tab);
  const individualCount = events.filter((e) => e.category === 'individual').length;
  const teamCount = events.filter((e) => e.category === 'team').length;

  const handleSave = async (event: SkullRaceEvent) => {
    if (editingEvent) {
      await supabase.from('skull_race_events').update({
        category: event.category,
        name: event.name,
        counter: event.counter,
        date: event.date,
        is_published: event.is_published,
      }).eq('id', event.id);
    } else {
      await supabase.from('skull_race_events').insert({
        category: event.category,
        name: event.name,
        counter: event.counter,
        date: event.date,
        is_published: event.is_published,
      });
    }
    setShowForm(false);
    setEditingEvent(null);
    fetchEvents();
  };

  const handleDelete = async () => {
    if (!deleteConfirm) 
      return;
    await supabase.from('skull_race_events').delete().eq('id', deleteConfirm.id);
    setEvents((prev) => prev.filter((e) => e.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  };

  const handleTogglePublish = async (event: SkullRaceEvent) => {
    await supabase.from('skull_race_events')
      .update({ is_published: !event.is_published })
      .eq('id', event.id);
    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? { ...e, is_published: !e.is_published } : e))
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: '#0a0a0f' }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src="/ploofyz-logo.png" alt="Ploofyz" className="w-9 h-auto" />
            <div>
              <h1 className="text-white text-xl font-bold">Skull Race</h1>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Admin Dashboard</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
            style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
        {/* dashboard */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total Events', value: events.length },
            { label: 'Individual', value: individualCount },
            { label: 'Team', value: teamCount },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl px-4 py-3 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div
            className="flex rounded-lg p-1"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            {(['individual', 'team'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-1.5 rounded-md text-base font-medium capitalize transition-all"
                style={{
                  background: tab === t ? 'rgba(99,102,241,0.3)' : 'transparent',
                  color: tab === t ? '#a5b4fc' : 'rgba(255,255,255,0.4)',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        {/* create form */}
          <button
            onClick={() => { setEditingEvent(null); setShowForm(true); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-base font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}
          >
            <Plus size={15} /> New
          </button>
        </div>

        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div
            className="grid text-sm font-semibold px-4 py-3"
            style={{
              gridTemplateColumns: '80px 1fr 120px 90px',
              background: 'rgba(255,255,255,0.03)',
              color: 'rgba(255,255,255,0.35)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span>{tab === 'individual' ? 'Week' : 'Round'}</span>
            <span>Winner</span>
            <span>Date</span>
            <span className="text-right">Actions</span>
          </div>
        {/* loading */}
          {loading && (
            <p className="text-center py-12 text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Loading...
            </p>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-center py-12 text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
              No {tab} events yet.
            </p>
          )}

          {filtered.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="grid items-center px-4 py-3"
              style={{
                gridTemplateColumns: '80px 1fr 120px 90px',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-white">
                  #{event.counter}
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    background: event.is_published ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)',
                    color: event.is_published ? '#4ade80' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {event.is_published ? '●' : '○'}
                </span>
              </div>

              <span className="text-base text-white truncate">{event.name}</span>

              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {new Date(event.date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>

              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={() => handleTogglePublish(event)}
                  className="p-1.5 rounded-lg"
                  style={{ color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.05)' }}
                  title={event.is_published ? 'Unpublish' : 'Publish'}
                >
                  {event.is_published ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <button
                  onClick={() => { setEditingEvent(event); setShowForm(true); }}
                  className="p-1.5 rounded-lg"
                  style={{ color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.05)' }}
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(event)}
                  className="p-1.5 rounded-lg"
                  style={{ color: '#f87171', background: 'rgba(248,113,113,0.07)' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      <AnimatePresence>
        {showForm && (
          <EventForm
            event={editingEvent}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditingEvent(null); }}
            existingEvents={events}
          />
        )}
        {/* confirm delete popup */}
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-2xl p-6"
              style={{ background: '#13131a', border: '1px solid rgba(248,113,113,0.2)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(248,113,113,0.12)' }}>
                  <Trash2 size={16} style={{ color: '#f87171' }} />
                </div>
                <h2 className="text-white font-semibold">Delete Entry</h2>
              </div>
              <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Are you sure you want to delete:
              </p>
              <p className="text-white font-bold mb-1">
                {deleteConfirm.category === 'individual' ? 'Week' : 'Round'} {deleteConfirm.counter} — {deleteConfirm.name}
              </p>
              <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium"
                  style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
                  style={{ background: '#ef4444' }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

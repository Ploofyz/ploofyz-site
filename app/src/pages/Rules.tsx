import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  AlertTriangle,
  BookOpenCheck,
  ExternalLink,
  Gamepad2,
  MessageCircle,
  ScrollText,
  ShieldCheck,
} from 'lucide-react';
import './Rules.css';

const DISCORD_URL = 'https://discord.gg/G7kZvTtHav';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const minecraftRules = [
  'Respect players and staff. Harassment, threats, hate speech, and targeted drama are not welcome.',
  'Do not cheat, exploit, duplicate items, use unfair client mods, scripts, macros, bots, or x-ray tools.',
  'Keep builds, item names, usernames, skins, signs, and chat appropriate for the community.',
  'Do not grief, steal, scam, trap, or bypass claims unless a specific event or game mode clearly allows it.',
  'Do not advertise other servers, sell real-world trades, share suspicious links, or collect personal information.',
  'Do not evade punishments with alternate accounts or encourage other players to break rules.',
  'Report bugs and exploits privately to staff instead of demonstrating or spreading them.',
];

const discordRules = [
  'Use English in public channels so staff can moderate fairly.',
  'Keep conversations respectful. No slurs, harassment, spam, political fights, or sensitive-topic baiting.',
  'Use support, appeal, and suggestion channels for their intended purpose. Duplicate tickets slow staff down.',
  'Do not impersonate staff, abuse pinging, bypass filters, or post unrelated commands in the wrong channel.',
  'No suspicious links, account trading, real-money trading, doxxing, IP grabbing, or unsafe downloads.',
  'Do not discuss punishments publicly. Use the proper support path if you need staff review.',
];

const ruleGroups = {
  minecraft: {
    label: 'Minecraft Server',
    icon: <Gamepad2 size={18} />,
    heading: 'Minecraft Server Rules',
    intro: 'These rules keep survival, events, and daily play fair for everyone.',
    rules: minecraftRules,
  },
  discord: {
    label: 'Discord Server',
    icon: <MessageCircle size={18} />,
    heading: 'Discord Server Rules',
    intro: 'Discord follows the same standard as the server, with a few extra support-channel rules.',
    rules: discordRules,
  },
} as const;

type RuleGroup = keyof typeof ruleGroups;

const quickNotes = [
  {
    icon: <ShieldCheck size={24} />,
    title: 'Staff Judgment Applies',
    description: 'Staff can act on harmful behavior even if the exact case is not listed here.',
  },
  {
    icon: <AlertTriangle size={24} />,
    title: 'Your Account, Your Risk',
    description: 'You are responsible for your own account, devices, shared access, and alternate accounts.',
  },
  {
    icon: <BookOpenCheck size={24} />,
    title: 'Ask Before Testing',
    description: 'If a mechanic feels like an exploit, pause and ask staff before using it.',
  },
];

export default function Rules() {
  const [activeGroup, setActiveGroup] = useState<RuleGroup>('minecraft');
  const group = ruleGroups[activeGroup];

  return (
    <div className="rules-page">
      <section className="rules-hero">
        <div className="rules-hero-bg" />
        <div className="rules-hero-overlay" />
        <motion.div
          className="rules-hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] as const }}
        >
          <div className="rules-hero-icon">
            <ScrollText size={42} />
          </div>
          <p className="rules-kicker">Community Guidelines</p>
          <h1 className="rules-title">
            Ploofyz <span className="gradient-text">Rules</span>
          </h1>
          <p className="rules-subtitle">
            Clear expectations for fair gameplay, safe chat, and a community that stays fun to return to.
          </p>
          <div className="rules-meta" aria-label="Rules page metadata">
            <span>Last updated: 21 July 2026</span>
            <span>Applies to Minecraft and Discord</span>
          </div>
        </motion.div>
      </section>

      <main className="rules-content">
        <motion.section
          className="rules-intro"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {quickNotes.map((note) => (
            <motion.article className="rules-note" key={note.title} variants={fadeInUp}>
              <div className="rules-note-icon">{note.icon}</div>
              <h2>{note.title}</h2>
              <p>{note.description}</p>
            </motion.article>
          ))}
        </motion.section>

        <section className="rules-panel" aria-labelledby="rules-list-heading">
          <div className="rules-tabs" role="tablist" aria-label="Rule categories">
            {(Object.keys(ruleGroups) as RuleGroup[]).map((key) => (
              <button
                key={key}
                type="button"
                className={`rules-tab ${activeGroup === key ? 'active' : ''}`}
                onClick={() => setActiveGroup(key)}
                role="tab"
                aria-selected={activeGroup === key}
              >
                {ruleGroups[key].icon}
                <span>{ruleGroups[key].label}</span>
              </button>
            ))}
          </div>

          <motion.div
            key={activeGroup}
            className="rules-list-wrap"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rules-list-header">
              <div>
                <p className="rules-list-eyebrow">{group.label}</p>
                <h2 id="rules-list-heading">{group.heading}</h2>
              </div>
              <p>{group.intro}</p>
            </div>

            <ol className="rules-list">
              {group.rules.map((rule, index) => (
                <li key={rule}>
                  <span className="rules-number">{String(index + 1).padStart(2, '0')}</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        </section>

        <section className="rules-report">
          <div>
            <p className="rules-list-eyebrow">Need staff help?</p>
            <h2>Report problems through Discord support</h2>
            <p>
              Include player names, timestamps, screenshots, video, or coordinates when possible. Better evidence helps staff handle reports faster.
            </p>
          </div>
          <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="rules-discord-btn">
            <MessageCircle size={20} />
            Open Discord
            <ExternalLink size={16} />
          </a>
        </section>
      </main>
    </div>
  );
}

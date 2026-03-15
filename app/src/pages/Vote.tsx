import { useRef, useEffect, useState } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { ExternalLink, Gift, Star, Trophy, Sparkles, Crown, Gem } from 'lucide-react';
import './Vote.css';

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

// Vote links - UPDATE THESE WITH YOUR ACTUAL LINKS
const voteLinks = [
  { id: 1, label: 'Vote #1', url: 'https://minecraft-mp.com/server/s317050/vote/', icon: <Star size={22} />, color: 'from-violet-500 to-purple-600' },
  { id: 2, label: 'Vote #2', url: 'https://minecraft-server-list.com/server/500954/vote/', icon: <Trophy size={22} />, color: 'from-purple-500 to-pink-600' },
  { id: 3, label: 'Vote #3', url: 'https://topg.org/minecraft-servers/server-666346', icon: <Sparkles size={22} />, color: 'from-pink-500 to-rose-600' },
  { id: 4, label: 'Vote #4', url: 'https://minecraftservers.org/server/672619', icon: <Crown size={22} />, color: 'from-rose-500 to-orange-600' },
  { id: 5, label: 'Vote #5', url: 'https://minecraft-server.net/vote/ploofyz', icon: <Gem size={22} />, color: 'from-orange-500 to-amber-600' },
  { id: 6, label: 'Vote #6', url: 'https://mc-servers.com/minecraft-server-ploofyz/vote', icon: <Gift size={22} />, color: 'from-amber-500 to-yellow-600' },
];

// Scroll reveal hook
function useScrollRevealEffect() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.9);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let startTime: number | null = null;
            const duration = 600;
            const animate = (timestamp: number) => {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setScale(0.9 + (0.1 * eased));
              setOpacity(eased);
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          } else {
            setScale(0.9);
            setOpacity(0);
          }
        });
      },
      { threshold: 0.15, rootMargin: '-80px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, scale, opacity };
}

function ScrollScaleSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, scale, opacity } = useScrollRevealEffect();
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ scale, opacity, transformOrigin: 'center center' }}>
        {children}
      </motion.div>
    </div>
  );
}

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={staggerContainer} className={className}>
      {children}
    </motion.div>
  );
}

export default function Vote() {
  return (
    <div className="vote-page">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        
        <motion.div 
          className="page-hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1 className="page-hero-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            Vote <span className="gradient-text">Ploofyz!</span>
          </motion.h1>
          <motion.p className="page-hero-subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            Vote to receive exclusive in-game rewards! Support us by voting on all sites daily.
          </motion.p>
        </motion.div>
      </section>

      {/* Vote Buttons */}
      <section className="vote-buttons-section">
        <div className="vote-buttons-grid">
          {voteLinks.map((link, index) => (
            <motion.button
              key={link.id}
              className="vote-button"
              onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className={`vote-button-gradient ${link.color}`} />
              <div className="vote-button-content">
                <div className="vote-button-icon">{link.icon}</div>
                <span className="vote-button-label">{link.label}</span>
                <ExternalLink size={16} className="vote-button-arrow" />
              </div>
              <div className="vote-button-shine" />
            </motion.button>
          ))}
        </div>
      </section>

      {/* Rewards Section */}
      <ScrollScaleSection>
        <section className="rewards-section">
          <AnimatedSection>
            <motion.div className="rewards-header" variants={fadeInUp}>
              <h2 className="rewards-title">Voting Rewards</h2>
              <p className="rewards-subtitle">Get amazing rewards just by supporting us! Each vote counts.</p>
            </motion.div>

            <div className="rewards-grid">
              <motion.div className="reward-card" variants={fadeInUp}>
                <div className="reward-icon-wrapper"><Gift size={28} /></div>
                <h3 className="reward-title">Daily Rewards</h3>
                <p className="reward-description">Get coins, items, and exclusive perks every time you vote.</p>
              </motion.div>
              <motion.div className="reward-card" variants={fadeInUp}>
                <div className="reward-icon-wrapper"><Trophy size={28} /></div>
                <h3 className="reward-title">Streak Bonuses</h3>
                <p className="reward-description">Vote consistently to unlock streak rewards and multipliers.</p>
              </motion.div>
              <motion.div className="reward-card" variants={fadeInUp}>
                <div className="reward-icon-wrapper"><Star size={28} /></div>
                <h3 className="reward-title">Special Items</h3>
                <p className="reward-description">Unlock rare cosmetics and exclusive in-game items.</p>
              </motion.div>
            </div>
          </AnimatedSection>
        </section>
      </ScrollScaleSection>
    </div>
  );
}

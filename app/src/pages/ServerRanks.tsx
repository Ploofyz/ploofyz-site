import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation, type Variants } from 'framer-motion';
import { Star, Check, X, Crown, Zap, Shield, Sparkles, ArrowRight } from 'lucide-react';

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
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Ranks data with perks
const ranksData = [
  {
    name: 'VIP',
    icon: <Star size={24} />,
    color: '#8FBACC',
    bgColor: 'rgba(143, 186, 204, 0.15)',
    price: 'MYR 12',
    duration: '14D',
    durationType: 'temp',
    perks: [
      { name: 'Chat Badge', active: true },
      { name: 'Name Color', active: true },
      { name: 'Priority Join', active: true },
      { name: '/fly Command', active: false },
      { name: '2x Homes', active: false },
      { name: 'Kit VIP', active: false },
      { name: '/heal Command', active: false },
      { name: 'Custom Prefix', active: false },
      { name: '/god Command', active: false },
      { name: 'Particle Effects', active: false },
    ]
  },
  {
    name: 'Elite',
    icon: <Shield size={24} />,
    color: '#7FB86D',
    bgColor: 'rgba(127, 184, 109, 0.15)',
    price: 'MYR 18',
    duration: '14D',
    durationType: 'temp',
    perks: [
      { name: 'Chat Badge', active: true },
      { name: 'Name Color', active: true },
      { name: '/fly Command', active: true },
      { name: '2x Homes', active: true },
      { name: 'Priority Join', active: true },
      { name: 'Kit VIP', active: true },
      { name: '/heal Command', active: false },
      { name: 'Custom Prefix', active: false },
      { name: '/god Command', active: false },
      { name: 'Particle Effects', active: false },
    ]
  },
  {
    name: 'Hero',
    icon: <Zap size={24} />,
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    price: 'MYR 38',
    duration: '14D',
    durationType: 'temp',
    perks: [
      { name: 'Chat Badge', active: true },
      { name: 'Name Color', active: true },
      { name: '/fly Command', active: true },
      { name: '5x Homes', active: true },
      { name: 'Priority Join', active: true },
      { name: 'Kit VIP', active: true },
      { name: '/heal Command', active: true },
      { name: 'Custom Prefix', active: true },
      { name: '/god Command', active: false },
      { name: 'Particle Effects', active: false },
    ]
  },
  {
    name: 'Nexus',
    icon: <Crown size={24} />,
    color: '#F97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    price: 'MYR 72',
    duration: 'Permanent',
    durationType: 'perm',
    perks: [
      { name: 'Chat Badge', active: true },
      { name: 'Name Color + Glow', active: true },
      { name: '/fly Command', active: true },
      { name: '10x Homes', active: true },
      { name: 'Priority Join', active: true },
      { name: 'Kit Hero', active: true },
      { name: '/heal Command', active: true },
      { name: 'Custom Prefix', active: true },
      { name: '/god Command', active: true },
      { name: 'Particle Effects', active: true },
    ]
  },
  {
    name: 'Phantom',
    icon: <Sparkles size={24} />,
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    price: 'MYR 95',
    duration: 'Permanent',
    durationType: 'perm',
    perks: [
      { name: 'Chat Badge', active: true },
      { name: 'Animated Name', active: true },
      { name: '/fly + /god', active: true },
      { name: 'Unlimited Homes', active: true },
      { name: 'Max Priority Join', active: true },
      { name: 'Kit Phantom', active: true },
      { name: '/heal Command', active: true },
      { name: 'Custom Prefix', active: true },
      { name: 'Particle Effects', active: true },
      { name: '/vanish Command', active: true },
    ]
  }
];

// Scroll reveal hook for sections
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
              
              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };
            
            requestAnimationFrame(animate);
          } else {
            setScale(0.9);
            setOpacity(0);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '-80px 0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, scale, opacity };
}

// Scroll Scale Section Component
function ScrollScaleSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, scale, opacity } = useScrollRevealEffect();

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{
          scale,
          opacity,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Animated Section Component
function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ServerRanks() {
  return (
    <div className="ranks-page">
      {/* Hero Section */}
      <section className="ranks-hero-section">
        <motion.div
          className="ranks-hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as const }}
        >
          <motion.div
            className="ranks-hero-icon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Crown size={48} />
          </motion.div>

          <motion.h1
            className="ranks-hero-title heading-lg gradient-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Server Ranks
          </motion.h1>

          <motion.p
            className="ranks-hero-subtitle body-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Choose your rank to unlock exclusive perks and commands. 
            Upgrade your gameplay experience today.
          </motion.p>
        </motion.div>
      </section>

      {/* Ranks Table Section */}
      <ScrollScaleSection>
        <section className="ranks-table-section">
          <AnimatedSection>
            <motion.div className="ranks-table-container" variants={fadeInUp}>
              {/* Desktop Table */}
              <div className="ranks-table-desktop">
                <table className="ranks-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Rank</th>
                      <th style={{ textAlign: 'left' }}>Perks</th>
                      <th style={{ textAlign: 'center' }}>Duration</th>
                      <th style={{ textAlign: 'center' }}>Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranksData.map((rank, index) => (
                      <motion.tr
                        key={rank.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                      >
                        <td>
                          <div className="rank-cell-info">
                            <div 
                              className="rank-cell-icon"
                              style={{ background: rank.bgColor, color: rank.color }}
                            >
                              {rank.icon}
                            </div>
                            <span className="rank-cell-name" style={{ color: rank.color }}>
                              {rank.name}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="rank-cell-perks">
                            {rank.perks.map((perk) => (
                              <span 
                                key={perk.name}
                                className={`perk-tag ${perk.active ? 'active' : 'inactive'}`}
                              >
                                {perk.active ? <Check size={12} /> : <X size={12} />}
                                {perk.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className={`duration-badge ${rank.durationType}`}>
                            {rank.duration}
                          </span>
                        </td>
                        <td>
                          <span className="rank-price">{rank.price}</span>
                        </td>
                        <td>
                          <button className="rank-buy-btn">Buy</button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="ranks-table-mobile">
                {ranksData.map((rank, index) => (
                  <motion.div
                    key={rank.name}
                    className="rank-mobile-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    style={{ borderTop: `4px solid ${rank.color}` }}
                  >
                    <div className="rank-mobile-header">
                      <div 
                        className="rank-mobile-icon"
                        style={{ background: rank.bgColor, color: rank.color }}
                      >
                        {rank.icon}
                      </div>
                      <div className="rank-mobile-info">
                        <h3 style={{ color: rank.color }}>{rank.name}</h3>
                        <span className={`duration-badge ${rank.durationType}`}>
                          {rank.duration}
                        </span>
                      </div>
                      <span className="rank-mobile-price">{rank.price}</span>
                    </div>
                    <div className="rank-mobile-perks">
                      {rank.perks.filter(p => p.active).map((perk) => (
                        <span key={perk.name} className="perk-tag active">
                          <Check size={12} />
                          {perk.name}
                        </span>
                      ))}
                    </div>
                    <button className="rank-buy-btn" style={{ width: '100%' }}>
                      Buy Now
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* View Full Perks Button - Under Table */}
            <motion.div 
              className="view-full-perks-container"
              variants={fadeInUp}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                padding: '32px 24px',
                marginTop: '8px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <p style={{ 
                fontSize: '14px', 
                color: 'rgba(255, 255, 255, 0.5)',
                margin: 0
              }}>
                Want to see the complete list of all commands and permissions?
              </p>
              <a 
                href="full-permissions-ranks.html"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 28px',
                  background: 'transparent',
                  color: '#e2e8f0',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '15px',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#6366f1';
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span>View Full Perks</span>
                <ArrowRight size={18} style={{ transition: 'transform 0.3s ease' }} />
              </a>
            </motion.div>

            <motion.div className="ranks-table-footer" variants={fadeInUp}>
              <p>Temporary and Permanent ranks are one-time purchase</p>
            </motion.div>
          </AnimatedSection>
        </section>
      </ScrollScaleSection>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">© 2026 Ploofyz. All rights reserved.</p>
      </footer>
    </div>
  );
}

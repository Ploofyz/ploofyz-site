import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation, useScroll, useTransform, type Variants } from 'framer-motion';
import { ArrowRight, Zap, ChevronDown } from 'lucide-react';
import type { Page } from '../App';
import { TeamCarousel } from '../components/TeamCarousel/TeamCarousel';

// Change your video link here! Make sure it's the "embed" URL format from YouTube
const YOUTUBE_VIDEO_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ";

interface HomeProps {
  onNavigate: (page: Page) => void;
}

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

// Ranks data
const ranks = [
  {
    name: 'VIP',
    description: 'Starter premium rank with useful commands and chat perks.',
    duration: '14 Days',
    color: '#8FBACC'
  },
  {
    name: 'Elite',
    description: 'More utilities, crafting access, and gameplay conveniences.',
    duration: '14 Days',
    color: '#7FB86D'
  },
  {
    name: 'Hero',
    description: 'Advanced tools, repair features, and environment controls.',
    duration: '14 Days',
    color: '#f3de1cff'
  },
  {
    name: 'Nexus',
    description: 'Permanent rank with powerful utilities and reduced costs.',
    duration: '1 Month',
    color: '#F97316'
  },
  {
    name: 'Phantom',
    description: 'Top-tier rank with maximum perks and full command access.',
    duration: '1 Month',
    color: '#EF4444'
  }
];

// Pricing data
const pricingPlans = [
  {
    name: 'Basic',
    price: 'RM5',
    period: '/month',
    features: ['1GB RAM', 'Vanilla/Spigot', 'Community Support'],
    popular: false
  },
  {
    name: 'Starter',
    price: 'RM10',
    period: '/month',
    features: ['2GB RAM', 'Plugin Ready', 'Email Support'],
    popular: false
  },
  {
    name: 'Pro',
    price: 'RM25',
    period: '/month',
    features: ['6GB RAM', 'Modpack Ready', 'Priority Support'],
    popular: true
  },
  {
    name: 'Ultimate',
    price: 'RM50',
    period: '/month',
    features: ['12GB RAM', 'Dedicated Resources', 'Instant Setup'],
    popular: false
  },
  {
    name: 'Enterprise',
    price: 'RM100',
    period: '/month',
    features: ['24GB RAM', 'Full Customization', '24/7 Support'],
    popular: false
  }
];

// Feature flag to control pricing section visibility
const SHOW_PRICING_SECTION: boolean = false;

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

// Scroll reveal hook for sections
function useScrollRevealEffect() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.9);
  const [opacity, setOpacity] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
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
            setIsInView(false);
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

  return { ref, scale, opacity, isInView };
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
        transition={{ duration: 0 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function Home({ onNavigate }: HomeProps) {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroOpacityTransform = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background" />
        
        <motion.div 
          className="hero-container"
          style={{ y: heroY, opacity: heroOpacityTransform }}
        >
          {/* Top Logo */}
          <motion.div 
            className="hero-logo-wrapper"
            initial={{ opacity: 0, y: -80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Inline styles added to force the logo to be big like in your image */}
            <img 
              src="/ploofyz-logo.png" 
              alt="Ploofyz" 
              className="hero-logo-centered" 
              style={{ width: '100%', maxWidth: '350px' }} 
            />
          </motion.div>

          {/* Split Content (Video Left, Text Right) */}
          <div className="hero-content-wrapper">
          
          
            {/* Left Side - Video and Buttons */}
            <motion.div 
              className="hero-video-section"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="video-wrapper">
<iframe
  src={YOUTUBE_VIDEO_URL}
  title="Ploofyz Minecraft Trailer"
  loading="lazy"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
></iframe>
 </div>
 {/* Discord Button and IP under Video */}
 <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '8px' }}>
 <a 
  href="https://discord.gg/3uUM25NWWG" 
  target="_blank" 
  rel="noopener noreferrer" 
  className="discord-btn"
  aria-label="Join our Discord server"
  style={{ padding: '12px 24px', fontSize: '15px' }}
>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  Join Our Discord
                </a>
                <h3 style={{ color: 'white', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>play.ploofyz.com</h3>
              </div>
            </motion.div>

            {/* Right Side - Typography */}
            <motion.div 
              className="hero-content-section"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ alignItems: 'flex-start', textAlign: 'left' }}
            >
              <h2 className="hero-title" style={{ fontSize: '3.5rem', lineHeight: '1.2' }}>
                <span style={{ color: '#a78bfa' }}>A Minecraft</span><br />
                <span style={{ color: '#8b5cf6' }}>Adventure</span><br />
                <span style={{ color: '#6366f1' }}>Told in</span><br />
                <span style={{ color: '#3b82f6' }}>Chapters.</span>
              </h2>
              <p className="hero-subtitle" style={{ maxWidth: '400px' }}>
                A story through quests while keeping the survival Minecraft experience.
              </p>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* Team Section with Scroll Reveal */}
      <ScrollScaleSection>
        <section className="team-section">
          <TeamCarousel />
        </section>
      </ScrollScaleSection>

      {/* Ranks Section with Scroll Reveal */}
      <ScrollScaleSection>
        <section className="ranks-section">
          <AnimatedSection>
            <motion.div className="section-header" variants={fadeInUp}>
              <h2 className="section-title heading-lg">Server Ranks</h2>
              <p className="body-lg">
                Upgrade your experience with premium ranks that unlock commands, 
                utilities, and exclusive perks.
              </p>
            </motion.div>

            <div className="ranks-grid">
              {ranks.map((rank) => (
                <motion.div
                  key={rank.name}
                  className={`rank-card ${rank.name.toLowerCase()}`}
                  variants={fadeInUp}
                  whileHover={{ y: -8, transition: { duration: 0.15 } }}
                  onClick={() => onNavigate('ranks')}
                  style={{ cursor: 'pointer' }}
                >
                  <h3 className="rank-name" style={{ color: rank.color }}>
                    {rank.name}
                  </h3>
                  <p className="rank-description">{rank.description}</p>
                  <span className="rank-duration">{rank.duration}</span>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </section>
      </ScrollScaleSection>

      {/* Pricing Section with Scroll Reveal */}
      {SHOW_PRICING_SECTION && (
        <ScrollScaleSection>
          <section className="pricing-section" id="pricing">
            <AnimatedSection>
              <motion.div className="section-header" variants={fadeInUp}>
                <h2 className="section-title heading-lg">Choose Your Plan</h2>
                <p className="body-lg">
                  Flexible plans designed for every type of Minecraft server, 
                  from small communities to large networks.
                </p>
              </motion.div>

              <div className="pricing-grid">
                {pricingPlans.map((plan) => (
                  <motion.div
                    key={plan.name}
                    className={`price-card ${plan.popular ? 'popular' : ''}`}
                    variants={fadeInUp}
                    whileHover={{ y: -8, transition: { duration: 0.15 } }}
                  >
                    {plan.popular && (
                      <span className="popular-badge">Most Popular</span>
                    )}
                    <h3 className="price-name">{plan.name}</h3>
                    <div className="price-amount">{plan.price}</div>
                    <p className="price-period">{plan.period}</p>
                    <ul className="price-features">
                      {plan.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                    <button className="btn-primary" style={{ width: '100%' }}>
                      Get Started
                    </button>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </section>
        </ScrollScaleSection>
      )}

      {/* CTA Section with Scroll Reveal */}
      <ScrollScaleSection>
        <section className="cta-section">
          <AnimatedSection>
            <motion.div className="cta-content" variants={fadeInUp}>
              <h2 className="cta-title heading-md">
                Ready to Experience Ploofyz?
              </h2>
              <button 
                className="discord-btn"
                onClick={() => onNavigate('join')}
              >
                Join Our Discord
                <ArrowRight size={18} />
              </button>
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
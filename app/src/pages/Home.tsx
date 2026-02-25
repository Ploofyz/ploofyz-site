import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation, useScroll, useTransform, type Variants } from 'framer-motion';
import { ArrowRight, Zap, Shield, Globe, ChevronDown } from 'lucide-react';
import type { Page } from '../App';

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

// Feature data
const features = [
  {
    icon: <Zap size={28} />,
    title: 'Fast. Stable. Ready.',
    description: 'High-performance servers built for smooth gameplay with server processors and NVMe storage.'
  },
  {
    icon: <Shield size={28} />,
    title: 'Protected by Design',
    description: 'Enterprise grade DDoS protection keeps our server online and secure 24/7.'
  },
  {
    icon: <Globe size={28} />,
    title: 'Closer to You',
    description: 'Malaysia-based hosting for better connection across Southeast Asia with low latency.'
  }
];

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
    color: '#F59E0B'
  },
  {
    name: 'Nexus',
    description: 'Permanent rank with powerful utilities and reduced costs.',
    duration: 'Permanent',
    color: '#F97316'
  },
  {
    name: 'Phantom',
    description: 'Top-tier rank with maximum perks and full command access.',
    duration: 'Permanent',
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
            // Smooth animation to full scale
            let startTime: number | null = null;
            const duration = 600;
            
            const animate = (timestamp: number) => {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
              
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
  // Scroll-based transforms for hero
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroScaleTransform = useTransform(scrollY, [0, 500], [1, 0.85]);
  const heroOpacityTransform = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="home-page">
      {/* Hero Section with Scroll Scale Effect */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as const }}
          style={{
            y: heroY,
            scale: heroScaleTransform,
            opacity: heroOpacityTransform,
          }}
        >
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Zap size={14} />
            <span>Now Available in SEA</span>
          </motion.div>

          <motion.h1
            className="hero-title heading-xl gradient-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Play Better. Instantly.
          </motion.h1>

          <motion.p
            className="hero-subtitle body-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Upgrade your Minecraft experience with, 
            exclusive ranks, and instant delivery.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <button 
              className="btn-primary"
              onClick={() => onNavigate('store')}
            >
              Shop Now
              <ArrowRight size={18} />
            </button>
            <button 
              className="btn-secondary"
              onClick={() => onNavigate('about')}
            >
              Learn More
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          style={{ opacity: heroOpacityTransform }}
        >
          <span>Scroll to explore</span>
          <ChevronDown size={20} />
        </motion.div>
      </section>

      {/* Features Section with Scroll Reveal */}
      <ScrollScaleSection>
        <section className="features-section">
          <AnimatedSection>
            <motion.div className="section-header" variants={fadeInUp}>
              <h2 className="section-title heading-lg">Why Choose Ploofyz?</h2>
              <p className="body-lg">
                Experience Minecraft server with lot of stuff 
                you can do and easter egg.
              </p>
            </motion.div>

            <div className="features-grid">
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  className="feature-card"
                  variants={fadeInUp}
                  whileHover={{ y: -8, transition: { duration: 0.15 } }}
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
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
                Ready to Experience Plooyz?
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

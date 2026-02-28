import { useRef, useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { MessageCircle, ExternalLink, Users, Headphones, Gamepad2, ArrowRight } from 'lucide-react';

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
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

// Features data
const discordFeatures = [
  {
    icon: <Users size={24} />,
    title: 'Active Community',
    description: 'Connect with hundreds of players'
  },
  {
    icon: <Headphones size={24} />,
    title: '24/7 Support',
    description: 'Get help whenever you need it'
  },
  {
    icon: <Gamepad2 size={24} />,
    title: 'Events & Updates',
    description: 'Be the first to know about events'
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

export default function Join() {
  return (
    <div className="join-page">
      {/* Hero Section */}
      <section className="join-hero-section">
        <motion.div
          className="join-hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as const }}
        >
          <motion.div
            className="join-hero-icon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MessageCircle size={48} />
          </motion.div>

          <motion.h1
            className="join-hero-title heading-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Join Our <span className="gradient-text">Community</span>
          </motion.h1>

          <motion.p
            className="join-hero-subtitle body-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Connect with other players, get support, and stay updated with 
            the latest news on our Discord server.
          </motion.p>

          <motion.a
            href="https://discord.gg/G7kZvTtHav"
            target="_blank"
            rel="noopener noreferrer"
            className="discord-btn-large"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle size={24} />
            Join Discord Server
            <ExternalLink size={18} />
          </motion.a>
        </motion.div>
      </section>

      {/* Features Section */}
      <ScrollScaleSection>
        <section className="join-features-section">
          <motion.div
            className="join-features-grid"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {discordFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                className="join-feature-card"
                variants={fadeInUp}
                whileHover={{ y: -4, transition: { duration: 0.15 } }}
              >
                <div className="join-feature-icon">{feature.icon}</div>
                <h3 className="join-feature-title">{feature.title}</h3>
                <p className="join-feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </ScrollScaleSection>

      {/* Store Section */}
      <ScrollScaleSection>
        <section className="join-store-section">
          <motion.div
            className="join-store-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <div className="join-store-icon">
              <ExternalLink size={32} />
            </div>
            <h2 className="join-store-title heading-md gradient-text-gold">
              Server Store
            </h2>
            <p className="body-lg">
              Support the server and get in-game currency, ranks, and exclusive items!
            </p>
            <a
              href="https://ploofyz.tebex.io"
              target="_blank"
              rel="noopener noreferrer"
              className="store-btn-gold"
            >
              Visit Store
              <ArrowRight size={18} />
            </a>
          </motion.div>
        </section>
      </ScrollScaleSection>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">© 2026 Ploofyz. All rights reserved.</p>
      </footer>
    </div>
  );
}

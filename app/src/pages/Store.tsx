import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation, type Variants } from 'framer-motion';
import { 
  Coins, 
  Crown, 
  Gift, 
  Sparkles, 
  Zap, 
  Key,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';

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

// Categories data
const categories = [
  {
    icon: <Coins size={40} />,
    title: 'In-Game Currency',
    description: 'Buy coins to unlock items, upgrades, and special perks on the server.',
    badge: 'Popular',
    badgeColor: '#fbbf24',
    gradient: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.1))'
  },
  {
    icon: <Crown size={40} />,
    title: 'Premium Ranks',
    description: 'Unlock VIP, Elite, Hero, Nexus, and Phantom ranks with exclusive commands.',
    badge: 'Best Value',
    badgeColor: '#6366f1',
    gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(79, 70, 229, 0.1))'
  },
  {
    icon: <Gift size={40} />,
    title: 'Special Bundles',
    description: 'Limited-time packages with bonus items and amazing discounts.',
    badge: 'Coming Soon',
    badgeColor: '#f97316',
    gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 88, 12, 0.1))'
  },
  {
    icon: <Sparkles size={40} />,
    title: 'Cosmetics',
    description: 'Stand out with unique particle effects, pets, and custom items.',
    badge: 'Coming Soon',
    badgeColor: '#a855f7',
    gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.1))'
  },
  {
    icon: <Zap size={40} />,
    title: 'Boosters',
    description: 'Temporary XP, drop rate, and economy multipliers for faster progress.',
    badge: 'Coming Soon',
    badgeColor: '#06b6d4',
    gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(8, 145, 178, 0.1))'
  },
  {
    icon: <Key size={40} />,
    title: 'Crate Keys',
    description: 'Unlock mystery crates for rare items, resources, and exclusive rewards.',
    badge: 'Coming Soon',
    badgeColor: '#eab308',
    gradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(202, 138, 4, 0.1))'
  }
];

// Benefits data
const benefits = [
  {
    icon: <Zap size={32} />,
    title: 'Instant Delivery',
    description: 'Items delivered to your account immediately after purchase'
  },
  {
    icon: <ShoppingBag size={32} />,
    title: 'Secure Payment',
    description: 'Protected by Tebex with multiple payment options'
  },
  {
    icon: <Coins size={32} />,
    title: 'Great Value',
    description: 'Competitive prices with frequent sales and bundles'
  },
  {
    icon: <Crown size={32} />,
    title: 'Support Server',
    description: 'Your purchases help keep the server running and improving'
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

export default function Store() {
  return (
    <div className="store-page">
      {/* Hero Section */}
      <section className="store-hero-section">
        <motion.div
          className="store-hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as const }}
        >
          <motion.div
            className="store-hero-icon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ShoppingBag size={48} />
          </motion.div>

          <motion.h1
            className="store-hero-title heading-lg gradient-text-gold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Server Store
          </motion.h1>

          <motion.p
            className="store-hero-subtitle body-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Level up your gameplay with exclusive items, ranks, and perks. 
            Support the server while enhancing your experience.
          </motion.p>

          <motion.a
            href="https://ploofyz.tebex.io"
            target="_blank"
            rel="noopener noreferrer"
            className="store-btn-gold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Open Store Now
            <ArrowRight size={18} />
          </motion.a>
        </motion.div>
      </section>

      {/* Categories Section */}
      <ScrollScaleSection>
        <section className="categories-section">
          <AnimatedSection>
            <motion.div className="section-header" variants={fadeInUp}>
              <h2 className="section-title heading-md">Browse Categories</h2>
              <p className="body-lg">
                Explore our wide range of products designed to enhance your gameplay.
              </p>
            </motion.div>

            <div className="categories-grid">
              {categories.map((category) => (
                <motion.div
                  key={category.title}
                  className="category-card"
                  variants={fadeInUp}
                  whileHover={{ y: -8, transition: { duration: 0.15 } }}
                  style={{ background: category.gradient }}
                >
                  <span 
                    className="category-badge"
                    style={{ background: category.badgeColor }}
                  >
                    {category.badge}
                  </span>
                  <div className="category-icon">{category.icon}</div>
                  <h3 className="category-title">{category.title}</h3>
                  <p className="category-description">{category.description}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </section>
      </ScrollScaleSection>

      {/* Benefits Section */}
      <ScrollScaleSection>
        <section className="benefits-section">
          <AnimatedSection>
            <motion.div className="section-header" variants={fadeInUp}>
              <h2 className="section-title heading-md">Why Shop With Us?</h2>
              <p className="body-lg">
                We ensure the best shopping experience with instant delivery and secure payments.
              </p>
            </motion.div>

            <div className="benefits-grid">
              {benefits.map((benefit) => (
                <motion.div
                  key={benefit.title}
                  className="benefit-card"
                  variants={fadeInUp}
                  whileHover={{ y: -4, transition: { duration: 0.15 } }}
                >
                  <div className="benefit-icon">{benefit.icon}</div>
                  <h4 className="benefit-title">{benefit.title}</h4>
                  <p className="benefit-description">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </section>
      </ScrollScaleSection>

      {/* CTA Section */}
      <ScrollScaleSection>
        <section className="store-cta-section">
          <AnimatedSection>
            <motion.div className="store-cta-content" variants={fadeInUp}>
              <h2 className="store-cta-title heading-md">
                Ready to Upgrade?
              </h2>
              <p className="body-lg">
                Visit our store and start enhancing your Minecraft experience today.
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

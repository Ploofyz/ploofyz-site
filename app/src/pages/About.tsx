import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation, type Variants } from 'framer-motion';
import { Cpu, Shield, Globe, Zap, Server, Users } from 'lucide-react';

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
      delayChildren: 0.1
    }
  }
};

// Stats data
const stats = [
  { value: '99.9%', label: 'Uptime Guarantee', icon: <Zap size={24} /> },
  { value: '24/7', label: 'Support Available', icon: <Users size={24} /> },
  { value: 'SEA', label: 'Server Location', icon: <Globe size={24} /> },
  { value: 'Ryzen', label: 'Processors', icon: <Cpu size={24} /> }
];

// Features data
const features = [
  {
    icon: <Server size={32} />,
    title: 'High-Performance Hardware',
    description: 'Our servers are powered by the latest AMD Ryzen processors and NVMe SSD storage, ensuring lightning-fast performance for your Minecraft worlds.'
  },
  {
    icon: <Shield size={32} />,
    title: 'Enterprise Security',
    description: 'With advanced DDoS protection and automated backups, your server data is always safe and secure. We prioritize your peace of mind.'
  },
  {
    icon: <Globe size={32} />,
    title: 'Optimized for SEA',
    description: 'Strategically located in Malaysia, our servers provide the lowest possible latency for players across Southeast Asia.'
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

export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <motion.div
          className="about-hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as const }}
        >
          <motion.span
            className="about-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            About Us
          </motion.span>

          <motion.h1
            className="about-title heading-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Your Trusted Partner for
            <span className="gradient-text"> Minecraft Hosting</span>
          </motion.h1>

          <motion.p
            className="about-subtitle body-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            We started with a simple mission: to provide fast, stable, and powerful 
            Minecraft hosting that&apos;s optimized for Malaysian, Singaporean, and SEA players.
          </motion.p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <ScrollScaleSection>
        <section className="stats-section">
          <AnimatedSection>
            <div className="stats-grid">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  className="stat-card"
                  variants={fadeInUp}
                  whileHover={{ y: -4, transition: { duration: 0.15 } }}
                >
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </section>
      </ScrollScaleSection>

      {/* Story Section */}
      <ScrollScaleSection>
        <section className="story-section">
          <AnimatedSection>
            <div className="story-content">
              <motion.div className="story-text" variants={fadeInUp}>
                <h2 className="story-title heading-md">Our Story</h2>
                <div className="story-paragraphs">
                  <p className="body-md">
                    Welcome to Ploofyz, your trusted partner for high-performance Minecraft 
                    server hosting in Southeast Asia. Founded by passionate gamers and 
                    tech enthusiasts, we understand the importance of a smooth, lag-free 
                    gaming experience.
                  </p>
                  <p className="body-md">
                    Our servers are powered by high-performance Ryzen processors, ensuring 
                    smooth gameplay even with heavy modpacks. With enterprise-grade DDoS 
                    protection, your world stays online 24/7, giving you and your players 
                    the reliability you deserve.
                  </p>
                  <p className="body-md">
                    Whether you&apos;re running a small survival server with friends or managing 
                    a large community, we have the perfect plan for you. Our team is dedicated 
                    to providing exceptional support and continuously improving our infrastructure 
                    to meet your needs.
                  </p>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </section>
      </ScrollScaleSection>

      {/* Features Section */}
      <ScrollScaleSection>
        <section className="about-features-section">
          <AnimatedSection>
            <motion.div className="section-header" variants={fadeInUp}>
              <h2 className="section-title heading-md">What Sets Us Apart</h2>
              <p className="body-lg">
                We combine cutting-edge technology with exceptional service to deliver 
                the best Minecraft hosting experience.
              </p>
            </motion.div>

            <div className="about-features-grid">
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  className="about-feature-card"
                  variants={fadeInUp}
                  whileHover={{ y: -8, transition: { duration: 0.15 } }}
                >
                  <div className="about-feature-icon">{feature.icon}</div>
                  <h3 className="about-feature-title">{feature.title}</h3>
                  <p className="about-feature-description">{feature.description}</p>
                </motion.div>
              ))}
            </div>
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

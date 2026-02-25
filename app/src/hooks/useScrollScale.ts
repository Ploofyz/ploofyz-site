import { useState, useEffect, useRef } from 'react';

interface ScrollScaleOptions {
  minScale?: number;
  maxScale?: number;
  scaleUpThreshold?: number;
  scaleDownThreshold?: number;
}

export function useScrollScale(options: ScrollScaleOptions = {}) {
  const {
    minScale = 0.85,
    maxScale = 1.15,
    scaleUpThreshold = 100,
    scaleDownThreshold = 50,
  } = options;

  const [scale, setScale] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDelta = currentScrollY - lastScrollY.current;
          
          // Calculate scale based on scroll direction and position
          let newScale = scale;
          
          if (scrollDelta > 0) {
            // Scrolling down - scale up
            const scrollProgress = Math.min(currentScrollY / scaleUpThreshold, 1);
            newScale = 1 + (maxScale - 1) * scrollProgress;
          } else if (scrollDelta < 0) {
            // Scrolling up - scale down
            const scrollProgress = Math.min(currentScrollY / scaleDownThreshold, 1);
            newScale = minScale + (1 - minScale) * (1 - scrollProgress);
          }
          
          // Clamp scale between min and max
          newScale = Math.max(minScale, Math.min(maxScale, newScale));
          
          setScale(newScale);
          setIsVisible(currentScrollY < window.innerHeight * 1.5);
          
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scale, minScale, maxScale, scaleUpThreshold, scaleDownThreshold]);

  return { scale, isVisible };
}

// Hook for parallax scroll effect
export function useParallaxScroll(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setOffset(window.scrollY * speed);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return offset;
}

// Hook for scroll-triggered reveal with scale
export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealScale, setRevealScale] = useState(0.9);
  const [revealOpacity, setRevealOpacity] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            // Animate to full scale and opacity
            const animate = () => {
              setRevealScale((prev) => {
                const next = prev + (1 - prev) * 0.1;
                if (next > 0.99) return 1;
                requestAnimationFrame(animate);
                return next;
              });
              setRevealOpacity((prev) => {
                const next = prev + (1 - prev) * 0.1;
                if (next > 0.99) return 1;
                return next;
              });
            };
            animate();
          } else {
            setIsRevealed(false);
            setRevealScale(0.9);
            setRevealOpacity(0);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '-50px 0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, isRevealed, revealScale, revealOpacity };
}

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import type { Page } from '../App';

import './Navigation.css';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
 /* { label: 'About', page: 'about' }, */
  { label: 'Store', page: 'store' },
  { label: 'Join', page: 'join' },
  { label: 'Ranks', page: 'ranks' },
  { label: 'Vote', page: 'vote' },
  { label: 'Skull Race', page: 'skull-race' },
];

// Searchable content for each page
const searchableContent: Record<Page, { title: string; content: string; section: string }[]> = {
  home: [
    { title: 'Play Better. Instantly.', content: 'Upgrade your Minecraft experience with premium hosting', section: 'Hero' },
    { title: 'Fast. Stable. Ready.', content: 'High-performance servers built for smooth gameplay', section: 'Features' },
    { title: 'Protected by Design', content: 'Enterprise-grade DDoS protection keeps your server online', section: 'Features' },
  //  { title: 'Closer to You', content: 'Malaysia-based hosting for better connection across SEA', section: 'Features' },
    { title: 'Server Ranks', content: 'VIP, Elite, Hero, Nexus, Phantom ranks with exclusive perks', section: 'Ranks' },
  //  { title: 'Choose Your Plan', content: 'Basic, Starter, Pro, Ultimate, Enterprise plans', section: 'Pricing' },
  ],
  about: [
  //  { title: 'About Us', content: 'Your trusted partner for Minecraft hosting in Southeast Asia', section: 'Hero' },
  //  { title: '99.9% Uptime Guarantee', content: 'Reliable server performance', section: 'Stats' },
  //  { title: '24/7 Support Available', content: 'Always here to help', section: 'Stats' },
  //  { title: 'Our Story', content: 'Founded by passionate gamers and tech enthusiasts', section: 'Story' },
  //  { title: 'High-Performance Hardware', content: 'AMD Ryzen processors and NVMe SSD storage', section: 'Features' },
  ], 
  store: [
    { title: 'Server Store', content: 'Level up your gameplay with exclusive items and ranks', section: 'Hero' },
    { title: 'In-Game Currency', content: 'Buy coins to unlock items and perks', section: 'Categories' },
    { title: 'Premium Ranks', content: 'VIP, Elite, Hero, Nexus, Phantom ranks', section: 'Categories' },
    { title: 'Special Bundles', content: 'Limited-time packages with amazing discounts', section: 'Categories' },
    { title: 'Cosmetics', content: 'Particle effects, pets, and custom items', section: 'Categories' },
    { title: 'Instant Delivery', content: 'Items delivered immediately after purchase', section: 'Benefits' },
  ],
  join: [
    { title: 'Join Our Community', content: 'Connect with other players on Discord', section: 'Hero' },
    { title: 'Active Community', content: 'Connect with hundreds of players', section: 'Features' },
    { title: '24/7 Support', content: 'Get help whenever you need it', section: 'Features' },
    { title: 'Events & Updates', content: 'Be the first to know about events', section: 'Features' },
    { title: 'Server Store', content: 'Support the server and get exclusive items', section: 'Store' },
  ],
  vote: [
    { title: 'Vote for Ploofyz', content: 'Vote on server listing sites to earn in-game rewards', section: 'Hero' },
    { title: 'Daily Rewards', content: 'Get coins, items, and exclusive perks every time you vote', section: 'Rewards' },
    { title: 'Streak Bonuses', content: 'Vote consistently to unlock streak rewards and multipliers', section: 'Rewards' },
    { title: 'Special Items', content: 'Unlock rare cosmetics and exclusive in-game items', section: 'Rewards' },
  ],
  ranks: [
    { title: 'Server Ranks', content: 'Choose your rank to unlock exclusive perks', section: 'Hero' },
    { title: 'VIP Rank', content: 'Starter premium rank with chat badge and name color', section: 'Ranks' },
    { title: 'Elite Rank', content: 'More utilities and crafting access', section: 'Ranks' },
    { title: 'Hero Rank', content: 'Advanced tools and repair features', section: 'Ranks' },
    { title: 'Nexus Rank', content: 'Permanent rank with powerful utilities', section: 'Ranks' },
    { title: 'Phantom Rank', content: 'Top-tier rank with maximum perks', section: 'Ranks' },
  ],
  'skull-race': [
    { title: 'Skull Race', content: 'Weekly event for individual and team categories', section: 'Hero' },
    { title: 'Weekly Prize', content: '1x Wither Skull awarded to top individual and team', section: 'Prize' },
    { title: 'Individual', content: 'Based on solo player balance, win once per month', section: 'Rules' },
    { title: 'Team', content: 'Based on BetterTeams balance, win up to 2 times per month', section: 'Rules' },
  ],
  admin: [],
};

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ page: Page; item: typeof searchableContent[Page][0] }[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search functionality
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setSearchResults([]);
      return;
    }

    const results: { page: Page; item: typeof searchableContent[Page][0] }[] = [];
    
    (Object.keys(searchableContent) as Page[]).forEach((page) => {
      searchableContent[page].forEach((item) => {
        if (
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query) ||
          item.section.toLowerCase().includes(query)
        ) {
          results.push({ page, item });
        }
      });
    });

    setSearchResults(results.slice(0, 8));
  }, [searchQuery]);

  const handleSearchResultClick = (page: Page) => {
    handleNavClick(page);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <motion.header
        className={`nav-container ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
      >
        <div className="nav-inner">
          {/* Social Icons - Left */}
          <div className="nav-socials">
            <a href="https://www.tiktok.com/@ploofyz" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="TikTok">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
              </svg>
            </a>
            <a href="https://discord.gg/3uUM25NWWG" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Discord">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
            <a href="https://www.youtube.com/@ploofyz" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="nav-links">
            {navItems.map((item) => (
              <button
                key={item.page}
                className={`nav-link ${currentPage === item.page ? 'active' : ''}`}
                onClick={() => handleNavClick(item.page)}
              >
                {item.label}
              </button>
            ))}
            <button
              className="nav-link"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search size={16} />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            style={{ gridColumn: '3', justifySelf: 'end' }}
          >
            <span className="menu-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu-overlay open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <motion.div
        className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
        initial={false}
        animate={{ x: isMobileMenuOpen ? 0 : '100%' }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as const }}
      >
        <div className="mobile-socials">
          <a href="https://www.tiktok.com/@ploofyz" target="_blank" rel="noopener noreferrer" className="mobile-social-link" aria-label="TikTok">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
            </svg>
          </a>
          <a href="https://discord.gg/3uUM25NWWG" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Discord">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </a>
          <a href="https://www.youtube.com/@ploofyz" target="_blank" rel="noopener noreferrer" className="mobile-social-link" aria-label="YouTube">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
        {navItems.map((item, index) => (
          <motion.button
            key={item.page}
            className={`mobile-nav-link ${currentPage === item.page ? 'active' : ''}`}
            onClick={() => handleNavClick(item.page)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: isMobileMenuOpen ? 1 : 0, 
              x: isMobileMenuOpen ? 0 : 20 
            }}
            transition={{ 
              duration: 0.3, 
              delay: isMobileMenuOpen ? index * 0.05 : 0,
              ease: [0.4, 0, 0.2, 1] as const
            }}
          >
            {item.label}
          </motion.button>
        ))}
        <motion.button
          className="mobile-nav-link"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsSearchOpen(true);
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ 
            opacity: isMobileMenuOpen ? 1 : 0, 
            x: isMobileMenuOpen ? 0 : 20 
          }}
          transition={{ 
            duration: 0.3, 
            delay: isMobileMenuOpen ? navItems.length * 0.05 : 0,
            ease: [0.4, 0, 0.2, 1] as const
          }}
        >
          Search
        </motion.button>
      </motion.div>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="search-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="search-content"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="search-header">
                <h2>Search</h2>
                <button
                  className="search-close-btn"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  aria-label="Close search"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="search-input-wrapper">
                <Search size={20} className="search-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="search-input"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Search Results */}
              <div className="search-results">
                {searchQuery.trim() && searchResults.length === 0 && (
                  <p className="search-no-results">No results found for &quot;{searchQuery}&quot;</p>
                )}
                {searchResults.length > 0 && (
                  <div className="search-results-list">
                    <p className="search-results-count">{searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</p>
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        className="search-result-item"
                        onClick={() => handleSearchResultClick(result.page)}
                      >
                        <div className="search-result-header">
                          <span className="search-result-title">{result.item.title}</span>
                          <span className="search-result-page">{result.page}</span>
                        </div>
                        <p className="search-result-content">{result.item.content}</p>
                        <span className="search-result-section">{result.item.section}</span>
                      </button>
                    ))}
                  </div>
                )}
                {!searchQuery.trim() && (
                  <div className="search-hints">
                    <p>Try searching for: ranks, pricing, discord, store</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

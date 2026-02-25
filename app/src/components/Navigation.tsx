import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import type { Page } from '../App';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'About', page: 'about' },
  { label: 'Store', page: 'store' },
  { label: 'Join', page: 'join' },
  { label: 'Ranks', page: 'ranks' },
];

// Searchable content for each page
const searchableContent: Record<Page, { title: string; content: string; section: string }[]> = {
  home: [
    { title: 'Play Better. Instantly.', content: 'Upgrade your Minecraft experience with premium hosting', section: 'Hero' },
    { title: 'Fast. Stable. Ready.', content: 'High-performance servers built for smooth gameplay', section: 'Features' },
    { title: 'Protected by Design', content: 'Enterprise-grade DDoS protection keeps your server online', section: 'Features' },
    { title: 'Closer to You', content: 'Malaysia-based hosting for better connection across SEA', section: 'Features' },
    { title: 'Server Ranks', content: 'VIP, Elite, Hero, Nexus, Phantom ranks with exclusive perks', section: 'Ranks' },
    { title: 'Choose Your Plan', content: 'Basic, Starter, Pro, Ultimate, Enterprise hosting plans', section: 'Pricing' },
  ],
  about: [
    { title: 'About Us', content: 'Your trusted partner for Minecraft hosting in Southeast Asia', section: 'Hero' },
    { title: '99.9% Uptime Guarantee', content: 'Reliable server performance', section: 'Stats' },
    { title: '24/7 Support Available', content: 'Always here to help', section: 'Stats' },
    { title: 'Our Story', content: 'Founded by passionate gamers and tech enthusiasts', section: 'Story' },
    { title: 'High-Performance Hardware', content: 'AMD Ryzen processors and NVMe SSD storage', section: 'Features' },
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
  ranks: [
    { title: 'Server Ranks', content: 'Choose your rank to unlock exclusive perks', section: 'Hero' },
    { title: 'VIP Rank', content: 'Starter premium rank with chat badge and name color', section: 'Ranks' },
    { title: 'Elite Rank', content: 'More utilities and crafting access', section: 'Ranks' },
    { title: 'Hero Rank', content: 'Advanced tools and repair features', section: 'Ranks' },
    { title: 'Nexus Rank', content: 'Permanent rank with powerful utilities', section: 'Ranks' },
    { title: 'Phantom Rank', content: 'Top-tier rank with maximum perks', section: 'Ranks' },
  ],
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
      if (window.innerWidth > 768) {
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
          {/* Logo */}
          <motion.div
            className="nav-logo"
            onClick={() => handleNavClick('home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src="ploofyz-logo.png" alt="Ploofyz" />
          </motion.div>

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
                    <p>Try searching for: ranks, pricing, hosting, discord, store, VIP, Pro plan</p>
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

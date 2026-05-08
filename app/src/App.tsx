import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import Navigation from './components/Navigation';
import Home from './pages/Home';
// import About from './pages/About';
import Store from './pages/Store';
import Join from './pages/Join';
import ServerRanks from './pages/ServerRanks';
import Vote from './pages/Vote';
import SkullRace from './pages/SkullRace';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import './App.css';

export type Page = 'home' | 'about' | 'store' | 'join' | 'ranks' | 'vote' | 'skull-race' | 'admin';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname === '/admin';
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdminLoggedIn(!!session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const navigateTo = (page: Page) => {
    navigate(page === 'home' ? '/' : `/${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Page transition variants
  const pageVariants: Variants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  // Loading screen
  if (isAdminRoute && authLoading) return null;

  if (isAdminRoute) {
    if (isAdminLoggedIn) {
      return <AdminDashboard onLogout={() => { setIsAdminLoggedIn(false); }} />;
    }
    return <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />;
  }

  if (isLoading) {
    return (
      <motion.div
        className="loading-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="loading-logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
        >
          <img src="/ploofyz-logo.png" alt="Ploofyz" />
        </motion.div>
        <motion.div
          className="loading-bar"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] as const }}
        />
      </motion.div>
    );
  }

  const currentPage = (location.pathname === '/' ? 'home' : location.pathname.slice(1)) as Page;

  return (
    <div className="app">
      {/* Background Glow Effect */}
      <div className="bg-glow" />

      {/* Navigation */}
      <Navigation currentPage={currentPage} onNavigate={navigateTo} />

      {/* Main Content with Page Transitions */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="page-container"
          >
            <Routes>
              <Route path="/" element={<Home onNavigate={navigateTo} />} />
              <Route path="/store" element={<Store />} />
              {/*currentPage === 'about' && <About />} */}
              <Route path="/join" element={<Join />} />
              <Route path="/ranks" element={<ServerRanks />} />
              <Route path="/vote" element={<Vote />} />
              <Route path="/skull-race" element={<SkullRace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;

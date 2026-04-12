import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Leadership', path: '/leadership' },
    { name: 'Participations', path: '/participations' },
    { name: 'Certifications', path: '/certifications' },
    { name: 'Academics', path: '/academics' },
  ];

  if (location.pathname.startsWith('/admin/dashboard')) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] px-6 pt-6 flex justify-center pointer-events-none">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto flex items-center justify-between w-full max-w-6xl px-8 py-3 transition-all duration-500 rounded-full border ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl border-gray-100 shadow-sm' 
            : 'bg-transparent border-transparent'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2">
          <div className="w-2 h-2 bg-black rounded-full" />
          <span className="text-[11px] font-medium tracking-[0.2em] text-black uppercase">
            Naren Selvan
          </span>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <motion.div
                key={link.path}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <Link 
                  to={link.path} 
                  className={`relative px-4 py-2 text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 font-mono ${
                    isActive ? 'text-black font-bold' : 'text-gray-500 hover:text-black font-medium'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="navbar-underline"
                      className="absolute bottom-1.5 left-4 right-4 h-px bg-black"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Action button - Premium Look */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center"
        >
          <a 
            href="mailto:contact@narenselvan.com"
            className="px-6 py-2.5 bg-black text-white text-[10px] tracking-[0.2em] uppercase rounded-full font-bold font-mono"
          >
            Connect
          </a>
        </motion.div>
      </motion.nav>
    </div>
  );
};

export default Navbar;
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

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
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-6 pt-4 md:pt-6 flex justify-center pointer-events-none">
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto flex items-center justify-between w-full max-w-6xl px-6 md:px-8 py-3 transition-all duration-500 rounded-full border ${
            scrolled 
              ? 'bg-white/80 backdrop-blur-xl border-gray-100 shadow-sm' 
              : 'bg-transparent border-transparent'
          }`}
        >
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2 z-[110]" onClick={() => setIsMenuOpen(false)}>
            <div className="w-2 h-2 bg-black rounded-full" />
            <span className="text-[11px] font-medium tracking-[0.2em] text-black uppercase">
              Naren Selvan
            </span>
          </Link>
          
          {/* Desktop Navigation Links */}
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

          <div className="flex items-center gap-4">
            {/* Desktop Connect Button */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center"
            >
              <a 
                href="mailto:contact@narenselvan.com"
                className="px-6 py-2.5 bg-black text-white text-[10px] tracking-[0.2em] uppercase rounded-full font-bold font-mono"
              >
                Connect
              </a>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden z-[110] p-2 text-black"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-[90] md:hidden bg-white/95 backdrop-blur-2xl flex flex-col justify-center px-10"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link 
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-4xl font-display font-medium tracking-tighter ${
                      location.pathname === link.path ? 'text-black' : 'text-gray-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-8 mt-8 border-t border-gray-100"
              >
                 <a 
                  href="mailto:contact@narenselvan.com"
                  className="inline-block px-12 py-5 bg-black text-white text-[11px] tracking-[0.3em] uppercase rounded-full font-bold font-mono shadow-xl"
                >
                  Start Collaboration
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
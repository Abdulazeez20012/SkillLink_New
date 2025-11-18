import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Programs', path: '#programs' },
    { name: 'Community', path: '#community' },
    { name: 'About', path: '#mission' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-lg py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Logo - Compact */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.img 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              src="https://res.cloudinary.com/dwiewdn6f/image/upload/v1763405995/semicolon_wlxrru.png" 
              alt="SkillLink Logo" 
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-xl font-bold tracking-tight">
              Skill<span className="text-brand-red">Link</span>
            </span>
          </Link>

          {/* Desktop Navigation - Sleek Pills */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100/80 backdrop-blur-sm rounded-full px-2 py-1.5">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.path}
                  className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:text-brand-red hover:bg-white rounded-full transition-all duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
            
            <Link
              to="/login"
              className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:text-brand-red transition-colors"
            >
              Login
            </Link>
            
            <Link
              to="/register/student"
              className="bg-brand-red text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-red-700 hover:shadow-red transition-all duration-300 hover:scale-105"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation - Sleek Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:text-brand-red hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  >
                    {link.name}
                  </motion.a>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                >
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:text-brand-red hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navLinks.length + 1) * 0.1 }}
                >
                  <Link
                    to="/register/student"
                    onClick={() => setIsOpen(false)}
                    className="block bg-brand-red text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-red-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;

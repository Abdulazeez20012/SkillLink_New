import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaTwitter, FaLinkedin, FaGithub, FaFacebook, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const footerLinks = {
    company: [
      { name: 'About', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Blog', path: '/blog' },
      { name: 'Contact', path: '/contact' },
    ],
    programs: [
      { name: 'AI Bootcamps', path: '/programs/bootcamps' },
      { name: 'SkillLink Labs', path: '/programs/labs' },
      { name: 'Educator Tools', path: '/programs/educators' },
      { name: 'Enterprise', path: '/enterprise' },
    ],
    resources: [
      { name: 'Community', path: '/community' },
      { name: 'Documentation', path: '/docs' },
      { name: 'Support', path: '/support' },
      { name: 'FAQ', path: '/faq' },
    ],
  };

  const socialLinks = [
    { icon: FaTwitter, url: 'https://twitter.com', label: 'Twitter' },
    { icon: FaLinkedin, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FaGithub, url: 'https://github.com', label: 'GitHub' },
    { icon: FaFacebook, url: 'https://facebook.com', label: 'Facebook' },
    { icon: FaInstagram, url: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <footer ref={ref} className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-4 gap-8 mb-8"
        >
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img 
                src="https://res.cloudinary.com/dwiewdn6f/image/upload/v1763405995/semicolon_wlxrru.png" 
                alt="SkillLink Logo" 
                className="w-8 h-8 rounded-lg object-cover"
              />
              <h3 className="text-2xl font-bold tracking-tight">
                Skill<span className="text-brand-red">Link</span>
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering learners with AI-driven education for a brighter future.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-gray-300">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-brand-red transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-gray-300">Programs</h4>
            <ul className="space-y-2">
              {footerLinks.programs.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-brand-red transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-gray-300">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-brand-red transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Social Links & Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-gray-800 pt-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} SkillLink. All rights reserved.
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.2, y: -2 }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-brand-red hover:text-white transition-all duration-200"
                >
                  <social.icon className="text-lg" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

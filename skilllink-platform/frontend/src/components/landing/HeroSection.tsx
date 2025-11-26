import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Typewriter component
const TypewriterText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }
    }, delay * 1000 + currentIndex * 5); // 5ms per character (very fast)

    return () => clearTimeout(timeout);
  }, [currentIndex, text, delay]);

  return <span>{displayedText}<span className="animate-pulse">|</span></span>;
};

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredAvatar, setHoveredAvatar] = useState<number | null>(null);

  // Community avatars with positions along the radiating lines
  const communityMembers = [
    {
      name: 'Sarah Chen',
      role: 'Student',
      image: 'https://i.pravatar.cc/150?img=1',
      angle: 0,
      radius: 280,
    },
    {
      name: 'Chibuzo',
      role: 'Head Of Facilitator',
      image: 'https://res.cloudinary.com/dwiewdn6f/image/upload/v1763571574/chibuzo_y03y8b.jpg',
      angle: 45,
      radius: 320,
    },
    {
      name: 'Sam Emmanuel',
      role: 'Cheif',
      image: 'https://res.cloudinary.com/dwiewdn6f/image/upload/v1763571573/cheif_vcy7nf.jpg',
      angle: 90,
      radius: 300,
    },
    {
      name: 'David Kim',
      role: 'Facilitator',
      image: 'https://res.cloudinary.com/dwiewdn6f/image/upload/v1763571573/mrdapo_bdeqge.jpg',
      angle: 135,
      radius: 340,
    },
    {
      name: 'Mr Dapo',
      role: 'Facilitator',
      image: 'https://res.cloudinary.com/dwiewdn6f/image/upload/v1763571573/mrdapo_bdeqge.jpg',
      angle: 180,
      radius: 290,
    },
    {
      name: 'James Rodriguez',
      role: 'Student',
      image: 'https://res.cloudinary.com/dwiewdn6f/image/upload/v1763571573/mrdapo_bdeqge.jpg',
      angle: 225,
      radius: 310,
    },
    {
      name: 'Ashley Emanuel',
      role: 'C.O.O',
      image: 'https://res.cloudinary.com/dwiewdn6f/image/upload/v1763571573/Ashley_x0d16z.jpg',
      angle: 270,
      radius: 330,
    },
    {
      name: 'Sam Emmanuel',
      role: 'Cheif',
      image: 'https://res.cloudinary.com/dwiewdn6f/image/upload/v1763571573/cheif_vcy7nf.jpg',
      angle: 315,
      radius: 295,
    },
  ];

  // Calculate position based on angle and radius
  const getPosition = (angle: number, radius: number) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius,
    };
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden pt-20">


      {/* Community Avatars positioned along the lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {communityMembers.map((member, index) => {
          const pos = getPosition(member.angle, member.radius);
          return (
            <motion.div
              key={index}
              className="absolute pointer-events-auto"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.5 + index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              style={{
                left: `calc(50% + ${pos.x}px)`,
                top: `calc(50% + ${pos.y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseEnter={() => setHoveredAvatar(index)}
              onMouseLeave={() => setHoveredAvatar(null)}
            >
              <motion.div
                whileHover={{ scale: 1.2, zIndex: 50 }}
                className="relative"
              >
                <motion.div
                  className="w-16 h-16 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white"
                  animate={{
                    boxShadow: hoveredAvatar === index 
                      ? '0 0 30px rgba(220, 38, 38, 0.6)'
                      : '0 10px 30px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                {/* Pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-red-500"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />

                {/* Hover tooltip */}
                {hoveredAvatar === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow-xl whitespace-nowrap z-50 border border-gray-200"
                  >
                    <p className="font-bold text-gray-900 text-sm">{member.name}</p>
                    <p className="text-xs text-gray-600">{member.role}</p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline with fade-in zoom */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Organize, Collaborate,{' '}
            <br className="hidden md:block" />
            and Grow with{' '}
            <span className="relative inline-block">
              <span className="text-brand-red">SkillLink</span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 bg-brand-red rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </span>
          </motion.h1>

          {/* Subheading with typing effect and overlay */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-10 flex justify-center"
          >
            <div className="relative inline-block">
              {/* Overlay background */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute inset-0 bg-brand-red/10 backdrop-blur-sm rounded-lg -z-10"
              />
              
              {/* Typing text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-lg md:text-xl text-gray-800 font-medium px-6 py-3 leading-relaxed max-w-2xl"
              >
                <TypewriterText 
                  text="Kickstart your learning journey with structured assignments, shared resources, and real-time feedback—all in one interactive platform."
                  delay={0.7}
                />
              </motion.p>
            </div>
          </motion.div>

          {/* CTA Button with bounce/pulse */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.6,
              type: "spring",
              stiffness: 200
            }}
          >
            <motion.button
              onClick={() => navigate('/register/student')}
              className="relative bg-brand-red text-white px-10 py-4 rounded-full text-base font-semibold shadow-red-lg hover:shadow-red transition-all duration-300 group overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
              
              <span className="relative z-10 flex items-center gap-2">
                Explore the Space
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-500 rounded-full"
              />
              <span className="font-medium">500+ Students</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                className="w-2 h-2 bg-green-500 rounded-full"
              />
              <span className="font-medium">50+ Facilitators</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                className="w-2 h-2 bg-green-500 rounded-full"
              />
              <span className="font-medium">20+ Cohorts</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating particles for extra visual interest */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-red-400 rounded-full opacity-40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </section>
  );
};

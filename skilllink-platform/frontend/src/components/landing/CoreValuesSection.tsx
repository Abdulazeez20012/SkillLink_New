import React from 'react';
import { motion } from 'framer-motion';

const coreValues = [
  'INNOVATION',
  'UBUNTU',
  'LEARNING',
  'INTEGRITY',
  'FULFILMENT',
  'IMPACT'
];

const CoreValuesSection: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-brand-red to-red-700 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Our Core <span className="text-white/90">Values</span>
          </h2>
          <p className="text-white/80 text-sm">The principles that guide everything we do</p>
        </motion.div>

        {/* Marquee Container */}
        <div className="relative">
          {/* First Marquee - Moving Left */}
          <div className="flex overflow-hidden mb-6">
            <motion.div
              className="flex gap-8 whitespace-nowrap"
              animate={{
                x: [0, -1920],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 25,
                  ease: "linear",
                },
              }}
            >
              {[...coreValues, ...coreValues, ...coreValues].map((value, index) => (
                <div
                  key={`left-${index}`}
                  className="text-6xl md:text-8xl font-black text-white/20 tracking-wider"
                  style={{ fontFamily: 'Impact, sans-serif' }}
                >
                  {value}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Second Marquee - Moving Right */}
          <div className="flex overflow-hidden">
            <motion.div
              className="flex gap-8 whitespace-nowrap"
              animate={{
                x: [-1920, 0],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 25,
                  ease: "linear",
                },
              }}
            >
              {[...coreValues, ...coreValues, ...coreValues].map((value, index) => (
                <div
                  key={`right-${index}`}
                  className="text-6xl md:text-8xl font-black text-white/20 tracking-wider"
                  style={{ fontFamily: 'Impact, sans-serif' }}
                >
                  {value}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;

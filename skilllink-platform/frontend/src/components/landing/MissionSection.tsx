import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const MissionSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section ref={ref} id="mission" className="py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #dc2626 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          >
            Our <span className="text-brand-red">Mission</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-700 leading-relaxed mb-6"
          >
            We're building a future where every learner has an AI companion to guide their journey.
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="text-base text-gray-600 leading-relaxed"
          >
            SkillLink combines cutting-edge artificial intelligence with proven educational methodologies 
            to create personalized learning experiences that adapt to each student's unique needs, pace, 
            and goals. We believe that education should be accessible, engaging, and transformative for everyone.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionSection;

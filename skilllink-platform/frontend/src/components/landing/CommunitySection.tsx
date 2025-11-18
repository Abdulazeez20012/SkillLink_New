import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CommunitySection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section ref={ref} id="community" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-5xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div variants={itemVariants} className="order-2 md:order-1">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&q=80"
                alt="Community"
                className="rounded-2xl shadow-lg"
              />
            </motion.div>

            <div className="order-1 md:order-2">
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              >
                Join the SkillLink <span className="text-brand-red">Community</span>
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-700 mb-4 leading-relaxed"
              >
                Collaborate with peers, share projects, and grow together.
              </motion.p>
              <motion.p
                variants={itemVariants}
                className="text-sm text-gray-600 leading-relaxed mb-6"
              >
                Connect with thousands of learners worldwide, participate in coding challenges, 
                attend virtual meetups, and build your professional network.
              </motion.p>
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-brand-red text-white px-6 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 text-sm"
              >
                Join Community
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaLaptopCode, FaRobot, FaUsers } from 'react-icons/fa';

const programs = [
  {
    title: 'AI Bootcamps',
    description: 'Intensive, project-based learning programs designed to take you from beginner to job-ready in weeks.',
    icon: FaLaptopCode,
    image: 'https://res.cloudinary.com/dwiewdn6f/image/upload/v1763407942/man_sitting_down_iwjus2.png',
    alt: 'Student working independently at a desk with laptop',
  },
  {
    title: 'SkillLink Labs',
    description: 'Experiment with cutting-edge AI tools and technologies in our interactive learning environment.',
    icon: FaRobot,
    image: 'https://res.cloudinary.com/dwiewdn6f/image/upload/v1763571839/woman_wcejjk.png',
    alt: 'Person in video call with multiple participants on screen',
  },
  {
    title: 'Educator Tools',
    description: 'Empower educators with AI-driven insights, analytics, and tools to enhance teaching effectiveness.',
    icon: FaUsers,
    image: 'https://res.cloudinary.com/dwiewdn6f/image/upload/v1763407943/man_facing_laptop_kh2lxi.png',
    alt: 'Group collaborating online via shared screens',
  },
];

const ProgramsSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="programs" className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Our <span className="text-brand-red">Programs</span>
          </h2>
          <p className="text-gray-600">Choose your path to success</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative overflow-hidden h-44 rounded-t-2xl">
                <img
                  src={program.image}
                  alt={program.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-5">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mr-3">
                    <program.icon className="text-xl text-brand-red" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{program.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{program.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;

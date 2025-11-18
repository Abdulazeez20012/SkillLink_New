import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Developer',
    image: 'https://via.placeholder.com/100x100.png?text=SJ',
    text: 'SkillLink helped me master Python in 8 weeks with AI-powered guidance. The personalized learning path was exactly what I needed.',
  },
  {
    name: 'Michael Chen',
    role: 'Data Scientist',
    image: 'https://via.placeholder.com/100x100.png?text=MC',
    text: 'The AI recommendations kept me motivated and on track. I landed my dream job thanks to the skills I learned on SkillLink.',
  },
  {
    name: 'Amara Okafor',
    role: 'Full Stack Engineer',
    image: 'https://via.placeholder.com/100x100.png?text=AO',
    text: 'SkillLink transformed my learning journey. The community support and AI-driven insights made all the difference.',
  },
];

const TestimonialsSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            What Our <span className="text-brand-red">Learners Say</span>
          </h2>
          <p className="text-gray-600">Real stories from real people</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-3 border-2 border-brand-red/20"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{testimonial.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

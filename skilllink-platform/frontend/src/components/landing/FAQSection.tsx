import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

const faqs = [
  {
    question: 'Do I need prior coding experience?',
    answer: 'No! SkillLink is designed for learners at all levels. Our AI adapts to your current skill level and creates a personalized learning path just for you.',
  },
  {
    question: 'How does SkillLink personalize learning?',
    answer: 'Our AI analyzes your progress, learning style, and goals to recommend the most effective content, exercises, and projects. It continuously adapts as you learn.',
  },
  {
    question: 'What programming languages can I learn?',
    answer: 'We offer courses in Python, JavaScript, Java, C++, and many more. Our curriculum covers web development, data science, machine learning, and software engineering.',
  },
  {
    question: 'How long does it take to complete a Programme?',
    answer: 'Our bootcamps typically range from 8-16 weeks, depending on the program and your pace. You can learn full-time or part-time based on your schedule.',
  },
  {
    question: 'Do you offer certificates?',
    answer: 'Yes! Upon completion of our programs, you receive industry-recognized certificates that you can share with employers and add to your LinkedIn profile.',
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="faq" className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Frequently Asked <span className="text-brand-red">Questions</span>
          </h2>
          <p className="text-gray-600">Everything you need to know</p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-base font-semibold text-gray-900 pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <FaChevronDown className="text-brand-red text-sm" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

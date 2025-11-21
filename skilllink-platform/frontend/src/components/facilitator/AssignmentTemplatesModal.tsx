import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Code, BookOpen, Lightbulb, CheckCircle } from 'lucide-react';

interface Template {
  id: number;
  name: string;
  description: string;
  maxPoints: number;
  icon: any;
  category: string;
}

interface AssignmentTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

export default function AssignmentTemplatesModal({ 
  isOpen, 
  onClose, 
  onSelectTemplate 
}: AssignmentTemplatesModalProps) {
  const templates: Template[] = [
    {
      id: 1,
      name: 'Coding Challenge',
      description: 'Complete the coding challenge and submit your solution with proper documentation and test cases.',
      maxPoints: 100,
      icon: Code,
      category: 'Programming'
    },
    {
      id: 2,
      name: 'Essay Assignment',
      description: 'Write a comprehensive essay (500-1000 words) on the given topic with proper citations and references.',
      maxPoints: 50,
      icon: FileText,
      category: 'Writing'
    },
    {
      id: 3,
      name: 'Project Submission',
      description: 'Submit your completed project with full documentation, README, and deployment instructions.',
      maxPoints: 200,
      icon: Lightbulb,
      category: 'Project'
    },
    {
      id: 4,
      name: 'Reading Assignment',
      description: 'Read the assigned materials and submit a summary with key takeaways and reflections.',
      maxPoints: 30,
      icon: BookOpen,
      category: 'Reading'
    },
    {
      id: 5,
      name: 'Quiz/Assessment',
      description: 'Complete the quiz covering topics from recent lessons. Time limit: 60 minutes.',
      maxPoints: 75,
      icon: CheckCircle,
      category: 'Assessment'
    },
    {
      id: 6,
      name: 'Code Review',
      description: 'Review the provided code, identify issues, suggest improvements, and submit your analysis.',
      maxPoints: 80,
      icon: Code,
      category: 'Programming'
    }
  ];

  const handleSelect = (template: Template) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Assignment Templates</h2>
                  <p className="text-sm text-gray-600 mt-1">Choose a template to get started quickly</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    onClick={() => handleSelect(template)}
                    className="group cursor-pointer bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-brand-red hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-brand-red to-red-600 rounded-xl text-white group-hover:scale-110 transition-transform">
                        <template.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                            {template.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-brand-red">
                            {template.maxPoints} points
                          </span>
                          <span className="text-sm text-gray-500 group-hover:text-brand-red transition-colors">
                            Click to use →
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

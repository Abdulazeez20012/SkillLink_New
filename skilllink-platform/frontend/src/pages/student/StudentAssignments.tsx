import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '../../hooks/useQuery';
import { assignmentService } from '../../services/assignment.service';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Clock, CheckCircle, Award, AlertCircle, Send, FileText } from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import AssignmentSubmissionModal from '../../components/student/AssignmentSubmissionModal';

type FilterType = 'all' | 'pending' | 'submitted' | 'graded';

export default function StudentAssignments() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  const { data: assignments, loading, refetch } = useQuery(
    () => assignmentService.getMyAssignments()
  );

  const filterAssignments = (assignment: any) => {
    if (filter === 'pending') return !assignment.submission;
    if (filter === 'submitted') return assignment.submission && !assignment.submission?.grade;
    if (filter === 'graded') return assignment.submission?.grade !== null;
    return true;
  };

  const filteredAssignments = assignments?.filter(filterAssignments) || [];

  const handleSubmit = (assignment: any) => {
    setSelectedAssignment(assignment);
    setShowSubmissionModal(true);
  };

  const handleSubmissionSuccess = () => {
    setSelectedAssignment(null);
    setShowSubmissionModal(false);
    refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading assignments..." />
      </div>
    );
  }

  const filters = [
    { key: 'all', label: 'All', count: assignments?.length || 0 },
    { key: 'pending', label: 'Pending', count: assignments?.filter((a: any) => !a.submission).length || 0 },
    { key: 'submitted', label: 'Submitted', count: assignments?.filter((a: any) => a.submission && !a.submission.grade).length || 0 },
    { key: 'graded', label: 'Graded', count: assignments?.filter((a: any) => a.submission?.grade !== null).length || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
        <p className="text-sm text-gray-500 mt-1">View and submit your assignments</p>
      </motion.div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        {filters.map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key as FilterType)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === item.key
                ? 'bg-brand-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {item.label} ({item.count})
          </button>
        ))}
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment: any, index: number) => {
            const dueDate = new Date(assignment.dueDate);
            const isOverdue = isPast(dueDate) && !assignment.submission;
            const dueIn = formatDistanceToNow(dueDate, { addSuffix: true });
            const hasSubmission = !!assignment.submission;
            const isGraded = assignment.submission?.grade !== null;

            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{assignment.title}</h3>
                      
                      {isGraded && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          Graded
                        </span>
                      )}
                      {hasSubmission && !isGraded && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          Submitted
                        </span>
                      )}
                      {isOverdue && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                          Overdue
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{assignment.description}</p>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className={isOverdue ? 'text-red-500' : 'text-gray-400'} />
                        <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
                          Due {dueIn}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-gray-400" />
                        <span className="text-gray-600">
                          {isGraded 
                            ? `${assignment.submission.grade} / ${assignment.maxPoints} points` 
                            : `Max: ${assignment.maxPoints} points`}
                        </span>
                      </div>

                      {hasSubmission && (
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-green-600 font-medium">
                            Submitted
                          </span>
                        </div>
                      )}
                    </div>

                    {isGraded && assignment.submission.feedback && (
                      <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-blue-900 mb-1">Feedback:</p>
                        <p className="text-sm text-blue-700">{assignment.submission.feedback}</p>
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    {!hasSubmission && !isOverdue && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSubmit(assignment)}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                      >
                        <Send size={16} />
                        Submit
                      </motion.button>
                    )}

                    {!hasSubmission && isOverdue && (
                      <button
                        disabled
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg cursor-not-allowed font-medium text-sm"
                      >
                        Overdue
                      </button>
                    )}

                    {hasSubmission && !isGraded && (
                      <button
                        disabled
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg cursor-not-allowed font-medium text-sm"
                      >
                        Pending Review
                      </button>
                    )}
                  </div>
                </div>

                {isOverdue && !hasSubmission && (
                  <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg border border-red-100">
                    <AlertCircle size={16} />
                    <span className="text-sm font-medium">
                      Overdue - Submission due {format(dueDate, 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'You have no assignments yet' 
                : `No ${filter} assignments`}
            </p>
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {selectedAssignment && (
        <AssignmentSubmissionModal
          isOpen={showSubmissionModal}
          onClose={() => {
            setSelectedAssignment(null);
            setShowSubmissionModal(false);
          }}
          assignment={selectedAssignment}
          onSuccess={handleSubmissionSuccess}
        />
      )}
    </div>
  );
}

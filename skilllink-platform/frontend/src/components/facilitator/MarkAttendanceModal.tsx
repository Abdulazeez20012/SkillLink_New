import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, CheckCircle, XCircle, Clock, AlertCircle, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { attendanceService } from '../../services/attendance.service';
import { format } from 'date-fns';

interface MarkAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cohort: any;
}

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export default function MarkAttendanceModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  cohort 
}: MarkAttendanceModalProps) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendance, setAttendance] = useState<Record<string, { status: AttendanceStatus; notes: string }>>({});
  const [loading, setLoading] = useState(false);

  const handleStatusChange = (userId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({
      ...prev,
      [userId]: {
        status,
        notes: prev[userId]?.notes || ''
      }
    }));
  };

  const handleNotesChange = (userId: string, notes: string) => {
    setAttendance(prev => ({
      ...prev,
      [userId]: {
        status: prev[userId]?.status || 'PRESENT',
        notes
      }
    }));
  };

  const markAllPresent = () => {
    const allPresent: Record<string, { status: AttendanceStatus; notes: string }> = {};
    cohort.members?.forEach((member: any) => {
      allPresent[member.userId] = { status: 'PRESENT', notes: '' };
    });
    setAttendance(allPresent);
    toast.success('All students marked as present');
  };

  const handleSubmit = async () => {
    const records = Object.entries(attendance).map(([userId, data]) => ({
      userId,
      status: data.status,
      notes: data.notes || undefined
    }));

    if (records.length === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }

    setLoading(true);
    try {
      await attendanceService.markAttendance({
        cohortId: cohort.id,
        date: selectedDate,
        attendanceRecords: records
      });
      toast.success('Attendance marked successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'ABSENT':
        return <XCircle size={20} className="text-red-600" />;
      case 'LATE':
        return <Clock size={20} className="text-orange-600" />;
      case 'EXCUSED':
        return <AlertCircle size={20} className="text-blue-600" />;
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'ABSENT':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'LATE':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'EXCUSED':
        return 'bg-blue-100 text-blue-700 border-blue-300';
    }
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
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Mark Attendance</h2>
                  <p className="text-sm text-gray-600 mt-1">{cohort.name}</p>
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

              {/* Date Selector and Bulk Actions */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                    />
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div className="pt-7">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={markAllPresent}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Mark All Present
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Student List */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
              <div className="space-y-3">
                {cohort.members?.map((member: any, index: number) => {
                  const currentStatus = attendance[member.userId]?.status || 'PRESENT';
                  
                  return (
                    <motion.div
                      key={member.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {member.user.name.charAt(0).toUpperCase()}
                        </div>

                        {/* Student Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{member.user.name}</h3>
                          <p className="text-sm text-gray-600">{member.user.email}</p>
                        </div>

                        {/* Status Buttons */}
                        <div className="flex items-center gap-2">
                          {(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as AttendanceStatus[]).map((status) => (
                            <motion.button
                              key={status}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleStatusChange(member.userId, status)}
                              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                                currentStatus === status
                                  ? getStatusColor(status)
                                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              {getStatusIcon(status)}
                              <span className="hidden sm:inline">{status}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Notes (Optional) */}
                      {(currentStatus === 'LATE' || currentStatus === 'EXCUSED' || currentStatus === 'ABSENT') && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3"
                        >
                          <input
                            type="text"
                            value={attendance[member.userId]?.notes || ''}
                            onChange={(e) => handleNotesChange(member.userId, e.target.value)}
                            placeholder="Add notes (optional)"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {Object.keys(attendance).length} of {cohort.members?.length || 0} students marked
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-5 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={loading || Object.keys(attendance).length === 0}
                    className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Attendance
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

import { motion } from 'framer-motion';
import { UserCheck } from 'lucide-react';
import AttendanceHistory from '../../components/student/AttendanceHistory';

export default function StudentAttendance() {
  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-8 text-white shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -ml-48 -mb-48" />
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <UserCheck className="text-white" size={24} />
            </div>
            <span className="text-white/90 font-medium">Attendance Tracking</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-3"
          >
            My Attendance
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/90 text-lg max-w-2xl"
          >
            Track your attendance history and maintain a great attendance record
          </motion.p>
        </div>
      </motion.div>

      {/* Attendance History Component */}
      <AttendanceHistory />
    </div>
  );
}

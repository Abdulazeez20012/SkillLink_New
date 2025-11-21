import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { attendanceService } from '../../services/attendance.service';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import toast from 'react-hot-toast';

export default function AttendanceHistory() {
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const data = await attendanceService.getMyAttendance();
      setAttendanceData(data);
    } catch (error: any) {
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const stats = attendanceData?.stats || {};
  const attendanceRate = attendanceData?.attendanceRate || 0;
  const attendance = attendanceData?.attendance || [];

  // Generate calendar days for current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAttendanceForDate = (date: Date) => {
    return attendance.find((a: any) => 
      isSameDay(new Date(a.date), date)
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'ABSENT':
        return <XCircle size={16} className="text-red-600" />;
      case 'LATE':
        return <Clock size={16} className="text-orange-600" />;
      case 'EXCUSED':
        return <AlertCircle size={16} className="text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-100 border-green-300';
      case 'ABSENT':
        return 'bg-red-100 border-red-300';
      case 'LATE':
        return 'bg-orange-100 border-orange-300';
      case 'EXCUSED':
        return 'bg-blue-100 border-blue-300';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle size={24} />
            <TrendingUp size={16} />
          </div>
          <p className="text-3xl font-bold mb-1">{attendanceRate}%</p>
          <p className="text-sm text-green-100">Attendance Rate</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={20} className="text-green-600" />
            <p className="text-sm font-medium text-gray-600">Present</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.present || 0}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock size={20} className="text-orange-600" />
            <p className="text-sm font-medium text-gray-600">Late</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.late || 0}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={20} className="text-blue-600" />
            <p className="text-sm font-medium text-gray-600">Excused</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.excused || 0}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={20} className="text-red-600" />
            <p className="text-sm font-medium text-gray-600">Absent</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.absent || 0}</p>
        </motion.div>
      </div>

      {/* Calendar View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Attendance Calendar</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>
            <span className="text-sm font-semibold text-gray-700 min-w-[120px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              →
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Calendar days */}
          {daysInMonth.map((date, index) => {
            const attendanceRecord = getAttendanceForDate(date);
            const status = attendanceRecord?.status;
            const today = isToday(date);

            return (
              <motion.div
                key={date.toISOString()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-all ${
                  status ? getStatusColor(status) : 'bg-gray-50 border-gray-200'
                } ${today ? 'ring-2 ring-brand-red ring-offset-2' : ''}`}
              >
                <span className={`text-sm font-semibold mb-1 ${
                  status ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {format(date, 'd')}
                </span>
                {status && getStatusIcon(status)}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" />
            <span className="text-sm text-gray-600">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-orange-600" />
            <span className="text-sm text-gray-600">Late</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-blue-600" />
            <span className="text-sm text-gray-600">Excused</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle size={16} className="text-red-600" />
            <span className="text-sm text-gray-600">Absent</span>
          </div>
        </div>
      </motion.div>

      {/* Recent Attendance List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Recent Attendance</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {attendance.slice(0, 10).map((record: any, index: number) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${getStatusColor(record.status)}`}>
                    {getStatusIcon(record.status)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{record.cohort.name}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(record.date), 'EEEE, MMMM dd, yyyy')}
                    </p>
                    {record.notes && (
                      <p className="text-xs text-gray-500 mt-1">{record.notes}</p>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  record.status === 'PRESENT' ? 'bg-green-100 text-green-700' :
                  record.status === 'LATE' ? 'bg-orange-100 text-orange-700' :
                  record.status === 'EXCUSED' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {record.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

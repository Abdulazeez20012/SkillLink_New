import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import StudentOverview from './StudentOverview';
import StudentAssignments from './StudentAssignments';
import StudentProgress from './StudentProgress';
import StudentAttendance from './StudentAttendance';
import StudentForum from './StudentForum';

export default function StudentDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<StudentOverview />} />
        <Route path="/assignments" element={<StudentAssignments />} />
        <Route path="/progress" element={<StudentProgress />} />
        <Route path="/attendance" element={<StudentAttendance />} />
        <Route path="/forum" element={<StudentForum />} />
      </Routes>
    </DashboardLayout>
  );
}

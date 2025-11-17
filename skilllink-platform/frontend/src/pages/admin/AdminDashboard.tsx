import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import DashboardOverview from './DashboardOverview';
import CohortsManagement from './CohortsManagement';
import FacilitatorsManagement from './FacilitatorsManagement';
import StudentsManagement from './StudentsManagement';

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/cohorts" element={<CohortsManagement />} />
        <Route path="/facilitators" element={<FacilitatorsManagement />} />
        <Route path="/students" element={<StudentsManagement />} />
      </Routes>
    </DashboardLayout>
  );
}

import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import FacilitatorOverview from './FacilitatorOverview';
import CohortDetail from './CohortDetail';

export default function FacilitatorDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<FacilitatorOverview />} />
        <Route path="/cohorts/:id" element={<CohortDetail />} />
      </Routes>
    </DashboardLayout>
  );
}

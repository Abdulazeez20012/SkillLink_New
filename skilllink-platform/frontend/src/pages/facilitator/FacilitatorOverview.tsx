import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, FileText, Calendar, TrendingUp, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { facilitatorService } from '../../services/facilitator.service';
import { LoadingSpinner, AnimatedCard } from '../../components/ui';

export default function FacilitatorOverview() {
  const navigate = useNavigate();
  const { data: cohorts, loading } = useQuery(() => facilitatorService.getMyCohorts());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading your cohorts..." />
      </div>
    );
  }

  const totalStudents = cohorts?.reduce((sum: number, c: any) => sum + (c._count?.members || 0), 0) || 0;
  const totalAssignments = cohorts?.reduce((sum: number, c: any) => sum + (c._count?.assignments || 0), 0) || 0;

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-red via-red-600 to-pink-600 p-8 text-white shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={24} className="text-yellow-300" />
            <span className="text-sm font-semibold text-white/90">Facilitator Dashboard</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-white/90 text-lg mb-6">Manage your cohorts and track student progress</p>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <BookOpen size={24} className="mb-2 text-white/90" />
              <p className="text-3xl font-bold">{cohorts?.length || 0}</p>
              <p className="text-sm text-white/80">Active Cohorts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <Users size={24} className="mb-2 text-white/90" />
              <p className="text-3xl font-bold">{totalStudents}</p>
              <p className="text-sm text-white/80">Total Students</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <FileText size={24} className="mb-2 text-white/90" />
              <p className="text-3xl font-bold">{totalAssignments}</p>
              <p className="text-sm text-white/80">Assignments</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cohorts Section */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Cohorts</h2>
            <p className="text-gray-600 mt-1">Click on a cohort to view details and manage students</p>
          </div>
        </motion.div>

        {cohorts && cohorts.length === 0 ? (
          <AnimatedCard delay={0.3}>
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Cohorts Yet</h3>
              <p className="text-gray-600 mb-4">You haven't been assigned to any cohorts</p>
              <p className="text-sm text-gray-500">Contact an administrator to get started</p>
            </div>
          </AnimatedCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cohorts?.map((cohort: any, index: number) => {
              const daysLeft = Math.ceil((new Date(cohort.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              const isEndingSoon = daysLeft <= 7 && daysLeft > 0;
              
              return (
                <motion.div
                  key={cohort.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  onClick={() => navigate(`/facilitator/cohorts/${cohort.id}`)}
                  className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-brand-red to-pink-600 rounded-xl flex items-center justify-center">
                            <BookOpen size={20} className="text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-red transition-colors">
                            {cohort.name}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{cohort.description}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isEndingSoon 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {isEndingSoon ? 'Ending Soon' : 'Active'}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-xl p-3 text-center group-hover:bg-white transition-colors">
                        <Users size={18} className="mx-auto mb-1 text-brand-red" />
                        <p className="text-2xl font-bold text-gray-900">{cohort._count?.members || 0}</p>
                        <p className="text-xs text-gray-600">Students</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center group-hover:bg-white transition-colors">
                        <FileText size={18} className="mx-auto mb-1 text-brand-red" />
                        <p className="text-2xl font-bold text-gray-900">{cohort._count?.assignments || 0}</p>
                        <p className="text-xs text-gray-600">Tasks</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center group-hover:bg-white transition-colors">
                        <Clock size={18} className="mx-auto mb-1 text-brand-red" />
                        <p className="text-2xl font-bold text-gray-900">{daysLeft > 0 ? daysLeft : 0}</p>
                        <p className="text-xs text-gray-600">Days Left</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Start:</span> {new Date(cohort.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        <span className="mx-2">•</span>
                        <span className="font-medium">End:</span> {new Date(cohort.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <ArrowRight size={18} className="text-brand-red opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

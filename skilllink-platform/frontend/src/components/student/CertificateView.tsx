import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Award, Calendar, Share2, CheckCircle } from 'lucide-react';
import { certificateService } from '../../services/certificate.service';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function CertificateView() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const data = await certificateService.getMyCertificates();
      setCertificates(data);
    } catch (error) {
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificateId: string, cohortName: string) => {
    try {
      const blob = await certificateService.downloadCertificate(certificateId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${cohortName.replace(/\s+/g, '-')}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Certificate downloaded successfully');
    } catch (error) {
      toast.error('Failed to download certificate');
    }
  };

  const handleShare = (certificate: any) => {
    if (navigator.share) {
      navigator.share({
        title: `Certificate - ${certificate.cohort.name}`,
        text: `I've completed ${certificate.cohort.name} and earned my certificate!`,
        url: window.location.href
      }).then(() => {
        toast.success('Certificate shared successfully');
      }).catch(() => {
        copyToClipboard(certificate);
      });
    } else {
      copyToClipboard(certificate);
    }
  };

  const copyToClipboard = (certificate: any) => {
    const text = `I've completed ${certificate.cohort.name} and earned my certificate! Verification Code: ${certificate.verificationCode}`;
    navigator.clipboard.writeText(text);
    toast.success('Certificate details copied to clipboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">My Certificates</h2>
        <p className="text-indigo-100">Your achievements and completed courses</p>
      </div>

      {/* Certificates Grid */}
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate, index) => (
            <motion.div
              key={certificate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-md group-hover:shadow-xl transition-all" />
              <div className="relative p-6">
                {/* Certificate Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Award size={32} className="text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {certificate.cohort.name}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={14} />
                    <span>Issued {format(new Date(certificate.issueDate), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} />
                    <span className="font-mono text-xs">{certificate.verificationCode}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDownload(certificate.id, certificate.cohort.name)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                  >
                    <Download size={16} />
                    Download
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleShare(certificate)}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <Share2 size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-200"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award size={40} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No certificates yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Complete your courses to earn certificates and showcase your achievements
          </p>
        </motion.div>
      )}
    </div>
  );
}

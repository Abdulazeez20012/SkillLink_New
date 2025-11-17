import { useState } from 'react';
import { X, Upload, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/admin.service';

interface StudentBulkInviteProps {
  isOpen: boolean;
  onClose: () => void;
  cohortId: string;
  cohortName: string;
}

export default function StudentBulkInvite({ isOpen, onClose, cohortId, cohortName }: StudentBulkInviteProps) {
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');

  if (!isOpen) return null;

  const addEmail = () => {
    const trimmed = emailInput.trim();
    if (trimmed && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      if (!emails.includes(trimmed)) {
        setEmails([...emails, trimmed]);
        setEmailInput('');
      } else {
        toast.error('Email already added');
      }
    } else {
      toast.error('Invalid email address');
    }
  };

  const removeEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const newEmails: string[] = [];

      lines.forEach(line => {
        const email = line.trim();
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !emails.includes(email)) {
          newEmails.push(email);
        }
      });

      setEmails([...emails, ...newEmails]);
      toast.success(`Added ${newEmails.length} emails`);
    };

    reader.readAsText(file);
  };

  const sendInvites = async () => {
    if (emails.length === 0) {
      toast.error('Please add at least one email');
      return;
    }

    setLoading(true);
    try {
      const result = await adminService.inviteStudents(cohortId, emails);
      const successCount = result.results.filter((r: any) => r.status === 'sent').length;
      toast.success(`Sent ${successCount} invitations successfully!`);
      setEmails([]);
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send invitations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Invite Students</h2>
            <p className="text-sm text-gray-600 mt-1">to {cohortName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* CSV Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload CSV File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-sm text-gray-600 mb-2">
                Upload a CSV file with one email per line
              </p>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleCSVUpload}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="btn btn-secondary cursor-pointer">
                Choose File
              </label>
            </div>
          </div>

          {/* Manual Email Entry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Email Manually
            </label>
            <div className="flex space-x-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addEmail()}
                className="input flex-1"
                placeholder="student@example.com"
              />
              <button onClick={addEmail} className="btn btn-primary">
                Add
              </button>
            </div>
          </div>

          {/* Email List */}
          {emails.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipients ({emails.length})
              </label>
              <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                {emails.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 border-b last:border-b-0"
                  >
                    <span className="text-sm text-gray-700">{email}</span>
                    <button
                      onClick={() => removeEmail(email)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={sendInvites}
              className="btn btn-primary flex items-center space-x-2"
              disabled={loading || emails.length === 0}
            >
              <Mail size={16} />
              <span>{loading ? 'Sending...' : `Send ${emails.length} Invitation${emails.length !== 1 ? 's' : ''}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Github, Check, X, Loader } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface GitHubUrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidated?: (repoInfo: any) => void;
}

export default function GitHubUrlInput({ value, onChange, onValidated }: GitHubUrlInputProps) {
  const [validating, setValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [repoInfo, setRepoInfo] = useState<any>(null);

  const validateUrl = async () => {
    if (!value) return;

    setValidating(true);
    setIsValid(null);

    try {
      const response = await api.post('/github/validate', { url: value });
      setIsValid(true);
      setRepoInfo(response.data.data.repoInfo);
      onValidated?.(response.data.data.repoInfo);
      toast.success('Repository validated successfully!');
    } catch (error: any) {
      setIsValid(false);
      setRepoInfo(null);
      toast.error(error.response?.data?.error || 'Invalid repository URL');
    } finally {
      setValidating(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        GitHub Repository URL
      </label>
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Github size={20} className="text-gray-400" />
          </div>
          <input
            type="url"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setIsValid(null);
              setRepoInfo(null);
            }}
            className="input pl-10"
            placeholder="https://github.com/username/repository"
          />
          {isValid !== null && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {isValid ? (
                <Check size={20} className="text-green-500" />
              ) : (
                <X size={20} className="text-red-500" />
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={validateUrl}
          disabled={!value || validating}
          className="btn btn-secondary"
        >
          {validating ? <Loader size={16} className="animate-spin" /> : 'Validate'}
        </button>
      </div>

      {repoInfo && (
        <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Github size={24} className="text-green-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-900">{repoInfo.name}</h4>
              <p className="text-sm text-green-700 mt-1">{repoInfo.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-green-600">
                <span>⭐ {repoInfo.stars}</span>
                <span>🍴 {repoInfo.forks}</span>
                <span>📝 {repoInfo.language}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

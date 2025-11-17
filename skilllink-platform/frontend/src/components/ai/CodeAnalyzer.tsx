import { useState } from 'react';
import { aiService, CodeAnalysis } from '../../services/ai.service';
import { Code, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function CodeAnalyzer() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      const result = await aiService.analyzeCode(code, language);
      setAnalysis(result);
    } catch (error) {
      console.error('Code analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Code className="text-primary-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-900">AI Code Analyzer</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Programming Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="move">move</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste Your Code
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="input font-mono text-sm"
            rows={10}
            placeholder="// Paste your code here..."
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !code.trim()}
          className="btn-primary w-full"
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={20} />
              Analyzing...
            </>
          ) : (
            'Analyze Code'
          )}
        </button>

        {analysis && (
          <div className="mt-6 space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Complexity: </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getComplexityColor(analysis.complexity)}`}>
                {analysis.complexity.toUpperCase()}
              </span>
            </div>

            {analysis.strengths.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-green-700 mb-2">
                  <CheckCircle size={18} />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-gray-700 pl-6">
                      • {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.suggestions.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-yellow-700 mb-2">
                  <AlertCircle size={18} />
                  Suggestions for Improvement
                </h4>
                <ul className="space-y-1">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-gray-700 pl-6">
                      • {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

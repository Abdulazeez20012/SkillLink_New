import { useEffect, useState } from 'react';
import { aiService } from '../../services/ai.service';
import { Lightbulb, Loader } from 'lucide-react';

export default function StudyRecommendations() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const data = await aiService.getStudyRecommendations();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <Loader className="animate-spin text-primary-600" size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="text-yellow-500" size={24} />
        <h3 className="text-lg font-semibold text-gray-900">AI Study Recommendations</h3>
      </div>
      
      {recommendations.length === 0 ? (
        <p className="text-gray-600">No recommendations available yet. Keep learning!</p>
      ) : (
        <ul className="space-y-3">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary-600 font-semibold mt-0.5">{index + 1}.</span>
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

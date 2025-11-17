import { Award } from 'lucide-react';

interface Badge {
  id: string;
  badge: {
    name: string;
    description: string;
    icon: string;
  };
  earnedAt: string;
}

interface BadgeCollectionProps {
  badges: Badge[];
}

export default function BadgeCollection({ badges }: BadgeCollectionProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Badges</h3>
        <Award className="text-yellow-500" size={24} />
      </div>

      {badges.length === 0 ? (
        <div className="text-center py-8">
          <Award size={48} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">No badges earned yet</p>
          <p className="text-sm text-gray-400 mt-1">Complete assignments and participate to earn badges!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {badges.map((userBadge) => (
            <div
              key={userBadge.id}
              className="flex flex-col items-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-2">{userBadge.badge.icon}</div>
              <p className="text-sm font-semibold text-center text-gray-900">
                {userBadge.badge.name}
              </p>
              <p className="text-xs text-gray-600 text-center mt-1">
                {userBadge.badge.description}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(userBadge.earnedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

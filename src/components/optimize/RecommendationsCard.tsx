import { CheckCircle } from 'lucide-react';

interface RecommendationsProps {
  recommendations: string[];
}

const RecommendationsCard = ({ recommendations }: RecommendationsProps) => {
  return (
    <div className="bg-cyber-DEFAULT/30 rounded-lg p-4">
      <h3 className="font-medium text-lg mb-4">Recommendations</h3>
      <ul className="space-y-2">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-center space-x-2 text-sm">
            <CheckCircle className="w-4 h-4 text-safe-DEFAULT flex-shrink-0" />
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationsCard;
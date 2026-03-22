import type { JudgeResponse } from '../../types/game';
import { getSimilarityDescription, getSimilarityLevel } from '../../utils/textSimilarity';

interface SimilarityWarningProps {
  similarity: NonNullable<JudgeResponse['similarity']>;
  className?: string;
}

export default function SimilarityWarning({ similarity, className = '' }: SimilarityWarningProps) {
  const { maxSimilarity, originalScore, penalty, penaltyType, message, mostSimilarRecipe } = similarity;

  // Don't show anything if there's no penalty
  if (penaltyType === 'none') {
    return null;
  }

  const similarityLevel = getSimilarityLevel(maxSimilarity);
  const similarityDescription = getSimilarityDescription(maxSimilarity);

  const getWarningColors = (level: typeof similarityLevel) => {
    switch (level) {
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-400'
        };
      case 'high':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-800',
          icon: 'text-orange-400'
        };
      case 'very-high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-400'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-400'
        };
    }
  };

  const colors = getWarningColors(similarityLevel);

  const getWarningIcon = () => {
    if (similarityLevel === 'very-high') {
      return (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-lg p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <div className={colors.icon}>
            {getWarningIcon()}
          </div>
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${colors.text}`}>
            Recipe Similarity Detected
          </h3>
          <div className={`mt-2 text-sm ${colors.text}`}>
            <p className="mb-2">{message}</p>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-medium">Similarity:</span> {similarityDescription} ({(maxSimilarity * 100).toFixed(1)}%)
              </div>
              <div>
                <span className="font-medium">Score Penalty:</span> -{penalty} points
              </div>
              <div>
                <span className="font-medium">Original Score:</span> {originalScore}
              </div>
              <div>
                <span className="font-medium">Final Score:</span> {originalScore - penalty}
              </div>
            </div>

            {mostSimilarRecipe && (
              <details className="mt-3">
                <summary className="cursor-pointer text-xs font-medium hover:underline">
                  View most similar recipe
                </summary>
                <div className={`mt-2 p-2 ${colors.bg} rounded border-l-2 ${colors.border}`}>
                  {mostSimilarRecipe.title && (
                    <div className="font-medium text-xs mb-1">
                      {mostSimilarRecipe.title}
                    </div>
                  )}
                  <div className="text-xs opacity-80">
                    {mostSimilarRecipe.content.length > 200
                      ? `${mostSimilarRecipe.content.substring(0, 200)}...`
                      : mostSimilarRecipe.content
                    }
                  </div>
                </div>
              </details>
            )}
          </div>

          <div className={`mt-3 text-xs ${colors.text} opacity-80`}>
            <strong>Tip:</strong> Try adding unique ingredients, cooking methods, or creative twists to boost your originality score!
          </div>
        </div>
      </div>
    </div>
  );
}
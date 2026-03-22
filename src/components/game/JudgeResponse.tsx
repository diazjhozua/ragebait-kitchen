import { useState } from 'react';
import type { JudgeResponse } from '../../types/game';
import RageScore from './RageScore';
import Button from '../common/Button';
import SimilarityWarning from './SimilarityWarning';

interface JudgeResponseProps {
  response: JudgeResponse;
  onSaveToLeaderboard?: () => void;
  onTryAgain?: () => void;
  isSaving?: boolean;
  className?: string;
}

export default function JudgeResponseComponent({
  response,
  onSaveToLeaderboard,
  onTryAgain,
  isSaving = false,
  className = ''
}: JudgeResponseProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = response.reaction.length > 200;
  const displayText = shouldTruncate && !isExpanded
    ? response.reaction.substring(0, 200) + '...'
    : response.reaction;

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-rage-600 to-red-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center">
            👨‍🍳 Gordon's Verdict
          </h3>
          <div className="text-right">
            <div className="text-sm opacity-90">Rage Level</div>
            <div className="text-2xl font-bold">{response.rage_score}/100</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Rage Score Visualization */}
        <div className="flex justify-center mb-6">
          <RageScore score={response.rage_score} size="md" />
        </div>

        {/* Tags */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Reaction Tags</h4>
          <div className="flex flex-wrap gap-2">
            {response.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Reasons */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Why This Score</h4>
          <ul className="space-y-1">
            {response.reasons.map((reason, index) => (
              <li key={index} className="flex items-start text-sm text-gray-600">
                <span className="text-red-500 mr-2 mt-1">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Chef's Reaction */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Chef's Reaction</h4>
          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-rage-500">
            <blockquote className="text-gray-800 leading-relaxed font-chef italic">
              "{displayText}"
            </blockquote>
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-rage-600 hover:text-rage-700 text-sm font-medium underline"
              >
                {isExpanded ? 'Show Less' : 'Read Full Reaction'}
              </button>
            )}
          </div>
        </div>

        {/* Similarity Warning */}
        {response.similarity && response.similarity.penaltyType !== 'none' && (
          <SimilarityWarning similarity={response.similarity} className="mb-6" />
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {onSaveToLeaderboard && (
            <Button
              onClick={onSaveToLeaderboard}
              isLoading={isSaving}
              loadingText="Saving..."
              className="flex-1"
            >
              🏆 Save to Leaderboard
            </Button>
          )}
          {onTryAgain && (
            <Button
              variant="outline"
              onClick={onTryAgain}
              className="flex-1"
            >
              🍳 Try Another Recipe
            </Button>
          )}
        </div>

        {/* Score Breakdown */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center">
              <svg className="w-4 h-4 mr-2 transform group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Score Breakdown
            </summary>
            <div className="mt-3 text-sm text-gray-600">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-medium">Score Range</div>
                  <div className="text-xs text-gray-500">
                    {response.rage_score >= 90 ? '90-100: Absolute Disaster' :
                     response.rage_score >= 80 ? '80-89: Kitchen Nightmare' :
                     response.rage_score >= 70 ? '70-79: Bloody Awful' :
                     response.rage_score >= 60 ? '60-69: Terrible' :
                     response.rage_score >= 50 ? '50-59: Poor' :
                     response.rage_score >= 40 ? '40-49: Needs Work' :
                     response.rage_score >= 30 ? '30-39: Mediocre' :
                     response.rage_score >= 20 ? '20-29: Not Bad' :
                     response.rage_score >= 10 ? '10-19: Decent' :
                     '0-9: Actually Good'}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Tag Count</div>
                  <div className="text-xs text-gray-500">{response.tags.length} reaction tags</div>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
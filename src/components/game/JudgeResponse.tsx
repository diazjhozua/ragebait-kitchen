import { useState } from 'react';
import type { JudgeResponse } from '../../types/game';
import RageScore from './RageScore';
import GordonGif from './GordonGif';
import Button from '../common/Button';
import SimilarityWarning from './SimilarityWarning';

interface JudgeResponseProps {
  response: JudgeResponse;
  onTryAgain?: () => void;
  className?: string;
}

function getScoreLabel(score: number) {
  if (score >= 90) return { label: 'ABSOLUTE DISASTER', color: '#dc2626' };
  if (score >= 80) return { label: 'KITCHEN NIGHTMARE', color: '#ea580c' };
  if (score >= 70) return { label: 'BLOODY AWFUL', color: '#f97316' };
  if (score >= 60) return { label: 'TERRIBLE', color: '#f59e0b' };
  if (score >= 50) return { label: 'POOR', color: '#eab308' };
  if (score >= 40) return { label: 'NEEDS WORK', color: '#84cc16' };
  if (score >= 30) return { label: 'MEDIOCRE', color: '#22c55e' };
  if (score >= 20) return { label: 'NOT BAD', color: '#10b981' };
  if (score >= 10) return { label: 'DECENT', color: '#06b6d4' };
  return { label: 'ACTUALLY GOOD??', color: '#6366f1' };
}

export default function JudgeResponseComponent({
  response,
  onTryAgain,
  className = ''
}: JudgeResponseProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = response.reaction.length > 200;
  const displayText = shouldTruncate && !isExpanded
    ? response.reaction.substring(0, 200) + '...'
    : response.reaction;

  const scoreInfo = getScoreLabel(response.rage_score);

  return (
    <div
      className={`hell-kitchen-bg border-2 rounded-xl overflow-hidden transition-shadow ${className}`}
      style={{
        borderColor: response.rage_score >= 90 ? scoreInfo.color : undefined,
        boxShadow: response.rage_score >= 90
          ? `0 0 40px ${scoreInfo.color}55, 0 0 80px ${scoreInfo.color}22, 0 8px 32px rgba(0,0,0,0.6)`
          : response.rage_score >= 70
            ? `0 0 20px rgba(220,38,38,0.3), 0 8px 32px rgba(0,0,0,0.5)`
            : `0 8px 24px rgba(0,0,0,0.4)`,
      }}
    >

      {/* Header */}
      <div
        className="relative px-6 py-5 border-b border-flame-700"
        style={{
          background: 'linear-gradient(135deg, rgba(127,29,29,0.6) 0%, rgba(30,0,0,0.8) 60%, rgba(154,52,18,0.4) 100%)',
        }}
      >
        <span className="absolute top-3 left-4 text-xl animate-flame-flicker opacity-60">🔥</span>
        <span className="absolute top-3 right-4 text-xl animate-flame-flicker opacity-60" style={{ animationDelay: '0.5s' }}>🔥</span>

        <div className="flex items-center justify-between">
          <div>
            <h3
              className="font-chef font-black uppercase tracking-widest text-white"
              style={{ fontSize: '1.35rem', textShadow: '0 0 20px rgba(220,38,38,0.8)' }}
            >
              Gordon's Verdict
            </h3>
            <div
              className="text-xs font-black uppercase tracking-widest mt-0.5"
              style={{ color: scoreInfo.color, textShadow: `0 0 8px ${scoreInfo.color}` }}
            >
              {scoreInfo.label}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-steel-400 uppercase tracking-wider font-semibold mb-0.5">Rage Level</div>
            <div
              className="font-black text-3xl"
              style={{ color: scoreInfo.color, textShadow: `0 0 14px ${scoreInfo.color}` }}
            >
              {response.rage_score}<span className="text-base text-steel-500 font-bold">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* GIF hero with score ring floating over the bottom edge */}
      <div className="relative pb-16">
        <GordonGif
          key={`${response.rage_score}-${response.reaction.slice(0, 20)}`}
          score={response.rage_score}
          scoreColor={scoreInfo.color}
        />
        {/* gradient so the score ring reads clearly against any GIF */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none rounded-b-xl"
          style={{
            height: '60%',
            background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.75))',
          }}
        />
        {/* score ring — centered, bottom half in the pb-16 gap, top half over the GIF */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <RageScore score={response.rage_score} size="md" showLabel={false} />
        </div>
      </div>

      <div className="px-6 pt-10 pb-6 space-y-5">
        {/* Tags */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-flame-400 mb-2">Reaction Tags</h4>
          <div className="flex flex-wrap gap-2">
            {response.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-hell-800 border border-hell-600 text-flame-300"
                style={{ boxShadow: '0 0 6px rgba(220,38,38,0.2)' }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Reasons */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-flame-400 mb-2">Why This Score</h4>
          <ul className="space-y-1.5">
            {response.reasons.map((reason, index) => (
              <li key={index} className="flex items-start text-sm text-hell-200">
                <span className="text-flame-500 mr-2 mt-0.5 flex-shrink-0">▸</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Chef's Reaction */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-flame-400 mb-2">Chef's Reaction</h4>
          <div
            className="rounded-lg p-4 border-l-4"
            style={{
              background: 'rgba(10,0,0,0.5)',
              borderLeftColor: scoreInfo.color,
              boxShadow: `inset 0 0 20px rgba(0,0,0,0.3), 0 0 12px rgba(220,38,38,0.08)`,
            }}
          >
            <blockquote
              className="leading-relaxed font-chef italic text-hell-100"
              style={{ fontSize: '1rem', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
            >
              "{displayText}"
            </blockquote>
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-flame-400 hover:text-flame-300 text-xs font-bold underline transition-colors"
              >
                {isExpanded ? 'Show Less' : 'Read Full Reaction'}
              </button>
            )}
          </div>
        </div>

        {/* Similarity Warning */}
        {response.similarity && response.similarity.penaltyType !== 'none' && (
          <SimilarityWarning similarity={response.similarity} className="mb-1" />
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          {onTryAgain && (
            <Button
              variant="secondary"
              onClick={onTryAgain}
              className="flex-1"
            >
              🍳 Try Another Recipe
            </Button>
          )}
        </div>

        {/* Score Breakdown */}
        <div className="pt-3 border-t border-hell-700">
          <details className="group">
            <summary className="cursor-pointer text-xs font-bold text-steel-400 hover:text-hell-300 flex items-center uppercase tracking-wider transition-colors">
              <svg className="w-3 h-3 mr-2 transform group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Score Breakdown
            </summary>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div className="bg-hell-800 rounded-lg p-3 border border-hell-700">
                <div className="text-xs font-bold text-hell-300 mb-1">Score Range</div>
                <div className="text-xs font-semibold" style={{ color: scoreInfo.color }}>{scoreInfo.label}</div>
              </div>
              <div className="bg-hell-800 rounded-lg p-3 border border-hell-700">
                <div className="text-xs font-bold text-hell-300 mb-1">Tag Count</div>
                <div className="text-xs text-flame-300 font-semibold">{response.tags.length} reaction tags</div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

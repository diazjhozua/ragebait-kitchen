import { useState, useEffect } from 'react';
import { getRageScoreLevel } from '../../utils/constants';

interface RageScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export default function RageScore({
  score,
  size = 'md',
  showLabel = true,
  animated = true,
  className = ''
}: RageScoreProps) {
  const level = getRageScoreLevel(score);

  // Count-up animation for the score number
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  useEffect(() => {
    if (!animated) { setDisplayScore(score); return; }
    const duration = 1100;
    const steps = 55;
    const increment = score / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, score);
      setDisplayScore(Math.round(current));
      if (current >= score) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [score, animated]);

  const sizeClasses = {
    sm: { container: 'w-20 h-20', text: 'text-xl',  subtext: 'text-[10px]', label: 'text-sm',  stroke: '6',  emoji: 'text-lg',  radius: 40 },
    md: { container: 'w-32 h-32', text: 'text-3xl', subtext: 'text-xs',     label: 'text-base', stroke: '8',  emoji: 'text-2xl', radius: 42 },
    lg: { container: 'w-48 h-48', text: 'text-5xl', subtext: 'text-sm',     label: 'text-lg',  stroke: '10', emoji: 'text-4xl', radius: 44 },
  };

  const cfg = sizeClasses[size];
  const circumference = 2 * Math.PI * cfg.radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const ringColor =
    score >= 80 ? '#dc2626' :
    score >= 60 ? '#f97316' :
    score >= 40 ? '#eab308' :
    score >= 20 ? '#22c55e' :
                  '#6366f1';

  const filterId = `rage-glow-${size}`;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`relative ${cfg.container}`}>
        <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
          <defs>
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Dark backdrop so ring is readable on any background */}
          <circle
            cx="50" cy="50" r={cfg.radius + 5}
            fill="rgba(5,0,0,0.72)"
          />

          {/* Track ring */}
          <circle
            cx="50" cy="50" r={cfg.radius}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={cfg.stroke}
            fill="transparent"
          />

          {/* Progress arc */}
          <circle
            cx="50" cy="50" r={cfg.radius}
            stroke={ringColor}
            strokeWidth={cfg.stroke}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter={`url(#${filterId})`}
            style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.4,0,0.2,1)', transitionDelay: '80ms' }}
          />
        </svg>

        {/* Score number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center leading-none">
            <div
              className={`font-black ${cfg.text} tabular-nums`}
              style={{ color: ringColor, textShadow: `0 0 16px ${ringColor}cc, 0 2px 4px rgba(0,0,0,0.9)` }}
            >
              {displayScore}
            </div>
            <div
              className={`${cfg.subtext} font-black uppercase tracking-widest mt-0.5`}
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              / 100
            </div>
          </div>
        </div>

        {/* Emoji badge */}
        <div className="absolute -top-2 -right-2">
          <span className={`${cfg.emoji} ${animated ? 'animate-bounce' : ''}`}>
            {level.emoji}
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-3 text-center">
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest"
            style={{
              background: `${ringColor}22`,
              border: `1px solid ${ringColor}55`,
              color: ringColor,
              textShadow: `0 0 8px ${ringColor}88`,
            }}
          >
            {level.label}
          </div>
        </div>
      )}
    </div>
  );
}


// Component variant for displaying just the badge
export function RageScoreBadge({ score, className = '' }: { score: number; className?: string }) {
  const level = getRageScoreLevel(score);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${level.color} ${className}`}>
      <span className="mr-1">{level.emoji}</span>
      {score} - {level.label}
    </span>
  );
}

// Component variant for a simple horizontal bar
export function RageScoreBar({ score, className = '' }: { score: number; className?: string }) {
  const level = getRageScoreLevel(score);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-bold text-steel-200">
          Rage Score: {score}/100
        </span>
        <span className={`text-xs px-2 py-1 rounded ${level.color}`}>
          {level.emoji} {level.label}
        </span>
      </div>
      <div className="w-full bg-kitchen-800 rounded-full h-3 border border-steel-600">
        <div
          className={`h-3 rounded-full transition-all duration-1000 ease-out ${
            score >= 80 ? 'bg-gradient-to-r from-hell-600 to-hell-800 hell-glow' :
            score >= 60 ? 'bg-gradient-to-r from-flame-500 to-flame-700' :
            score >= 40 ? 'bg-gradient-to-r from-flame-400 to-flame-600' :
            score >= 20 ? 'bg-gradient-to-r from-kitchen-400 to-kitchen-600' :
            'bg-gradient-to-r from-green-500 to-green-700'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

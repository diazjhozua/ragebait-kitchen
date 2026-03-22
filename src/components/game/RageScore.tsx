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

  const sizeClasses = {
    sm: {
      container: 'w-20 h-20',
      text: 'text-xl',
      label: 'text-sm',
      stroke: '6'
    },
    md: {
      container: 'w-32 h-32',
      text: 'text-3xl',
      label: 'text-base',
      stroke: '8'
    },
    lg: {
      container: 'w-48 h-48',
      text: 'text-5xl',
      label: 'text-lg',
      stroke: '10'
    }
  };

  const sizeConfig = sizeClasses[size];

  // Calculate the circumference and dash offset for the progress ring
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`relative ${sizeConfig.container}`}>
        {/* Background circle */}
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth={sizeConfig.stroke}
            fill="transparent"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth={sizeConfig.stroke}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${
              score >= 80 ? 'text-red-600' :
              score >= 60 ? 'text-orange-500' :
              score >= 40 ? 'text-yellow-500' :
              score >= 20 ? 'text-blue-500' :
              'text-green-500'
            } ${animated ? 'animate-pulse' : ''}`}
          />
        </svg>

        {/* Score text in the center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`font-bold ${sizeConfig.text} text-gray-900`}>
              {score}
            </div>
            <div className={`${sizeConfig.label} text-gray-600 font-medium`}>
              RAGE
            </div>
          </div>
        </div>

        {/* Emoji indicator */}
        <div className="absolute -top-2 -right-2">
          <span className={`${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-4xl'} ${animated ? 'animate-bounce' : ''}`}>
            {level.emoji}
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-4 text-center">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${level.color}`}>
            {level.label}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Score: {score}/100
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
        <span className="text-sm font-medium text-gray-700">
          Rage Score: {score}/100
        </span>
        <span className={`text-xs px-2 py-1 rounded ${level.color}`}>
          {level.emoji} {level.label}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-1000 ease-out ${
            score >= 80 ? 'bg-red-600' :
            score >= 60 ? 'bg-orange-500' :
            score >= 40 ? 'bg-yellow-500' :
            score >= 20 ? 'bg-blue-500' :
            'bg-green-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
import type { PlayerLevel as IPlayerLevel } from '../../types/gamification';

interface PlayerLevelProps {
  level: IPlayerLevel;
  currentXP: number;
  nextLevel?: IPlayerLevel | null;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  showTitle?: boolean;
  className?: string;
}

interface LevelProgressBarProps {
  currentXP: number;
  currentLevel: IPlayerLevel;
  nextLevel?: IPlayerLevel | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LevelProgressBar({
  currentXP,
  currentLevel,
  nextLevel,
  size = 'md',
  className = ''
}: LevelProgressBarProps) {
  if (!nextLevel) {
    return (
      <div className={`w-full ${className}`}>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-bold text-hell-300">MAX LEVEL</span>
          <span className="text-xs text-flame-400">🔥 MASTER CHEF 🔥</span>
        </div>
        <div className="w-full bg-kitchen-800 rounded-full h-3 border border-hell-600">
          <div className="h-3 rounded-full bg-gradient-to-r from-hell-600 to-flame-600 hell-glow animate-hell-pulse w-full" />
        </div>
      </div>
    );
  }

  const levelXP = currentLevel.requiredXP;
  const nextLevelXP = nextLevel.requiredXP;
  const progressXP = currentXP - levelXP;
  const neededXP = nextLevelXP - levelXP;
  const percentage = Math.floor((progressXP / neededXP) * 100);

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-bold text-hell-300">
          Level {currentLevel.level} → {nextLevel.level}
        </span>
        <span className="text-xs text-flame-400">
          {progressXP} / {neededXP} XP
        </span>
      </div>
      <div className={`w-full bg-kitchen-800 rounded-full ${sizeClasses[size]} border border-steel-600`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-flame-500 to-hell-600 transition-all duration-1000 ease-out flame-glow"
          style={{ width: `${Math.max(2, percentage)}%` }}
        />
      </div>
      <div className="text-center mt-1">
        <span className="text-xs text-steel-300">{percentage}% Complete</span>
      </div>
    </div>
  );
}

export default function PlayerLevel({
  level,
  currentXP,
  nextLevel,
  size = 'md',
  showProgress = true,
  showTitle = true,
  className = ''
}: PlayerLevelProps) {
  const sizeClasses = {
    sm: {
      container: 'w-16 h-16',
      level: 'text-lg',
      icon: 'text-2xl',
      title: 'text-xs',
      description: 'text-xs'
    },
    md: {
      container: 'w-24 h-24',
      level: 'text-2xl',
      icon: 'text-3xl',
      title: 'text-sm',
      description: 'text-sm'
    },
    lg: {
      container: 'w-32 h-32',
      level: 'text-3xl',
      icon: 'text-5xl',
      title: 'text-base',
      description: 'text-base'
    }
  };

  const sizeConfig = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      {/* Level Badge */}
      <div className="relative group">
        <div
          className={`
            ${sizeConfig.container} rounded-full
            ${level.backgroundColor} ${level.textColor}
            border-4 border-steel-400
            flex flex-col items-center justify-center
            shadow-lg hover:scale-105 transition-transform duration-200
            cursor-pointer
          `}
        >
          {/* Level Number */}
          <div className={`font-extrabold ${sizeConfig.level} leading-none`}>
            {level.level}
          </div>
          {/* Level Icon */}
          <div className={`${sizeConfig.icon} leading-none`}>
            {level.icon}
          </div>
        </div>

        {/* Hover Tooltip */}
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <div className={`
            px-4 py-3 ${level.backgroundColor} ${level.textColor} rounded-lg shadow-xl border border-steel-500
            text-center min-w-max max-w-xs
          `}>
            <div className={`font-bold ${sizeConfig.title} mb-1`}>
              Level {level.level}: {level.title}
            </div>
            <div className={`${sizeConfig.description} opacity-90`}>
              {level.description}
            </div>
            {level.unlocks && (
              <div className={`${sizeConfig.description} text-flame-300 mt-2`}>
                <div className="font-semibold">Unlocks:</div>
                <ul className="text-left text-xs">
                  {level.unlocks.map((unlock, index) => (
                    <li key={index}>• {unlock}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-kitchen-800"></div>
        </div>
      </div>

      {/* Level Title */}
      {showTitle && (
        <div className="text-center">
          <div className={`font-bold ${sizeConfig.title} text-hell-300 leading-tight`}>
            {level.title}
          </div>
          <div className={`${sizeConfig.description} text-steel-400 mt-1`}>
            Level {level.level}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {showProgress && (
        <LevelProgressBar
          currentXP={currentXP}
          currentLevel={level}
          nextLevel={nextLevel}
          size={size}
          className="w-full max-w-xs"
        />
      )}
    </div>
  );
}

// Compact level indicator for headers/status bars
export function PlayerLevelCompact({
  level,
  currentXP,
  className = ''
}: {
  level: IPlayerLevel;
  currentXP: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`
        w-8 h-8 rounded-full ${level.backgroundColor} ${level.textColor}
        border-2 border-steel-400 flex items-center justify-center
        text-xs font-bold
      `}>
        {level.level}
      </div>
      <div className="flex flex-col">
        <div className="text-xs font-bold text-hell-300 leading-none">
          {level.title}
        </div>
        <div className="text-xs text-steel-400 leading-none">
          {currentXP.toLocaleString()} XP
        </div>
      </div>
    </div>
  );
}

// Level up notification component
export function LevelUpNotification({
  oldLevel,
  newLevel,
  onDismiss,
  className = ''
}: {
  oldLevel: IPlayerLevel;
  newLevel: IPlayerLevel;
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <div className={`
      bg-gradient-to-r from-hell-700 via-flame-600 to-hell-700
      border-2 border-flame-500 rounded-xl p-6 shadow-xl
      hell-glow animate-hell-pulse ${className}
    `}>
      <div className="text-center">
        <div className="text-3xl mb-2 animate-bounce">🎉</div>
        <div className="text-2xl font-bold text-white mb-2">
          LEVEL UP!
        </div>
        <div className="flex items-center justify-center space-x-4 mb-3">
          <div className="text-center">
            <div className="text-4xl mb-1">{oldLevel.icon}</div>
            <div className="text-sm text-flame-200">Level {oldLevel.level}</div>
          </div>
          <div className="text-3xl text-flame-300">→</div>
          <div className="text-center">
            <div className="text-4xl mb-1 animate-bounce">{newLevel.icon}</div>
            <div className="text-sm text-hell-200 font-bold">Level {newLevel.level}</div>
          </div>
        </div>
        <div className="text-xl font-bold text-hell-100 mb-2">
          {newLevel.title}
        </div>
        <div className="text-sm text-flame-200 mb-4">
          {newLevel.description}
        </div>
        {newLevel.unlocks && (
          <div className="bg-kitchen-900 rounded-lg p-3 mb-4">
            <div className="text-sm font-semibold text-flame-300 mb-2">
              New Unlocks:
            </div>
            <ul className="text-xs text-hell-200 space-y-1">
              {newLevel.unlocks.map((unlock, index) => (
                <li key={index}>🔓 {unlock}</li>
              ))}
            </ul>
          </div>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="bg-hell-600 hover:bg-hell-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Continue Cooking
          </button>
        )}
      </div>
    </div>
  );
}
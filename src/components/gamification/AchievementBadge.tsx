import type { Achievement } from '../../types/gamification';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
  isUnlocked?: boolean;
  isNew?: boolean;
  className?: string;
}

const rarityStyles = {
  common: {
    bg: 'bg-gradient-to-br from-steel-500 to-steel-700',
    border: 'border-steel-400',
    glow: '',
    text: 'text-steel-100'
  },
  rare: {
    bg: 'bg-gradient-to-br from-flame-600 to-flame-800',
    border: 'border-flame-500',
    glow: 'shadow-flame-glow',
    text: 'text-flame-100'
  },
  epic: {
    bg: 'bg-gradient-to-br from-hell-600 to-hell-800',
    border: 'border-hell-500',
    glow: 'shadow-hell-glow',
    text: 'text-hell-100'
  },
  legendary: {
    bg: 'bg-gradient-to-br from-hell-700 via-flame-600 to-hell-700',
    border: 'border-hell-400',
    glow: 'shadow-hell-glow animate-hell-pulse',
    text: 'text-white'
  }
};

export default function AchievementBadge({
  achievement,
  size = 'md',
  showDescription = false,
  isUnlocked = true,
  isNew = false,
  className = ''
}: AchievementBadgeProps) {
  const rarity = rarityStyles[achievement.rarity];

  const sizeClasses = {
    sm: {
      container: 'w-12 h-12',
      icon: 'text-xl',
      name: 'text-xs',
      description: 'text-xs'
    },
    md: {
      container: 'w-16 h-16',
      icon: 'text-2xl',
      name: 'text-sm',
      description: 'text-sm'
    },
    lg: {
      container: 'w-24 h-24',
      icon: 'text-4xl',
      name: 'text-base',
      description: 'text-base'
    }
  };

  const sizeConfig = sizeClasses[size];

  return (
    <div className={`group relative ${className}`}>
      {/* Achievement Badge */}
      <div className={`
        relative ${sizeConfig.container} rounded-xl border-2 ${rarity.border}
        ${isUnlocked ? `${rarity.bg} ${rarity.glow}` : 'bg-kitchen-800 border-kitchen-600'}
        ${isNew ? 'animate-bounce' : ''}
        ${isUnlocked ? '' : 'grayscale opacity-50'}
        transition-all duration-300 hover:scale-110 cursor-pointer
        flex items-center justify-center shadow-lg
      `}>
        {/* Achievement Icon */}
        <span className={`${sizeConfig.icon} ${isUnlocked ? rarity.text : 'text-kitchen-400'} filter drop-shadow-lg`}>
          {achievement.icon}
        </span>

        {/* Rarity Corner Indicator */}
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
          isUnlocked ? rarity.bg : 'bg-kitchen-700'
        } border border-white shadow-lg`}></div>

        {/* New Achievement Indicator */}
        {isNew && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-flame-500 rounded-full flex items-center justify-center animate-ping">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        )}
      </div>

      {/* Tooltip/Description */}
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <div className={`
          px-3 py-2 ${rarity.bg} ${rarity.text} rounded-lg shadow-xl border ${rarity.border}
          text-center min-w-max max-w-xs
        `}>
          <div className={`font-bold ${sizeConfig.name} mb-1`}>
            {achievement.name}
          </div>
          {showDescription && (
            <div className={`${sizeConfig.description} opacity-90`}>
              {achievement.description}
            </div>
          )}
          {achievement.reward.xp && (
            <div className={`${sizeConfig.description} text-flame-300 font-semibold mt-1`}>
              +{achievement.reward.xp} XP
            </div>
          )}
        </div>
        {/* Tooltip Arrow */}
        <div className={`absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent ${
          isUnlocked ? 'border-t-hell-800' : 'border-t-kitchen-800'
        }`}></div>
      </div>
    </div>
  );
}

// Component for displaying achievement notifications
export function AchievementNotificationCard({
  achievement,
  onDismiss,
  className = ''
}: {
  achievement: Achievement;
  onDismiss?: () => void;
  className?: string;
}) {
  const rarity = rarityStyles[achievement.rarity];

  return (
    <div className={`
      hell-kitchen-bg border-2 ${rarity.border} rounded-xl p-4 shadow-xl
      ${rarity.glow} ${className}
    `}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`
          flex-shrink-0 w-12 h-12 rounded-xl border-2 ${rarity.border}
          ${rarity.bg} flex items-center justify-center text-2xl shadow-md
        `}>
          {achievement.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-black uppercase tracking-widest text-flame-400 mb-0.5">
            Achievement Unlocked!
          </div>
          <div className="font-bold text-hell-100 leading-tight">
            {achievement.name}
          </div>
          <div className="text-xs text-steel-300 mt-0.5 leading-snug">
            {achievement.description}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-flame-600 text-white text-xs px-2 py-0.5 rounded-full font-black">
              +{achievement.reward.xp} XP
            </span>
            <span className="text-xs text-steel-400 font-semibold uppercase tracking-wide">
              {achievement.rarity}
            </span>
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 w-6 h-6 rounded-full bg-hell-700 hover:bg-hell-600 text-steel-300 hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
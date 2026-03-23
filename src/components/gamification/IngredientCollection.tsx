import type { Ingredient } from '../../types/gamification';

interface IngredientCardProps {
  ingredient: Ingredient;
  size?: 'sm' | 'md' | 'lg';
  isUnlocked?: boolean;
  isNew?: boolean;
  showDetails?: boolean;
  className?: string;
}

interface IngredientCollectionProps {
  ingredients: Ingredient[];
  unlockedIngredients: string[];
  size?: 'sm' | 'md' | 'lg';
  showLockedIngredients?: boolean;
  maxDisplay?: number;
  className?: string;
}

const rarityStyles = {
  common: {
    bg: 'bg-gradient-to-br from-steel-500 to-steel-700',
    border: 'border-steel-400',
    glow: '',
    text: 'text-steel-100',
    tag: 'bg-steel-600'
  },
  rare: {
    bg: 'bg-gradient-to-br from-flame-600 to-flame-800',
    border: 'border-flame-500',
    glow: 'shadow-flame-glow',
    text: 'text-flame-100',
    tag: 'bg-flame-700'
  },
  epic: {
    bg: 'bg-gradient-to-br from-hell-600 to-hell-800',
    border: 'border-hell-500',
    glow: 'shadow-hell-glow',
    text: 'text-hell-100',
    tag: 'bg-hell-700'
  },
  legendary: {
    bg: 'bg-gradient-to-br from-hell-700 via-flame-600 to-hell-700',
    border: 'border-hell-400',
    glow: 'shadow-hell-glow animate-hell-pulse',
    text: 'text-white',
    tag: 'bg-hell-800'
  }
};

const categoryColors = {
  protein: 'text-red-400',
  vegetable: 'text-green-400',
  spice: 'text-yellow-400',
  sauce: 'text-purple-400',
  tool: 'text-blue-400',
  technique: 'text-orange-400'
};

export function IngredientCard({
  ingredient,
  size = 'md',
  isUnlocked = false,
  isNew = false,
  showDetails = true,
  className = ''
}: IngredientCardProps) {
  const rarity = rarityStyles[ingredient.rarity];
  const categoryColor = categoryColors[ingredient.category];

  const sizeClasses = {
    sm: {
      container: 'w-20 h-24',
      icon: 'text-2xl',
      name: 'text-xs',
      description: 'text-xs'
    },
    md: {
      container: 'w-24 h-28',
      icon: 'text-3xl',
      name: 'text-sm',
      description: 'text-sm'
    },
    lg: {
      container: 'w-32 h-36',
      icon: 'text-4xl',
      name: 'text-base',
      description: 'text-base'
    }
  };

  const sizeConfig = sizeClasses[size];

  return (
    <div className={`group relative ${className}`}>
      <div className={`
        ${sizeConfig.container} rounded-xl border-2 ${rarity.border}
        ${isUnlocked ? `${rarity.bg} ${rarity.glow}` : 'bg-kitchen-800 border-kitchen-600'}
        ${isNew ? 'animate-bounce' : ''}
        ${isUnlocked ? '' : 'grayscale opacity-50'}
        transition-all duration-300 hover:scale-105 cursor-pointer
        flex flex-col items-center justify-center p-2 shadow-lg
      `}>
        {/* Ingredient Icon */}
        <div className={`${sizeConfig.icon} ${isUnlocked ? rarity.text : 'text-kitchen-400'} mb-1`}>
          {ingredient.icon}
        </div>

        {/* Ingredient Name */}
        <div className={`${sizeConfig.name} font-bold text-center leading-tight ${
          isUnlocked ? rarity.text : 'text-kitchen-400'
        }`}>
          {ingredient.name}
        </div>

        {/* Rarity Indicator */}
        <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
          isUnlocked ? rarity.tag : 'bg-kitchen-700'
        } border border-white shadow-sm`}></div>

        {/* Category Indicator */}
        <div className={`absolute top-1 left-1 text-xs ${categoryColor}`}>
          {ingredient.category === 'protein' && '🥩'}
          {ingredient.category === 'vegetable' && '🥬'}
          {ingredient.category === 'spice' && '🧂'}
          {ingredient.category === 'sauce' && '🫗'}
          {ingredient.category === 'tool' && '🔧'}
          {ingredient.category === 'technique' && '⚡'}
        </div>

        {/* New Ingredient Indicator */}
        {isNew && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-flame-500 rounded-full flex items-center justify-center animate-ping">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        )}

        {/* Locked Overlay */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-kitchen-900 bg-opacity-80 rounded-xl">
            <div className="text-2xl opacity-60">🔒</div>
          </div>
        )}
      </div>

      {/* Detailed Tooltip */}
      {showDetails && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <div className={`
            px-4 py-3 ${isUnlocked ? rarity.bg : 'bg-kitchen-800'} ${isUnlocked ? rarity.text : 'text-kitchen-300'}
            rounded-lg shadow-xl border ${isUnlocked ? rarity.border : 'border-kitchen-600'}
            text-center min-w-max max-w-xs
          `}>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-lg">{ingredient.icon}</span>
              <span className="font-bold">{ingredient.name}</span>
            </div>
            <div className="text-sm opacity-90 mb-2">
              {ingredient.description}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className={`px-2 py-1 rounded ${isUnlocked ? rarity.tag : 'bg-kitchen-700'}`}>
                {ingredient.rarity.toUpperCase()}
              </span>
              <span className={`${categoryColor} font-semibold`}>
                {ingredient.category.toUpperCase()}
              </span>
            </div>
            {!isUnlocked && (
              <div className="mt-2 text-xs text-flame-400">
                Unlock by: {ingredient.unlockedBy}
              </div>
            )}
          </div>
          {/* Tooltip Arrow */}
          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent ${
            isUnlocked ? 'border-t-hell-800' : 'border-t-kitchen-800'
          }`}></div>
        </div>
      )}
    </div>
  );
}

export default function IngredientCollection({
  ingredients,
  unlockedIngredients,
  size = 'md',
  showLockedIngredients = true,
  maxDisplay,
  className = ''
}: IngredientCollectionProps) {
  const unlockedSet = new Set(unlockedIngredients);

  const displayIngredients = showLockedIngredients
    ? ingredients
    : ingredients.filter(ingredient => unlockedSet.has(ingredient.id));

  const finalIngredients = maxDisplay
    ? displayIngredients.slice(0, maxDisplay)
    : displayIngredients;

  const unlockedCount = ingredients.filter(ingredient => unlockedSet.has(ingredient.id)).length;
  const totalCount = ingredients.length;

  return (
    <div className={`${className}`}>
      {/* Collection Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-hell-300">Ingredient Collection</h3>
          <p className="text-sm text-steel-400">
            {unlockedCount} / {totalCount} collected ({Math.round((unlockedCount / totalCount) * 100)}%)
          </p>
        </div>
        <div className="text-2xl">🧑‍🍳</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-kitchen-800 rounded-full h-2 mb-4 border border-steel-600">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-flame-500 to-hell-600 transition-all duration-1000 ease-out flame-glow"
          style={{ width: `${Math.max(2, (unlockedCount / totalCount) * 100)}%` }}
        />
      </div>

      {/* Ingredient Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {finalIngredients.map((ingredient) => (
          <IngredientCard
            key={ingredient.id}
            ingredient={ingredient}
            size={size}
            isUnlocked={unlockedSet.has(ingredient.id)}
            showDetails={true}
          />
        ))}
      </div>

      {/* Show More/Less Controls */}
      {maxDisplay && displayIngredients.length > maxDisplay && (
        <div className="text-center mt-4">
          <span className="text-sm text-steel-400">
            Showing {maxDisplay} of {displayIngredients.length} ingredients
          </span>
        </div>
      )}

      {/* Collection Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-kitchen-800 rounded-lg p-3 border border-steel-600">
          <div className="text-lg font-bold text-steel-300">{unlockedCount}</div>
          <div className="text-xs text-steel-400">Unlocked</div>
        </div>
        <div className="bg-kitchen-800 rounded-lg p-3 border border-steel-600">
          <div className="text-lg font-bold text-flame-400">
            {ingredients.filter(i => unlockedSet.has(i.id) && i.rarity === 'rare').length}
          </div>
          <div className="text-xs text-steel-400">Rare</div>
        </div>
        <div className="bg-kitchen-800 rounded-lg p-3 border border-steel-600">
          <div className="text-lg font-bold text-hell-400">
            {ingredients.filter(i => unlockedSet.has(i.id) && i.rarity === 'epic').length}
          </div>
          <div className="text-xs text-steel-400">Epic</div>
        </div>
        <div className="bg-kitchen-800 rounded-lg p-3 border border-steel-600">
          <div className="text-lg font-bold text-white">
            {ingredients.filter(i => unlockedSet.has(i.id) && i.rarity === 'legendary').length}
          </div>
          <div className="text-xs text-steel-400">Legendary</div>
        </div>
      </div>
    </div>
  );
}

// Compact ingredient showcase for notifications
export function IngredientUnlockedNotification({
  ingredient,
  onDismiss,
  className = ''
}: {
  ingredient: Ingredient;
  onDismiss?: () => void;
  className?: string;
}) {
  const rarity = rarityStyles[ingredient.rarity];
  const categoryColor = categoryColors[ingredient.category];

  return (
    <div className={`
      ${rarity.bg} ${rarity.border} ${rarity.glow}
      border-2 rounded-xl p-4 shadow-xl animate-slide-in-right
      ${className}
    `}>
      <div className="flex items-start space-x-3">
        <div className={`text-3xl ${rarity.text} animate-bounce`}>
          {ingredient.icon}
        </div>
        <div className="flex-1">
          <div className={`font-bold text-lg ${rarity.text} mb-1`}>
            Ingredient Unlocked!
          </div>
          <div className={`font-semibold ${rarity.text} mb-1`}>
            {ingredient.name}
          </div>
          <div className={`text-sm ${rarity.text} opacity-90 mb-2`}>
            {ingredient.description}
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className={`px-2 py-1 rounded text-xs font-medium ${rarity.tag}`}>
              {ingredient.rarity.toUpperCase()}
            </span>
            <span className={`${categoryColor} font-semibold text-xs`}>
              {ingredient.category.toUpperCase()}
            </span>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`text-xl ${rarity.text} hover:opacity-70 transition-opacity`}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
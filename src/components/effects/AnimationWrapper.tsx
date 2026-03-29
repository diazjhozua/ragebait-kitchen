import { ReactNode, useEffect, useState } from 'react';

interface AnimationWrapperProps {
  children: ReactNode;
  trigger?: 'hover' | 'score' | 'achievement' | 'error' | 'success' | 'loading' | 'auto';
  animation?: 'sizzle' | 'flame' | 'chaos' | 'steam' | 'boil' | 'rage' | 'celebration' | 'explosion';
  intensity?: 'low' | 'medium' | 'high';
  duration?: number; // in seconds
  delay?: number; // in milliseconds
  repeat?: boolean;
  score?: number; // for score-based animations
  className?: string;
}

const animationClasses = {
  sizzle: 'animate-sizzle',
  flame: 'animate-flame-flicker',
  chaos: 'animate-kitchen-chaos',
  steam: 'animate-steam',
  boil: 'animate-boil',
  rage: 'animate-gordon-rage',
  celebration: 'animate-level-celebration',
  explosion: 'animate-score-explosion'
};

const intensityModifiers = {
  low: 'opacity-50 scale-95',
  medium: '',
  high: 'opacity-100 scale-105 saturate-125'
};

export default function AnimationWrapper({
  children,
  trigger = 'auto',
  animation = 'flame',
  intensity = 'medium',
  duration = 2,
  delay = 0,
  repeat = true,
  score = 0,
  className = ''
}: AnimationWrapperProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(animation);

  // Determine animation based on score
  useEffect(() => {
    if (trigger === 'score') {
      if (score >= 95) {
        setCurrentAnimation('explosion');
        setIsAnimating(true);
      } else if (score >= 85) {
        setCurrentAnimation('rage');
        setIsAnimating(true);
      } else if (score >= 70) {
        setCurrentAnimation('flame');
        setIsAnimating(true);
      } else if (score >= 50) {
        setCurrentAnimation('sizzle');
        setIsAnimating(true);
      } else {
        setIsAnimating(false);
      }
    }
  }, [score, trigger]);

  // Auto-trigger animations
  useEffect(() => {
    if (trigger === 'auto') {
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [trigger, delay]);

  // Animation duration control
  useEffect(() => {
    if (isAnimating && !repeat) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [isAnimating, duration, repeat]);

  const animationClass = isAnimating ? animationClasses[currentAnimation] : '';
  const intensityClass = isAnimating ? intensityModifiers[intensity] : '';

  const wrapperProps = trigger === 'hover' ? {
    onMouseEnter: () => setIsAnimating(true),
    onMouseLeave: () => setIsAnimating(false)
  } : {};

  return (
    <div
      className={`transition-all duration-200 ${animationClass} ${intensityClass} ${className}`}
      style={{
        animationDuration: repeat ? `${duration}s` : `${duration}s`,
        animationIterationCount: repeat ? 'infinite' : '1',
        animationDelay: `${delay}ms`
      }}
      {...wrapperProps}
    >
      {children}
    </div>
  );
}

// Specialized wrappers for common use cases
export function ScoreAnimationWrapper({
  children,
  score,
  className = ''
}: {
  children: ReactNode;
  score: number;
  className?: string;
}) {
  return (
    <AnimationWrapper
      trigger="score"
      score={score}
      intensity={score >= 90 ? 'high' : score >= 70 ? 'medium' : 'low'}
      duration={2}
      repeat={false}
      className={className}
    >
      {children}
    </AnimationWrapper>
  );
}

export function AchievementAnimationWrapper({
  children,
  isNew = false,
  rarity = 'common',
  className = ''
}: {
  children: ReactNode;
  isNew?: boolean;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  className?: string;
}) {
  const animations = {
    common: 'sizzle' as const,
    rare: 'flame' as const,
    epic: 'rage' as const,
    legendary: 'explosion' as const
  };

  return (
    <AnimationWrapper
      trigger={isNew ? 'auto' : 'hover'}
      animation={animations[rarity]}
      intensity={rarity === 'legendary' ? 'high' : rarity === 'epic' ? 'medium' : 'low'}
      duration={isNew ? 2 : 1}
      repeat={isNew}
      className={className}
    >
      {children}
    </AnimationWrapper>
  );
}

export function KitchenToolWrapper({
  children,
  tool = 'generic',
  className = ''
}: {
  children: ReactNode;
  tool?: 'knife' | 'pan' | 'oven' | 'plate' | 'generic';
  className?: string;
}) {
  const toolAnimations = {
    knife: 'chaos' as const,
    pan: 'sizzle' as const,
    oven: 'steam' as const,
    plate: 'boil' as const,
    generic: 'flame' as const
  };

  return (
    <AnimationWrapper
      trigger="hover"
      animation={toolAnimations[tool]}
      intensity="medium"
      duration={1}
      repeat={false}
      className={`kitchen-tool ${className}`}
    >
      {children}
    </AnimationWrapper>
  );
}

// Background animation component for environment effects
export function KitchenAmbiance({
  intensity = 'medium',
  score = 0,
  className = ''
}: {
  intensity?: 'low' | 'medium' | 'high';
  score?: number;
  className?: string;
}) {
  const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    const particleCount = intensity === 'high' ? 20 : intensity === 'medium' ? 12 : 6;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: `particle-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 2000
    }));
    setParticles(newParticles);
  }, [intensity, score]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Steam particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white opacity-20 animate-steam"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}ms`
          }}
        />
      ))}

      {/* Heat shimmer effect */}
      {score >= 80 && (
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-hell-600/10 to-transparent animate-pulse" />
      )}

      {/* Chaos overlay for very high scores */}
      {score >= 95 && (
        <div className="absolute inset-0 animate-kitchen-chaos opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-hell-800/20 via-flame-600/20 to-hell-800/20" />
        </div>
      )}
    </div>
  );
}
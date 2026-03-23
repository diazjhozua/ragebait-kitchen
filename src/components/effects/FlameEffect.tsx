import { useEffect, useState } from 'react';

interface FlameParticle {
  id: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
}

interface FlameEffectProps {
  intensity?: 'low' | 'medium' | 'high';
  color?: 'orange' | 'red' | 'blue' | 'hell';
  size?: 'sm' | 'md' | 'lg';
  duration?: number; // in seconds, 0 for infinite
  className?: string;
}

const flameColors = {
  orange: ['#ff6b35', '#f7931e', '#ffcc02'],
  red: ['#dc2626', '#991b1b', '#7f1d1d'],
  blue: ['#3b82f6', '#1d4ed8', '#1e40af'],
  hell: ['#dc2626', '#991b1b', '#f97316']
};

const intensitySettings = {
  low: { particleCount: 8, speed: 0.5 },
  medium: { particleCount: 15, speed: 0.8 },
  high: { particleCount: 25, speed: 1.2 }
};

const sizeSettings = {
  sm: { width: 40, height: 60 },
  md: { width: 80, height: 120 },
  lg: { width: 120, height: 180 }
};

export default function FlameEffect({
  intensity = 'medium',
  color = 'orange',
  size = 'md',
  duration = 0,
  className = ''
}: FlameEffectProps) {
  const [particles, setParticles] = useState<FlameParticle[]>([]);
  const [isActive, setIsActive] = useState(true);

  const settings = intensitySettings[intensity];
  const dimensions = sizeSettings[size];
  const colors = flameColors[color];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => setIsActive(false), duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setParticles(prev => {
        // Update existing particles
        const updated = prev.map(particle => ({
          ...particle,
          x: particle.x + particle.velocity.x,
          y: particle.y + particle.velocity.y,
          opacity: particle.opacity * 0.96,
          size: particle.size * 0.99,
          life: particle.life - 1,
          velocity: {
            x: particle.velocity.x * 0.98,
            y: particle.velocity.y - 0.1
          }
        })).filter(particle => particle.life > 0 && particle.opacity > 0.01);

        // Add new particles if needed
        while (updated.length < settings.particleCount) {
          const newParticle: FlameParticle = {
            id: Math.random().toString(36),
            x: (dimensions.width / 2) + (Math.random() - 0.5) * 20,
            y: dimensions.height - 10,
            size: 3 + Math.random() * 4,
            opacity: 0.7 + Math.random() * 0.3,
            color: colors[Math.floor(Math.random() * colors.length)],
            velocity: {
              x: (Math.random() - 0.5) * settings.speed,
              y: -(Math.random() * 2 + 1) * settings.speed
            },
            life: 60 + Math.random() * 40,
            maxLife: 60 + Math.random() * 40
          };
          updated.push(newParticle);
        }

        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, settings, dimensions, colors]);

  if (!isActive && particles.length === 0) return null;

  return (
    <div
      className={`relative overflow-hidden pointer-events-none ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height
      }}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0"
      >
        {particles.map(particle => (
          <circle
            key={particle.id}
            cx={particle.x}
            cy={particle.y}
            r={particle.size}
            fill={particle.color}
            opacity={particle.opacity}
            style={{
              filter: 'blur(0.5px)',
              mixBlendMode: 'screen'
            }}
          />
        ))}
      </svg>

      {/* Base flame glow */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-full animate-flame-flicker"
        style={{
          width: dimensions.width * 0.6,
          height: dimensions.height * 0.3,
          background: `radial-gradient(ellipse, ${colors[0]}40, transparent)`,
          filter: 'blur(8px)'
        }}
      />
    </div>
  );
}

// Simple CSS-only flame effect for better performance
export function SimpleFlameEffect({
  size = 'md',
  color = 'orange',
  className = ''
}: {
  size?: 'sm' | 'md' | 'lg';
  color?: 'orange' | 'red' | 'blue' | 'hell';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-6 h-8',
    md: 'w-10 h-12',
    lg: 'w-16 h-20'
  };

  const colorClasses = {
    orange: 'from-flame-600 via-flame-500 to-flame-400',
    red: 'from-hell-700 via-hell-600 to-hell-500',
    blue: 'from-blue-700 via-blue-600 to-blue-500',
    hell: 'from-hell-800 via-flame-600 to-flame-500'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className={`
        absolute inset-0 rounded-full
        bg-gradient-to-t ${colorClasses[color]}
        animate-flame-flicker opacity-80
        transform scale-110 blur-sm
      `} />
      <div className={`
        absolute inset-0 rounded-full
        bg-gradient-to-t ${colorClasses[color]}
        animate-flame-flicker opacity-90
        animation-delay-75
      `} />
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-1/2 h-1/3">
        <div className={`
          w-full h-full rounded-full
          bg-gradient-to-t from-white to-transparent
          opacity-40 animate-bounce
        `} />
      </div>
    </div>
  );
}

// Rage flame effect that responds to score levels
export function RageFlameEffect({
  score,
  size = 'md',
  className = ''
}: {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const getFlameProps = (score: number) => {
    if (score >= 90) {
      return { intensity: 'high' as const, color: 'hell' as const, duration: 0 };
    } else if (score >= 70) {
      return { intensity: 'high' as const, color: 'red' as const, duration: 0 };
    } else if (score >= 50) {
      return { intensity: 'medium' as const, color: 'orange' as const, duration: 0 };
    } else if (score >= 30) {
      return { intensity: 'low' as const, color: 'orange' as const, duration: 0 };
    } else {
      return null; // No flames for low scores
    }
  };

  const flameProps = getFlameProps(score);

  if (!flameProps) {
    return null;
  }

  return (
    <FlameEffect
      {...flameProps}
      size={size}
      className={className}
    />
  );
}

// Hell's Kitchen themed flame border effect
export function FlameBorder({
  children,
  intensity = 'medium',
  className = ''
}: {
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}) {
  const flames = Array.from({ length: intensity === 'low' ? 3 : intensity === 'medium' ? 5 : 8 });

  return (
    <div className={`relative ${className}`}>
      {children}

      {/* Top flames */}
      <div className="absolute -top-2 left-0 right-0 flex justify-around pointer-events-none">
        {flames.map((_, i) => (
          <SimpleFlameEffect
            key={`top-${i}`}
            size="sm"
            color="hell"
            className={`animate-flame-flicker delay-${i * 100}`}
          />
        ))}
      </div>

      {/* Bottom flames */}
      <div className="absolute -bottom-2 left-0 right-0 flex justify-around pointer-events-none">
        {flames.map((_, i) => (
          <SimpleFlameEffect
            key={`bottom-${i}`}
            size="sm"
            color="orange"
            className={`animate-flame-flicker delay-${i * 150} transform rotate-180`}
          />
        ))}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { getRandomLoadingMessage } from '../../utils/constants';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showRandomMessages?: boolean;
}

export default function LoadingSpinner({
  message,
  size = 'md',
  className = '',
  showRandomMessages = false
}: LoadingSpinnerProps) {
  const [currentMessage, setCurrentMessage] = useState(message || '');

  // Cycle through random loading messages if enabled
  useEffect(() => {
    if (!showRandomMessages || message) return;

    setCurrentMessage(getRandomLoadingMessage());

    const interval = setInterval(() => {
      setCurrentMessage(getRandomLoadingMessage());
    }, 2000);

    return () => clearInterval(interval);
  }, [showRandomMessages, message]);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerPadding = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerPadding[size]} ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full animate-spin`}>
          <div className={`${sizeClasses[size]} border-4 border-rage-600 rounded-full border-t-transparent animate-spin`}></div>
        </div>

        {/* Chef hat animation overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-lg'} animate-bounce`}>
            👨‍🍳
          </span>
        </div>
      </div>

      {currentMessage && (
        <p className={`text-center text-gray-600 mt-3 ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'} font-medium animate-pulse`}>
          {currentMessage}
        </p>
      )}
    </div>
  );
}
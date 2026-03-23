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
        {/* Hell's Kitchen spinner with flame effect */}
        <div className={`${sizeClasses[size]} border-4 border-kitchen-600 rounded-full animate-spin opacity-50`}>
          <div className={`${sizeClasses[size]} border-4 border-hell-600 rounded-full border-t-transparent animate-spin hell-glow`}></div>
        </div>

        {/* Inner flame spinner */}
        <div className="absolute inset-1">
          <div className={`${sizeClasses[size]} border-2 border-flame-500 rounded-full border-r-transparent animate-spin reverse-spin`} style={{ width: 'calc(100% - 8px)', height: 'calc(100% - 8px)' }}></div>
        </div>

        {/* Gordon's face animation overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-lg'} animate-bounce filter drop-shadow-lg`}>
            😡
          </span>
        </div>
      </div>

      {currentMessage && (
        <div className="text-center mt-4">
          <p className={`text-hell-300 ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'} font-bold animate-pulse`}>
            {currentMessage}
          </p>
          <div className="mt-2 flex justify-center space-x-1">
            <div className="w-1 h-1 bg-flame-500 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-flame-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-1 h-1 bg-flame-500 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      )}
    </div>
  );
}
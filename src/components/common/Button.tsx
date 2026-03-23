import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'chef' | 'hell';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  withFlame?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText = 'Loading...',
  fullWidth = false,
  disabled,
  className = '',
  withFlame = false,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg';

  const variants = {
    primary: 'bg-hell-600 hover:bg-hell-700 text-white focus:ring-hell-500 border border-hell-500 hover:shadow-hell-glow',
    secondary: 'bg-kitchen-600 hover:bg-kitchen-700 text-white focus:ring-kitchen-500 border border-steel-400 hover:shadow-steel-gleam',
    danger: 'bg-hell-800 hover:bg-hell-900 text-white focus:ring-hell-400 border border-hell-600 hover:shadow-hell-glow',
    outline: 'border-2 border-hell-600 text-hell-600 hover:bg-hell-600 hover:text-white focus:ring-hell-500 hover:shadow-hell-glow bg-transparent',
    chef: 'bg-flame-600 hover:bg-flame-700 text-white focus:ring-flame-500 border border-flame-500 hover:shadow-flame-glow font-chef',
    hell: 'bg-gradient-to-r from-hell-800 to-hell-600 hover:from-hell-900 hover:to-hell-700 text-white focus:ring-hell-400 border border-hell-500 hover:shadow-hell-glow animate-hell-pulse'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const flameClass = withFlame ? 'relative overflow-hidden' : '';

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${flameClass} ${className}`;

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {withFlame && (
        <div className="absolute inset-0 opacity-30 animate-flame-flicker">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-flame-500 rounded-full"></div>
          <div className="absolute bottom-1 left-1/3 transform -translate-x-1/2 w-1 h-1 bg-flame-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-1 right-1/3 transform translate-x-1/2 w-1 h-1 bg-flame-400 rounded-full animate-bounce delay-75"></div>
        </div>
      )}
      {isLoading ? (
        <>
          <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
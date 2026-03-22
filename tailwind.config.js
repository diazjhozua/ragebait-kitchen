/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hell's Kitchen theme colors
        'hell': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626', // Primary Hell's Kitchen red
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        'kitchen': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280', // Steel gray
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#111111', // Kitchen black
        },
        'flame': {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Flame orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Keep existing rage colors for compatibility
        rage: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      fontFamily: {
        'chef': ['Georgia', 'Times New Roman', 'serif'],
        'hell': ['Inter', 'system-ui', 'sans-serif'], // Bold, competitive font
      },
      backgroundImage: {
        'hell-gradient': 'linear-gradient(135deg, #111111 0%, #1f2937 50%, #dc2626 100%)',
        'kitchen-steel': 'linear-gradient(90deg, #6b7280 0%, #9ca3af 50%, #6b7280 100%)',
        'flame-gradient': 'linear-gradient(45deg, #f97316 0%, #ea580c 50%, #c2410c 100%)',
      },
      boxShadow: {
        'hell': '0 10px 25px -3px rgba(220, 38, 38, 0.3), 0 4px 6px -2px rgba(220, 38, 38, 0.1)',
        'flame': '0 0 20px rgba(249, 115, 22, 0.4), 0 0 40px rgba(249, 115, 22, 0.2)',
        'steel': '0 4px 6px -1px rgba(107, 114, 128, 0.1), 0 2px 4px -1px rgba(107, 114, 128, 0.06)',
      },
      animation: {
        'flame-flicker': 'flameFlicker 2s ease-in-out infinite',
        'steel-gleam': 'steelGleam 3s ease-in-out infinite',
        'hell-pulse': 'hellPulse 2s ease-in-out infinite',
        'kitchen-smoke': 'kitchenSmoke 4s linear infinite',
      },
    },
  },
  plugins: [],
}
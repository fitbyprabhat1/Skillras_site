/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF0000',
          light: '#FF3333',
          dark: '#CC0000',
          darker: '#990000',
        },
        secondary: {
          DEFAULT: '#FF4444',
          light: '#FF6666',
          dark: '#DD2222',
        },
        accent: {
          DEFAULT: '#FF1111',
          light: '#FF5555',
          dark: '#BB0000',
        },
        dark: {
          DEFAULT: '#000000',
          light: '#1A1A1A',
          lighter: '#2D2D2D',
          lightest: '#404040',
        },
        gray: {
          900: '#0A0A0A',
          800: '#1F1F1F',
          700: '#2E2E2E',
          600: '#404040',
          500: '#525252',
          400: '#6B6B6B',
          300: '#8B8B8B',
          200: '#A3A3A3',
          100: '#D4D4D4',
        },
        light: {
          DEFAULT: '#FFFFFF',
          dark: '#F8F8F8',
          darker: '#F0F0F0',
        },
        // Red variants for different uses
        red: {
          50: '#FFF5F5',
          100: '#FFE3E3',
          200: '#FFC9C9',
          300: '#FFA8A8',
          400: '#FF8A8A',
          500: '#FF0000', // Primary red
          600: '#E60000',
          700: '#CC0000',
          800: '#B30000',
          900: '#990000',
        }
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 0, 0, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 0, 0, 0.8)' },
        },
        redGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255, 0, 0, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 0, 0, 0.6)' },
        },
        pulseRed: {
          '0%, 100%': { 
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(255, 0, 0, 0.7)'
          },
          '70%': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 0 10px rgba(255, 0, 0, 0)'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        counterUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        rotateIn: {
          '0%': { transform: 'rotate(-10deg) scale(0.95)', opacity: '0' },
          '100%': { transform: 'rotate(0) scale(1)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite',
        redGlow: 'redGlow 2s ease-in-out infinite',
        pulseRed: 'pulseRed 2s infinite',
        float: 'float 6s ease-in-out infinite',
        counterUp: 'counterUp 0.8s ease-out forwards',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        slideUp: 'slideUp 0.5s ease-out forwards',
        slideDown: 'slideDown 0.5s ease-out forwards',
        slideLeft: 'slideLeft 0.5s ease-out forwards',
        slideRight: 'slideRight 0.5s ease-out forwards',
        rotateIn: 'rotateIn 0.6s ease-out forwards',
        scaleIn: 'scaleIn 0.4s ease-out forwards',
        bounceIn: 'bounceIn 0.6s ease-out forwards'
      },
      backgroundImage: {
        'red-gradient': 'linear-gradient(135deg, #FF0000 0%, #990000 100%)',
        'red-gradient-dark': 'linear-gradient(135deg, #CC0000 0%, #660000 100%)',
        'dark-gradient': 'linear-gradient(135deg, #000000 0%, #1A1A1A 100%)',
        'red-black-gradient': 'linear-gradient(135deg, #FF0000 0%, #000000 100%)',
        'black-red-gradient': 'linear-gradient(135deg, #000000 0%, #FF0000 100%)',
      },
      boxShadow: {
        'red': '0 4px 14px 0 rgba(255, 0, 0, 0.15)',
        'red-lg': '0 10px 25px -3px rgba(255, 0, 0, 0.2)',
        'red-xl': '0 20px 50px -12px rgba(255, 0, 0, 0.25)',
        'dark': '0 4px 14px 0 rgba(0, 0, 0, 0.5)',
        'dark-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.6)',
        'dark-xl': '0 20px 50px -12px rgba(0, 0, 0, 0.7)',
        'inset-red': 'inset 0 2px 4px 0 rgba(255, 0, 0, 0.1)',
      },
      borderColor: {
        'red': '#FF0000',
        'red-light': '#FF3333',
        'red-dark': '#CC0000',
      },
      textColor: {
        'red': '#FF0000',
        'red-light': '#FF3333',
        'red-dark': '#CC0000',
      }
    },
  },
  plugins: [],
};
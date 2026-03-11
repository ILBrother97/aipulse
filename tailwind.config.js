/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-accent, #00D9FF)',
          dark: 'var(--color-accent-dark, #00B8D9)',
          light: 'var(--color-accent-light, #33E0FF)',
        },
        background: {
          DEFAULT: '#F5F5F5',
          dark: '#0D0D0D',
          card: '#FFFFFF',
          cardHover: '#F0F0F0',
          light: '#F5F5F5',
          cardLight: '#FFFFFF',
        },
        text: {
          primary: '#1A1A1A',
          secondary: '#525252',
          muted: '#737373',
          primaryDark: '#E5E5E5',
          secondaryDark: '#A3A3A3',
          mutedDark: '#A3A3A3',
        },
        border: {
          DEFAULT: '#E5E5E5',
          dark: '#2A2A2A',
          light: '#E5E5E5',
          hover: '#D4D4D4',
        }
      },

      fontFamily: {
        sans: ['Inter', 'Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'slide-in': 'slideIn 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-subtle': 'bounceSubtle 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}

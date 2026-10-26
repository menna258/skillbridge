/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2f9', 100: '#d5def0', 200: '#aebde0', 300: '#7f95c9', 400: '#536faf',
          500: '#365294', 600: '#273f78', 700: '#1d3061', 800: '#15234a', 900: '#0d1733', 950: '#080f22',
        },
        teal: {
          50: '#effcfa', 100: '#c8f5ee', 200: '#93eadd', 300: '#56d7c7', 400: '#26bcad',
          500: '#0fa094', 600: '#0a8079', 700: '#0d6662', 800: '#10514f', 900: '#124442',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Cairo', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(13, 23, 51, 0.18)',
        card: '0 1px 2px rgba(13,23,51,0.06), 0 8px 24px -12px rgba(13,23,51,0.15)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'none' } },
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        'slide-in': { '0%': { opacity: 0, transform: 'translateY(-8px) scale(0.98)' }, '100%': { opacity: 1, transform: 'none' } },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'slide-in': 'slide-in 0.25s ease-out both',
      },
    },
  },
  plugins: [],
}

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'his-dark': '#080c1f',
        'his-navy': '#0f1e40',
        'his-navy-light': '#172349',
        'his-bg': '#ffffff',
        'his-muted': '#f8fafc',
        'his-card': '#ffffff',
        'his-border': '#e2e8f0',
        'his-blue': '#4f6ef7',
        'his-blue-light': '#6b8aff',
        'his-green': '#3cb87a',
        'his-green-hover': '#33a86e',
        'his-teal': '#2dd4bf',
        'his-teal-light': '#5eead4',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #060818 0%, #0a1230 40%, #070d22 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(79,110,247,0.08) 0%, rgba(15,21,48,0) 100%)',
        'blue-gradient': 'linear-gradient(90deg, #4f6ef7 0%, #818cf8 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config

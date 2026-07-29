import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#161A1D',
        paper: '#F6F5F1',
        surface: '#FFFFFF',
        line: '#E4E1D8',
        muted: '#6B6A63',
        navy: {
          DEFAULT: '#16232E',
          50: '#EEF2F5',
          100: '#D6DEE4',
          400: '#2C4356',
          600: '#1D3040',
          900: '#0D151C',
        },
        amber: {
          DEFAULT: '#E8A33D',
          50: '#FDF4E5',
          100: '#FAE6C2',
          400: '#EDB35D',
          500: '#E8A33D',
          600: '#C7822A',
          700: '#9C651F',
        },
        status: {
          requested: '#B7791F',
          accepted: '#2B6CB0',
          declined: '#C53030',
          paid: '#6B46C1',
          progress: '#2F855A',
          completed: '#4A5568',
          cancelled: '#822727',
        },
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'ui-sans-serif', 'system-ui'],
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'ticket-notch':
          'radial-gradient(circle 6px at 0 50%, transparent 6px, currentColor 6.5px), radial-gradient(circle 6px at 100% 50%, transparent 6px, currentColor 6.5px)',
      },
    },
  },
  plugins: [],
};

export default config;

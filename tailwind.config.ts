import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ebff',
          500: '#2b6cb0',
          600: '#245a94',
          700: '#1d4a7a',
        },
      },
    },
  },
  plugins: [],
};

export default config;

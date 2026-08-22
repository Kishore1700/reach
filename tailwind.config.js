/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Customer / Aqua Mint Accent (#00DDB3)
        customer: {
          DEFAULT: '#00DDB3',
          light: '#33E4C2',
          dark: '#00C49F',
          bg: 'rgba(0, 221, 179, 0.1)',
          border: 'rgba(0, 221, 179, 0.3)'
        },
        // Manager - Deep Dark Navy Blue (#18223B)
        manager: {
          DEFAULT: '#18223B',
          light: '#243256',
          dark: '#0F172A',
          card: '#FFFFFF',
          header: '#F8FAFC',
          border: '#E2E8F0'
        },
        // Primary Mint / Teal Accent
        growth: {
          DEFAULT: '#00DDB3',
          light: '#33E4C2',
          dark: '#00C49F',
          bg: 'rgba(0, 221, 179, 0.1)',
          border: 'rgba(0, 221, 179, 0.3)'
        },
        // Secondary Indigo / Soft Accent (#6366F1)
        empathy: {
          DEFAULT: '#6366F1',
          light: '#818CF8',
          dark: '#4F46E5',
          bg: 'rgba(99, 102, 241, 0.1)',
          border: 'rgba(99, 102, 241, 0.3)'
        },
        // Background & Clarity Colors
        clarity: {
          DEFAULT: '#F8FAFC',
          muted: '#E2E8F0',
          border: '#CBD5E1',
          cardBg: '#FFFFFF',
          surface: '#F1F5F9'
        },
        brand: {
          50: '#E6FAF5',
          100: '#CCF5EB',
          200: '#99ECE0',
          300: '#66E2D4',
          400: '#33D8C9',
          500: '#00DDB3',
          600: '#00C49F',
          700: '#18223B',
          800: '#111827',
          900: '#0F172A',
          950: '#0B0F19',
        },
        sidebar: {
          bg: '#18223B',
          hover: 'rgba(255, 255, 255, 0.08)',
          active: '#00DDB3',
          text: '#94A3B8',
          textActive: '#0F172A'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}

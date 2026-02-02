/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: '#18181b',
        surfaceHighlight: '#27272a',
        border: '#3f3f46',
        primary: '#3b82f6',
        secondary: '#f97316',
        accent: '#8b5cf6',
        text: {
          main: '#e4e4e7',
          muted: '#a1a1aa',
          dim: '#71717a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}

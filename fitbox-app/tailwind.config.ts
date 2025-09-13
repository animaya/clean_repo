import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Kanban board colors
        'kanban': {
          'todo': '#f3f4f6',
          'progress': '#dbeafe',
          'review': '#fef3c7',
          'done': '#dcfce7',
        },
        // Task status colors
        'task': {
          'low': '#10b981',
          'medium': '#f59e0b',
          'high': '#ef4444',
        }
      },
      animation: {
        // Drag and drop animations
        'drag-enter': 'dragEnter 0.2s ease-in-out',
        'drag-over': 'dragOver 0.15s ease-in-out infinite alternate',
        'drag-drop': 'dragDrop 0.3s ease-out',
      },
      keyframes: {
        dragEnter: {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0px rgba(59, 130, 246, 0)' },
          '100%': { transform: 'scale(1.02)', boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3)' },
        },
        dragOver: {
          '0%': { backgroundColor: 'rgba(59, 130, 246, 0.05)' },
          '100%': { backgroundColor: 'rgba(59, 130, 246, 0.1)' },
        },
        dragDrop: {
          '0%': { transform: 'scale(1.02) rotate(1deg)' },
          '50%': { transform: 'scale(0.98) rotate(-0.5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
      },
      cursor: {
        'grabbing': 'grabbing',
      },
      boxShadow: {
        'drag': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'drop-zone': '0 0 0 2px rgba(59, 130, 246, 0.3), 0 0 10px rgba(59, 130, 246, 0.1)',
      },
      transitionProperty: {
        'drag': 'transform, box-shadow, background-color',
      }
    },
  },
  plugins: [],
}
export default config
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        heading: ['var(--font-outfit)', 'Outfit', 'sans-serif'],
      },
      colors: {
        toy: {
          yellow: "#FFD23F",
          red: "#FF3366",
          orange: "#FF7844",
          blue: "#2EC4B6",
          navy: "#0E131F",
          purple: "#7209B7",
          green: "#06D6A0",
          pink: "#F72585",
          light: "#F8FAFC",
        }
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        'toy': '0 8px 0 0 rgba(0, 0, 0, 0.08)',
        'toy-sm': '0 4px 0 0 rgba(0, 0, 0, 0.08)',
        'toy-colored': '0 6px 0 0 rgba(255, 120, 68, 0.3)',
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 2s infinite ease-in-out',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
};
export default config;

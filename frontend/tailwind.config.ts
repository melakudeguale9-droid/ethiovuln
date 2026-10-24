import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'var(--font-inter)',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'var(--font-jetbrains)',
          'JetBrains Mono',
          'Fira Code',
          'Consolas',
          'monospace',
        ],
      },
      letterSpacing: {
        tighter: '-0.005em',
        tight: '0em',
        normal: '0.015em',
        wide: '0.035em',
        wider: '0.06em',
        widest: '0.12em',
      },
      lineHeight: {
        relaxed: '1.75',
        loose: '2',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gray: {
          150: "#E6EDF3",
        },
        slate: {
          150: "#E2E8F0",
        },
        cyber: {
          bg: "#090D16",
          surface: "#111827",
          "surface-2": "#0F172A",
          border: "#1E293B",
          text: "#F8FAFC",
          muted: "#94A3B8",
          cyan: "#11D9E8",
        },
      },
    },
  },
  plugins: [],
};

export default config;

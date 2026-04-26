/** @type {import('tailwindcss').Config} */

// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
    screens: {
      'sm': '640px',
      // scale down font further and adjust flex/grid layouts possibly?

      'md': '1000px',
      // scaled down font and flex/grid changes

      'lg': '1280px',
      // default beyond this at 1280px

    },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        destructive: "var(--color-destructive)",
        success: "var(--color-success)",
        background: "var(--color-background)",
        backgroundAlt: "var(--color-background-alt)",
        foreground: "var(--color-foreground)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
      },

      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },

      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
      },

      fontFamily: {
        sans: ["var(--font-sans)"],
      },
    },
  },

  plugins: [],
};

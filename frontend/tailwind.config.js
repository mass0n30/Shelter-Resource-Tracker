/** @type {import('tailwindcss').Config} */

// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
    screens: {
      'xs': '480px',

      'sm': '640px',
      // scale down font further and adjust flex/grid layouts possibly?

      'md': '1000px',
      // scaled down font and flex/grid changes

      'lg': '1280px',
      // default beyond this at 1280px

    },
      height: {
        navHeight: "var(--nav-height)",
        headerHeight: "var(--header-height)",
      },
      colors: {
        primary: "var(--color-primary)",
        primaryDark: "var(--color-primary-dark)",
        primaryLight: "var(--color-primary-light)",
        secondary: "var(--color-secondary)",
        destructive: "var(--color-destructive)",
        success: "var(--color-success)",
        background: "var(--color-background)",
        backgroundAlt: "var(--color-background-alt)",
        foreground: "var(--color-foreground)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        accentOrange: "var(--accent-orange)",
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

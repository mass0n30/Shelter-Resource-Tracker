/** @type {import('tailwindcss').Config} */


export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
];
/* defining custom colors with custom names, using CSS variables for better integration with vanilla CSS */
export const theme = {
extend: {
  colors: {
    background: "rgb(var(--background))",
    foreground: "rgb(var(--foreground))",
    border: "rgb(var(--border))",
  },
}
};
export const plugins = [];

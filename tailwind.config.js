/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffeac6',
        accent: '#f19e31',
        'accent-light': '#f4ad4f',
        text: '#2a2a2a',
      },
      screens: {
        'tablet': '768px',
        'ipad': '1024px',
        'ipad-pro': '1366px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}

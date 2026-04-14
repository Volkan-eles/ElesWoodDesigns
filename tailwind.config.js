/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'neo-yellow': "#FFE500",
        'neo-bg': "#FFFDF0",
      },
      boxShadow: {
        'neo': "4px 4px 0px 0px #000000",
        "neo-hover": "2px 2px 0px 0px #000000",
        "neo-lg": "6px 6px 0px 0px #000000",
        "neo-lg-hover": "3px 3px 0px 0px #000000",
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      fontFamily: {
        sans: ["var(--font-space)", "sans-serif"],
      },
    },
  },
  plugins: [],
}

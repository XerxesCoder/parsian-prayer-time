/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        vazir: ["Vazirmatn-Regular", "sans-serif"],
        "vazir-bold": ["Vazirmatn-Bold", "sans-serif"],
      },
    },
  },
  plugins: [],
};

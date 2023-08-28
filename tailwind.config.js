/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: [
  //   "./index.html",
  //   "./src/**/*.{html,js,vue}"
  // ],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}


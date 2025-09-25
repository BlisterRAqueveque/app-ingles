/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}', // páginas y componentes Angular
    './node_modules/@ionic/**/*.{js,ts}', // opcional: ionic components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

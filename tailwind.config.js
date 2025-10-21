/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}', // páginas y componentes Angular
    './node_modules/@ionic/**/*.{js,ts}', // opcional: ionic components
  ],
  theme: {
    extend: {
      colors: {
        // 🌿 Verdes
        green: {
          900: '#008200', // RGB(0,130,0)
          800: '#009600', // RGB(0,150,0)
          700: '#00AA00', // RGB(0,170,0)
          600: '#4CCE44', // RGB(76,204,68)
          500: '#66D566', // RGB(102,213,102)
          400: '#99E399', // RGB(153,227,153)
          300: '#CCF1CC', // RGB(204,241,204)
          200: '#E8F9E8', // RGB(235,249,235)
          100: '#F0FBE0', // RGB(240,251,240)
          50: '#F5FCF5', // RGB(245,252,245)
        },

        // 🔵 Azules
        blue: {
          900: '#4C98FF', // RGB(76,152,255)
          800: '#669AFF', // RGB(102,167,255)
          700: '#99C4FF', // RGB(153,196,255)
          600: '#CCE2FF', // RGB(204,226,255)
          500: '#EBF3FF', // RGB(235,243,255)
          400: '#F0F6FF', // RGB(240,246,255)
          300: '#F5F9FF', // RGB(245,249,255)
        },

        // ⚫ Grises / Neutros
        gray: {
          900: '#1E1E1E', // RGB(30,30,30)
          800: '#424242', // RGB(66,66,66)
        },
      },
    },
  },
  plugins: [],
};

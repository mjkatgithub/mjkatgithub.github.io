module.exports = {
  plugins: [
    require('@tailwindcss/typography')
  ],
  theme: {
    extend: {
      colors: {
        'custom-gray': '#819cbb', // Basisfarbe
        'custom-gray-light': '#9ab2cc', // Etwas heller
      },
    },
  },
}
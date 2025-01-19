import { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './app/**/*.{vue,js,ts}', // Alles im `app`-Ordner
    './content/**/*.{md,yaml,json}', // Inhalte in Nuxt Content
  ],
  plugins: [
    typography, // TailwindCSS Typography-Plugin
  ],
  theme: {
    extend: {
      colors: {
        'custom-gray': '#819cbb', // Basisfarbe
        'custom-gray-light': '#9ab2cc', // Etwas heller
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none', // Entfernt die Begrenzung der maximalen Breite
          },
        },
      },
    },
  },
};

export default config;

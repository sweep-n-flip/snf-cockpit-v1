import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: ['./app/**/*.{tsx,ts}', './lib/**/*.{tsx,ts}'],
  darkMode: 'class',
  corePlugins: {
    container: false,
  },
  plugins: [
    plugin(({ addUtilities }) => {
      const utility = {
        '.container': {
          width: '100%',
          margin: 'auto',
          paddingRight: '1rem',
          paddingLeft: '1rem',

          '@screen md': {
            maxWidth: '768px',
          },
          '@screen lg': {
            maxWidth: '1200px',
          },
          '@screen xl': {
            maxWidth: '1420px',
          },
        },
      }

      addUtilities(utility)
    }),
  ],
  theme: {
    extend: {
      colors: {
        'color-primary': {
          DEFAULT: '#FF2E00',
        },
      },
    },
  },
}
export default config

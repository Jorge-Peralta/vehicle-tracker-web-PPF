import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import { es } from 'primelocale/js/es.js'
import { env } from './env'

/** Aura with a blue primary color, matching the app's SCSS tokens. */
const AppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
    // Aura uses shade 500 for primary buttons and accents; 500 on white is only 3.7:1.
    // Shade 600 meets the WCAG AA 4.5:1 contrast for text.
    colorScheme: {
      light: {
        primary: {
          color: '{primary.600}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}',
        },
      },
    },
  },
})

// primelocale lags behind PrimeReact 11 by two accessibility labels.
const spanishMessages = {
  ...es,
  aria: { ...es.aria, toggleSidebar: 'Alternar barra lateral', filter: 'Filtrar' },
}

/** Props for `<PrimeReactProvider>`: theme, Spanish texts (calendar, tables), and license. */
export const primeReactConfig = {
  theme: {
    preset: AppPreset,
    // Light theme only; dark mode is out of scope.
    options: { darkModeSelector: 'none' },
  },
  locale: 'es',
  locales: { es: spanishMessages },
  license: env.primeReactLicense,
}

import { createVuetify } from 'vuetify'
import 'vuetify/styles'

const shared = {
  VBtn: {
    rounded: '0',
    elevation: 0,
    style: "font-family: 'JetBrains Mono', monospace; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; font-size: 11px;",
  },
  VCard: {
    rounded: '0',
    elevation: 0,
  },
  VSheet: {
    rounded: '0',
    elevation: 0,
  },
  VTextField: {
    variant: 'outlined',
    density: 'comfortable',
    rounded: '0',
  },
  VSelect: {
    variant: 'outlined',
    density: 'comfortable',
    rounded: '0',
  },
  VTextarea: {
    variant: 'outlined',
    density: 'comfortable',
    rounded: '0',
  },
  VChip: {
    rounded: '0',
  },
  VDialog: {
    scrollStrategy: 'none',
  },
  VAvatar: {
    rounded: '0',
  },
  VSnackbar: {
    rounded: '0',
  },
}

export default createVuetify({
  theme: {
    defaultTheme: 'carryit',
    themes: {
      carryit: {
        dark: false,
        colors: {
          primary:    '#B0392E',  // stamp red (was hot pink)
          secondary:  '#1B2A4A',  // indigo (was meadow green)
          background: '#F1E7D2',  // parchment / cream (was lavender)
          surface:    '#FAF6EC',  // warm paper white
          error:      '#9B2A20',  // stamp red darker
          warning:    '#C9A24A',  // gold (was amber)
          success:    '#1B2A4A',  // indigo (mapped from old success=meadow)
          info:       '#C8D4EA',  // dusty indigo-sky
          'on-primary':   '#FAF6EC',
          'on-secondary': '#FAF6EC',
        },
      },
      carryitDark: {
        dark: true,
        colors: {
          primary:    '#B0392E',
          secondary:  '#E2C883',  // amber-pale (LCD glow) for dark mode
          background: '#121212',
          surface:    '#1e1e1e',
          error:      '#C44A3D',
          warning:    '#C9A24A',
          success:    '#E2C883',
          info:       '#7DA0D4',
          'on-primary':    '#FAF6EC',
          'on-secondary':  '#0A0A0A',
          'on-background': '#F0EDE8',
          'on-surface':    '#F0EDE8',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
  },
  defaults: shared,
})

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
          primary:    '#FF4DA6',
          secondary:  '#3D5B3E',
          background: '#E9DEEA',
          surface:    '#FAFAF7',
          error:      '#C23B3B',
          warning:    '#E8A94A',
          success:    '#3D5B3E',
          info:       '#C8DCEA',
          'on-primary': '#FAFAF7',
          'on-secondary': '#FAFAF7',
        },
      },
      carryitDark: {
        dark: true,
        colors: {
          primary:    '#FF4DA6',
          secondary:  '#A3D977',
          background: '#121212',
          surface:    '#1e1e1e',
          error:      '#E55555',
          warning:    '#E8A94A',
          success:    '#A3D977',
          info:       '#7DB8D4',
          'on-primary': '#FAFAF7',
          'on-secondary': '#0A0A0A',
          'on-background': '#F0EDE8',
          'on-surface': '#F0EDE8',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
  },
  defaults: shared,
})

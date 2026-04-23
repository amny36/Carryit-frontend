import { defineStore } from 'pinia'

const DARK_KEY = 'carryit_dark_mode'

export const useAppStore = defineStore('app', {
  state: () => ({
    loading: false,
    darkMode: localStorage.getItem(DARK_KEY) === 'true',
    snackbar: {
      show: false,
      message: '',
      color: 'success',
      timeout: 3000,
    },
  }),

  actions: {
    setLoading(v) {
      this.loading = !!v
    },

    toggleDarkMode() {
      this.darkMode = !this.darkMode
      localStorage.setItem(DARK_KEY, String(this.darkMode))
    },

    setDarkMode(v) {
      this.darkMode = !!v
      localStorage.setItem(DARK_KEY, String(this.darkMode))
    },

    showSnackbar(message, color = 'success') {
      this.snackbar.message = message
      this.snackbar.color = color
      this.snackbar.show = true
    },

    hideSnackbar() {
      this.snackbar.show = false
    },
  },
})

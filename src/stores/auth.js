import { defineStore } from 'pinia'
import { mockUsers } from '@/data/mock.js'

const STORAGE_KEY = 'carryit_user'

export const useAuthStore = defineStore('auth', {
  state: () => {
    let user = null
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) user = JSON.parse(stored)
    } catch (_) {}
    return { user }
  },

  getters: {
    isLoggedIn: (state) => !!state.user,
    isTraveler: (state) => state.user?.role === 'traveler',
    isSender:   (state) => state.user?.role === 'sender',
    userName:   (state) => state.user?.name || 'Guest',
    userInitials: (state) => {
      const name = state.user?.name || state.user?.email || 'U'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },
  },

  actions: {
    setUser(u) {
      this.user = u
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(u)) } catch (_) {}
    },

    clearUser() {
      this.user = null
      try { localStorage.removeItem(STORAGE_KEY) } catch (_) {}
    },

    logout() {
      this.clearUser()
    },

    refreshUser() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        this.user = stored ? JSON.parse(stored) : null
      } catch (_) {
        this.user = null
      }
    },

    login(email, _password) {
      const found = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
      if (found) { this.setUser(found); return true }
      return false
    },

    register(userData) {
      const newUser = {
        id: 'u' + Date.now(),
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role: userData.role || 'sender',
        city: userData.city || '',
        trustScore: 0,
        kycStatus: 'pending',
        totalTrips: 0,
        totalEarnings: 0,
        totalBookings: 0,
        bio: userData.bio || '',
        joinedDate: new Date().toISOString().split('T')[0],
        ...userData,
      }
      mockUsers.push(newUser)
      this.setUser(newUser)
      return newUser
    },
  },
})

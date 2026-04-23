import { defineStore } from 'pinia'
import { mockTrips } from '@/data/mock.js'

export const useTripsStore = defineStore('trips', {
  state: () => ({
    trips: [...mockTrips],
    searchParams: {
      origin: '',
      destination: '',
      date: '',
      weight: 1,
    },
    searchResults: [],
    selectedTrip: null,
    myTrips: [],
  }),

  actions: {
    setSearchParams(params) {
      this.searchParams = { ...this.searchParams, ...params }
    },

    searchTrips() {
      const { origin, destination, date, weight } = this.searchParams

      let results = mockTrips.filter((trip) => {
        if (trip.status !== 'active') return false

        if (origin && origin.trim() !== '') {
          if (!trip.origin.toLowerCase().includes(origin.trim().toLowerCase())) {
            return false
          }
        }

        if (destination && destination.trim() !== '') {
          if (!trip.destination.toLowerCase().includes(destination.trim().toLowerCase())) {
            return false
          }
        }

        if (date && date.trim() !== '') {
          if (trip.date !== date.trim()) {
            return false
          }
        }

        const requiredWeight = Number(weight) || 1
        if (trip.availableKg < requiredWeight) {
          return false
        }

        return true
      })

      // Sort by travelerScore descending
      results = results.sort((a, b) => b.travelerScore - a.travelerScore)

      this.searchResults = results
    },

    selectTrip(trip) {
      this.selectedTrip = trip
    },

    fetchTripDetail(id) {
      const trip = mockTrips.find((t) => t.id === id) || null
      this.selectedTrip = trip
    },

    fetchMyTrips(userId) {
      this.myTrips = mockTrips.filter((t) => t.travelerId === userId)
    },

    postTrip(tripData) {
      const newTrip = {
        id: 't' + Date.now(),
        status: 'active',
        travelerScore: 0,
        ...tripData,
      }
      this.trips.push(newTrip)
      mockTrips.push(newTrip)
      this.myTrips.push(newTrip)
      return newTrip
    },

    cancelTrip(id) {
      const trip = this.trips.find((t) => t.id === id)
      if (trip) {
        trip.status = 'cancelled'
      }

      const mockTrip = mockTrips.find((t) => t.id === id)
      if (mockTrip) {
        mockTrip.status = 'cancelled'
      }

      const myTrip = this.myTrips.find((t) => t.id === id)
      if (myTrip) {
        myTrip.status = 'cancelled'
      }
    },
  },
})

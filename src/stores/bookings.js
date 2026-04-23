import { defineStore } from 'pinia'
import { mockBookings, computeBookingPrice } from '@/data/mock.js'

export const useBookingsStore = defineStore('bookings', {
  state: () => ({
    myBookings: [],
    currentBooking: null,
    bookingRequests: [],
    allBookings: [...mockBookings],
  }),

  actions: {
    fetchMyBookings(userId) {
      this.myBookings = this.allBookings.filter(
        (b) => b.senderId === userId || b.travelerId === userId
      )
    },

    setCurrentBooking(booking) {
      this.currentBooking = booking
    },

    createBooking(data) {
      const { totalPrice, platformFee, travelerPayout } = computeBookingPrice(
        data.kgBooked || 1,
        data.pricePerKg || 0
      )

      const generatePickupCode = () =>
        'PCK-' + Math.floor(1000 + Math.random() * 9000)

      const generateOtp = () =>
        String(Math.floor(1000 + Math.random() * 9000))

      const newBooking = {
        id: 'b' + Date.now(),
        status: 'pending',
        totalPrice,
        platformFee,
        travelerPayout,
        pickupCode: generatePickupCode(),
        deliveryOtp: generateOtp(),
        createdAt: new Date().toISOString().split('T')[0],
        ...data,
      }

      this.allBookings.push(newBooking)
      this.myBookings.push(newBooking)
      this.currentBooking = newBooking
      mockBookings.push(newBooking)

      return newBooking
    },

    updateStatus(id, status) {
      const booking = this.allBookings.find((b) => b.id === id)
      if (booking) {
        booking.status = status
      }

      const myBooking = this.myBookings.find((b) => b.id === id)
      if (myBooking) {
        myBooking.status = status
      }

      const reqBooking = this.bookingRequests.find((b) => b.id === id)
      if (reqBooking) {
        reqBooking.status = status
      }

      const mockBooking = mockBookings.find((b) => b.id === id)
      if (mockBooking) {
        mockBooking.status = status
      }

      if (this.currentBooking && this.currentBooking.id === id) {
        this.currentBooking = { ...this.currentBooking, status }
      }
    },

    acceptRequest(id) {
      this.updateStatus(id, 'accepted')
    },

    rejectRequest(id) {
      this.updateStatus(id, 'rejected')
    },

    fetchBookingRequests(travelerId) {
      this.bookingRequests = this.allBookings.filter(
        (b) => b.travelerId === travelerId && b.status === 'pending'
      )
    },
  },
})

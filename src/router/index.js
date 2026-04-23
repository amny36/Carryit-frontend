import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/',                     component: () => import('@/views/LandingPage.vue') },
  { path: '/about',                component: () => import('@/views/shared/AboutPage.vue') },
  { path: '/settings',             component: () => import('@/views/shared/SettingsPage.vue') },

  // Auth
  { path: '/auth/signin',          component: () => import('@/views/auth/SignIn.vue') },
  { path: '/auth/signup',          component: () => import('@/views/auth/SignUp.vue') },
  { path: '/auth/verify',          component: () => import('@/views/auth/IdVerification.vue') },
  { path: '/auth/profile-setup',   component: () => import('@/views/auth/ProfileSetUp.vue') },

  // Shared
  { path: '/profile',              component: () => import('@/views/shared/ProfilePage.vue') },
  { path: '/notifications',        component: () => import('@/views/shared/Notifications.vue') },
  { path: '/chat',                 component: () => import('@/views/shared/Chat.vue') },
  { path: '/chat/:id',             component: () => import('@/views/shared/Chat.vue') },

  // Sender
  { path: '/sender/search',        component: () => import('@/views/sender/SearchTrips.vue') },
  { path: '/sender/results',       component: () => import('@/views/sender/TripResults.vue') },
  { path: '/sender/trip/:id',      component: () => import('@/views/sender/TripDetail.vue') },
  { path: '/sender/book/:tripId',  component: () => import('@/views/sender/BookingForm.vue') },
  { path: '/sender/booking/:id/confirmation', component: () => import('@/views/sender/BookingConfirmation.vue') },
  { path: '/sender/bookings',      component: () => import('@/views/sender/MyBookings.vue') },
  { path: '/sender/tracking/:id',  component: () => import('@/views/sender/BookingTracking.vue') },

  // Traveler
  { path: '/traveler/post-trip',   component: () => import('@/views/traveler/PostTrip.vue') },
  { path: '/traveler/trips',       component: () => import('@/views/traveler/MyTrips.vue') },
  { path: '/traveler/requests',    component: () => import('@/views/traveler/BookingRequests.vue') },
  { path: '/traveler/earnings',    component: () => import('@/views/traveler/Earnings.vue') },

  // Delivery
  { path: '/delivery/active/:id',  component: () => import('@/views/delivery/ActiveDelivery.vue') },
  { path: '/delivery/scan',        component: () => import('@/views/delivery/QRScanner.vue') },
  { path: '/delivery/handoff/:id', component: () => import('@/views/delivery/QRHandoff.vue') },
  { path: '/delivery/otp/:id',     component: () => import('@/views/delivery/OTPConfirmation.vue') },

  // Post-delivery
  { path: '/review/:id',           component: () => import('@/views/post-delivery/RatingReview.vue') },
  { path: '/dispute/:id',          component: () => import('@/views/post-delivery/DisputeForm.vue') },

  // 404
  { path: '/:pathMatch(.*)*',      component: () => import('@/views/NotFound.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

export default router

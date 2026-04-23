# CarryIt Frontend

> Peer-to-peer cargo delivery — ship packages with trusted travelers

## Overview

CarryIt connects **senders** (people who need to ship packages) with **travelers** (people with extra luggage space). Travelers earn money by carrying packages along their existing routes. Payments are escrow-protected and released only after confirmed delivery.

## Tech Stack

| Tool | Purpose |
|------|---------|
| Vue 3 | UI Framework (Composition API) |
| Vuetify 3 | Material Design Component Library |
| Pinia | State Management |
| Vue Router 4 | Client-side Routing |
| Vite | Build Tool & Dev Server |

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
cd Carryit-frontend
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Demo Accounts

Use these credentials on the Sign In page, or click the demo buttons:

| Role | Name | Email | Password |
|------|------|-------|----------|
| Traveler | Alex Dupont | alex@carryit.com | demo123 |
| Sender | Marie Laurent | marie@carryit.com | demo123 |

> No backend required — all data is in-memory and resets on page refresh.

## Project Structure

```
Carryit-frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.js                    # App entry point
    ├── App.vue                    # Root component + snackbar
    ├── assets/
    │   └── styles/
    │       └── main.css           # Global design tokens & utilities
    ├── plugins/
    │   └── vuetify.js             # Vuetify theme configuration
    ├── router/
    │   └── index.js               # All routes
    ├── stores/
    │   ├── auth.js                # Current user state
    │   ├── trips.js               # Trip search & management
    │   ├── bookings.js            # Booking CRUD
    │   └── app.js                 # Global UI state (loading, snackbar)
    ├── data/
    │   └── mock.js                # Mock users, trips, bookings, messages
    ├── components/
    │   ├── AppNavbar.vue          # Top + bottom navigation
    │   ├── StatusPill.vue         # Color-coded status badge
    │   ├── TrustScore.vue         # Star rating display
    │   ├── TripCard.vue           # Trip listing card
    │   ├── BookingCard.vue        # Booking summary card
    │   ├── PriceBreakdown.vue     # LCD-style price calculator
    │   ├── RequestCard.vue        # Booking request (traveler view)
    │   ├── ConfirmDialog.vue      # Reusable confirm modal
    │   ├── LoadingSpinner.vue     # Loading overlay
    │   └── NotificationItem.vue  # Notification row
    └── views/
        ├── LandingPage.vue        # Public homepage
        ├── NotFound.vue           # 404 page
        ├── auth/
        │   ├── SignIn.vue         # Login
        │   ├── SignUp.vue         # Registration + role select
        │   ├── IdVerification.vue # KYC document upload
        │   └── ProfileSetUp.vue   # Profile completion
        ├── sender/
        │   ├── SearchTrips.vue    # Trip search form
        │   ├── TripResults.vue    # Search results list
        │   ├── TripDetail.vue     # Trip + traveler detail + price calc
        │   ├── BookingForm.vue    # 3-step booking wizard
        │   ├── BookingConfirmation.vue  # Success + pickup code
        │   ├── MyBookings.vue     # Sender's booking history
        │   └── BookingTracking.vue     # Real-time delivery status
        ├── traveler/
        │   ├── PostTrip.vue       # Create trip offer
        │   ├── MyTrips.vue        # Traveler's posted trips
        │   ├── BookingRequests.vue # Accept/reject incoming bookings
        │   └── Earnings.vue       # Revenue dashboard
        ├── delivery/
        │   ├── ActiveDelivery.vue  # Step-by-step handoff flow
        │   ├── QRScanner.vue       # Package QR scanning
        │   ├── QRHandoff.vue       # Pickup confirmation
        │   └── OTPConfirmation.vue # Recipient delivery OTP
        ├── post-delivery/
        │   ├── RatingReview.vue   # Bilateral rating form
        │   └── DisputeForm.vue    # Post-delivery dispute filing
        └── shared/
            ├── ProfilePage.vue    # User profile + settings
            ├── Notifications.vue  # Notification center
            └── Chat.vue           # In-app messaging
```

## Key Features

### For Senders 📦
- **Search trips** by origin, destination, date, and weight
- **Book cargo space** with a 3-step guided form
- **Prohibited item screening** — auto-detects dangerous keywords
- **Track packages** in real-time through delivery stages
- **OTP delivery confirmation** — receive via 4-digit code
- **File disputes** within 48 hours of delivery

### For Travelers ✈️
- **Post trip offers** with available space and price per kg
- **Accept/reject** incoming booking requests
- **QR code handoffs** at pickup and delivery
- **Earnings dashboard** with monthly breakdown
- **Request payouts** (simulated in demo)

### Trust & Safety 🛡️
- KYC identity verification flow
- Escrow-protected payments (simulated)
- Trust score system (0–5★ based on reviews)
- 48-hour dispute window

## Design System

The app uses a **retro-digital / neo-brutalist** aesthetic inspired by boarding passes and LCD displays.

| Token | Value | Usage |
|-------|-------|-------|
| `--pink` | `#FF4DA6` | Primary actions, CTAs |
| `--green` | `#3D5B3E` | Secondary, success |
| `--twilight` | `#E9DEEA` | Page background |
| `--surface` | `#FAFAF7` | Card backgrounds |
| `--lcd-dark` | `#141a14` | LCD panels, dark cards |
| `--phosphor` | `#A3D977` | LCD text, live indicators |
| `--amber` | `#E8A94A` | Warm status, boarding pass |

Fonts loaded from Google Fonts:
- **Archivo** — body text
- **JetBrains Mono** — codes, data
- **VT323** — retro LCD display text

## Notes

- This is a **frontend-only** demo. No backend is required.
- All data resets when you refresh the page.
- To simulate different user roles, sign in with different demo accounts.
- The app is designed mobile-first but works on desktop.

## License

MIT — Built for CarryIt demo purposes.

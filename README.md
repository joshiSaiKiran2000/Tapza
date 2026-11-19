# Tapza Care – Mobile Healthcare Application

> **Senior React Native Engineer Technical Assessment – Tapza Technologies**  
> A production-grade, config-driven mobile healthcare application built with **React Native**, **Expo SDK 58**, **Strict TypeScript**, and **React Navigation**. Specially tailored for Indian patients and families with Hyderabad clinic support, bilingual Hindi/English guidance, optimistic booking updates, and dose adherence tracking.

---

## 🚀 How to Run

### 1. Prerequisites

- **Node.js**: v18 or higher (developed & tested on Node v22 / v20)
- **Package Manager**: `npm` (or `bun` / `yarn`)
- **Device / Emulator**:
  - **Physical Device**: Install the **Expo Go** app from Google Play Store or Apple App Store.
  - **Android Emulator**: Android Studio with an active virtual device (AVD).

### 2. Installation & Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/joshiSaiKiran2000/Tapza.git
cd Tapza
npm install
```

### 3. Verification & Quality Checks

Run TypeScript compiler check to verify zero type errors:

```bash
npm run typecheck
```

Run the complete automated unit and integration test suite (43 tests across 9 test suites):

```bash
npm test
```

### 4. Running the Development Server

Start the Expo development server:

```bash
npx expo start
```

- **Physical Device**: Scan the QR code displayed in the terminal using the Expo Go camera (Android) or default Camera app (iOS).
- **Android Emulator**: Press `a` in the terminal to launch the app inside your running emulator.
- **Web Preview**: Press `w` to open the local browser preview.

### 5. Building & Releasing the Standalone Android APK

The project includes pre-configured [eas.json](file:///c:/Users/sai/Desktop/Tapza/eas.json) and [app.json](file:///c:/Users/sai/Desktop/Tapza/app.json) for Android builds.

#### Option A: Cloud Build via EAS (Recommended — No Android Studio or Java SDK required)
```bash
# 1. Log in to your Expo account
npx eas-cli@latest login

# 2. Build direct installable standalone APK
npx eas-cli@latest build --platform android --profile preview
```
When the build completes, EAS outputs a direct download link and QR code to install the `.apk` on any Android device.

#### Option B: Offline / Local Build via Gradle (Windows PowerShell)
```powershell
# 1. Generate native Android files
npx expo prebuild --platform android

# 2. Build Release APK
cd android
.\gradlew.bat assembleRelease
```
The compiled APK will be generated at `android/app/build/outputs/apk/release/app-release.apk`.

---

## 📂 Folder Structure and Why

```text
Tapza/
├── __tests__/                    # Automated unit & integration tests
│   ├── bookingConflict.test.ts   # Concurrency HTTP 409 conflict & rollback tests
│   ├── bookingState.test.ts      # Slot booking state machine tests
│   ├── components.test.tsx       # Common UI component test suite
│   ├── configValidation.test.ts  # Zod schema validation tests
│   ├── diwaliMode.test.tsx       # Admin panel, Diwali toggle & mock resilience tests
│   ├── dynamicSectionRendering.test.tsx # Config-driven dynamic section render tests
│   ├── prescriptions.test.ts     # Compound-key medicine dose tracking tests
│   ├── resilience.test.tsx       # Offline cache & error boundary fallback tests
│   ├── theme.test.tsx            # Theme provider, dark mode & token tests
│   └── unknownSectionHandling.test.tsx  # Graceful fallback for unknown config types
├── assets/                       # App icons, splash screens, adaptive icons
├── src/                          # Application source code
│   ├── api/                      # Network client & backend simulation layer
│   │   ├── client.ts             # Centralized Axios client & mock adapter (latency, 500, 409)
│   │   ├── mockDoctors.ts        # Seeded Hyderabad doctors, clinics & slot generators
│   │   └── mockPrescriptions.ts  # Real-world Indian prescriptions & dosage regimens
│   ├── components/               # Domain-driven modular UI components
│   │   ├── booking/              # DateSelectorStrip, SlotSelectionBottomSheet
│   │   ├── common/               # AppText, AppCard, AppButton, AppBadge, Skeletons, EmptyState
│   │   ├── home/                 # Dynamic section renderers & festive decorations
│   │   │   ├── CategoryChipsSection.tsx  # Service categories (General, Dental, etc.)
│   │   │   ├── DiwaliDecoration.tsx      # Hanging Toran garland & marigold celebration banner
│   │   │   ├── DoctorCarouselSection.tsx # Top-rated doctors horizontal carousel
│   │   │   ├── DynamicSectionRenderer.tsx# Dynamic layout engine dispatcher
│   │   │   ├── HeroBannerSection.tsx     # Seasonal/promo banner with custom CTA
│   │   │   ├── MedicalIllustration.tsx   # Custom SVG medical shield graphic
│   │   │   ├── OfferStripSection.tsx     # Discount coupon banner (DIWALI35 / FIRSTCARE)
│   │   │   ├── QuickActionsSection.tsx   # Fast shortcuts (Instant consult, Pharmacy, etc.)
│   │   │   └── ServiceGridSection.tsx    # Comprehensive preventive care grid
│   │   └── prescriptions/        # Dose adherence cards, progress bars, dose checkboxes
│   ├── config/                   # Remote configuration contracts & JSON defaults
│   │   ├── schema.ts             # Strict Zod schema for remote JSON validation
│   │   ├── types.ts              # Inferred TypeScript contracts from Zod schemas
│   │   ├── normalConfig.json     # Clinical Teal theme & standard home layout
│   │   └── diwaliConfig.json     # Festive Diwali theme, offers & reordered layout
│   ├── hooks/                    # Reusable reactive logic hooks
│   │   ├── useBookingFlow.ts     # Optimistic booking state machine & conflict rollback
│   │   ├── usePrescriptions.ts   # Daily dose adherence calculation & persistence
│   │   └── useRemoteConfig.ts    # Config fetching, offline caching & theme switching
│   ├── navigation/               # Type-safe routing definitions
│   │   ├── BottomTabNavigator.tsx# Bottom tabs: Home, Bookings, Prescriptions, Profile
│   │   └── RootNavigator.tsx     # Native Stack: AdminPanel, DoctorDetails, BookingFlow
│   ├── screens/                  # Top-level screen views
│   │   ├── AdminPanelScreen.tsx  # Diwali toggle, theme customizer & chaos simulator
│   │   ├── BookingDetailsScreen.tsx  # Confirmed appointment details & map instructions
│   │   ├── BookingsScreen.tsx    # Attended & upcoming appointment history
│   │   ├── BookingSuccessScreen.tsx  # Animated confirmation with spring checkmark
│   │   ├── DoctorDetailsScreen.tsx   # Doctor bio, clinic info, reviews & slot trigger
│   │   ├── DoctorSearchScreen.tsx    # Search & specialty filter view
│   │   ├── HomeScreen.tsx        # Dynamic config-driven home screen with pull-to-refresh
│   │   ├── PrescriptionDetailsScreen.tsx # Detailed regimen instructions & precautions
│   │   ├── PrescriptionsScreen.tsx   # Active prescriptions & daily dose checkboxes
│   │   └── ProfileScreen.tsx     # Account information, dark mode & Admin Panel navigation
│   ├── services/                 # Pure business logic and side-effect services
│   │   ├── configService.ts      # Config fetching, Zod parsing, cache & fallbacks
│   │   ├── developerSettings.ts  # Runtime chaos flags (latency, 500, empty list, 409)
│   │   ├── doctorService.ts      # Doctor filtering, search, and slot reservation
│   │   ├── prescriptionService.ts# Dose adherence storage operations
│   │   └── storageService.ts     # Typed AsyncStorage wrapper with JSON parsing
│   ├── theme/                    # Design tokens & dynamic styling engine
│   │   ├── ThemeContext.tsx      # Central theme provider, custom colors & typography scaling
│   │   ├── tokens.ts             # Base light/dark palettes, radii, spacing, typography
│   │   └── types.ts              # Theme contract definitions
│   └── types/                    # Shared TypeScript domain contracts
│       ├── booking.ts            # Doctor, Slot, Booking models
│       ├── navigation.ts         # NavigationParamList & ScreenProps
│       └── prescription.ts       # Prescription, Medication, DoseTiming models
├── app.json                      # Expo application manifest
├── eas.json                      # EAS Build profiles (APK standalone output)
├── package.json                  # Dependencies & npm scripts
├── tsconfig.json                 # Strict TypeScript configuration
└── README.md                     # Comprehensive technical documentation
```

### Why this Structure?

1. **Separation of Concerns (SOC)**:
   - UI components (`src/components/`) know only how to render props; they contain no direct HTTP or database calls.
   - Services (`src/services/`) handle asynchronous I/O, caching, and persistence; they have no dependency on React or JSX.
   - Hooks (`src/hooks/`) bridge the UI and services with reactive lifecycle states.
2. **Domain-Driven Grouping**:
   - Booking, Prescriptions, and Home modules are grouped into dedicated component subdirectories, making the codebase intuitive to navigate and maintain.
3. **Resilience Isolation**:
   - `src/config/` cleanly isolates remote contracts, validation schemas, and bundled JSON fallbacks from the UI layout code.

---

## 🏛 Architecture Decisions

### 1. Config-Driven Dynamic Layout Engine
- **Why**: Healthcare applications frequently need seasonal promotions, emergency advisories, or revised home layouts without forcing app store updates.
- **Implementation**: The home screen layout is defined entirely by the `GET /config` endpoint. Every section payload is parsed and validated at runtime using a strict **Zod schema** (`appRemoteConfigSchema`).
- **Resilience**: If the remote server sends an unexpected or malformed section type, the `DynamicSectionRenderer` silently skips it or renders a safe fallback without crashing the app.

### 2. Dual-Layer Theme & Admin Customization System
- **Why**: Users need both preset festive experiences (Diwali mode) and personal accessibility overrides (custom background colors, text colors, font scaling).
- **Implementation**:
  - `ThemeProvider` lives at the application root and manages color schemes, custom user overrides, and scaled typography (`small`, `normal`, `large`, `xl`).
  - `ThemeProvider` subscribes directly to `developerSettingsService` to update theme colors autonomously, preventing illegal cross-component `setState` calls during render cycles.
  - When Diwali mode is activated, warm marigold/maroon colors, festive Toran garlands, Diya illustrations, and special discount codes (`DIWALI35`) are injected in real time.

### 3. Native-Safe Navigation with React Navigation 7
- **Why**: Traditional React Navigation provides explicit compile-time type-safety (`RootStackParamList`, `MainTabParamList`) and predictable screen mount lifecycles.
- **Implementation**: Native Stack Navigator for smooth hardware-accelerated transitions and Bottom Tab Navigator for primary app destinations, with zero reliance on magic file-based routing.

### 4. Chaos Engineering & Offline Resilience (Mock Backend Adapter)
- **Why**: Mobile networks in real-world clinic settings fluctuate between 4G, 2G, and offline dead zones.
- **Implementation**:
  - An in-memory Axios custom adapter simulates realistic REST endpoints with seeded Hyderabad healthcare data.
  - An in-app **Admin Panel** allows reviewers to toggle:
    - **Network Latency (600ms - 3000ms)**: Validates shimmer skeleton loaders and pull-to-refresh.
    - **API Server Failure (HTTP 500)**: Forces backend errors to demonstrate that the app catches errors gracefully and serves the cached/bundled offline fallback.
    - **Empty List Responses**: Verifies clear, actionable `EmptyState` components when doctor or booking lists return `[]`.
    - **Slot Booking Conflict (HTTP 409)**: Simulates race conditions when another patient claims a slot during checkout, triggering an instant optimistic rollback with user guidance.

### 5. Instant Optimistic UI State
- **Why**: React Native's `<Switch />` is a controlled component. If an async operation triggers intermediate re-renders while state is resolving, the native switch widget snaps back (untoggles automatically).
- **Implementation**: Switches in the Admin Panel update local state synchronously on the very first touch frame, while background persistence runs concurrently. This guarantees 60fps buttery-smooth toggles with zero double-press requirements.

### 6. Compound-Key Medicine Adherence Tracking
- **Why**: Patients take medicines across multiple doses each day. A simple boolean flag would corrupt historical data or bleed across days.
- **Implementation**: Doses are stored using a deterministic compound key:
  $$\text{key} = \text{date}\_\text{rxId}\_\text{medId}\_\text{timing}$$
  *(e.g., `2026-11-19_rx-1_med-1_morning`)* in `AsyncStorage`. This ensures that doses taken today never affect past or future calendar dates.

---

## ✂️ What Was Cut and Why

1. **Live Payment Gateway SDK (Razorpay / Stripe)**
   - *Why Cut*: Third-party payment SDKs require merchant account credentials, native webhooks, and active banking sandbox environments that often break during offline reviewer evaluation.
   - *Alternative*: Built an integrated payment selection flow (UPI, Credit/Debit Card, Pay at Clinic) with simulated instant processing and clear transaction state management.
2. **Cloud Database & Live Backend Server**
   - *Why Cut*: Requiring Docker, remote server connections, or cloud databases creates environment setup friction for technical evaluators.
   - *Alternative*: Built an in-memory & `AsyncStorage` Axios adapter that models real RESTful endpoints, network latency, 409 race conditions, and 500 server crashes completely on-device.
3. **Heavy Native PDF Viewer for Prescriptions**
   - *Why Cut*: Bundling heavy native PDF rendering binaries increases app bundle size and introduces cross-platform native incompatibilities in Expo Go.
   - *Alternative*: Implemented structured prescription details screens with digital dosage schedules, precautions, and interactive dose compliance tracking.
4. **Deep Multi-Level Specialty Filters**
   - *Why Cut*: Over-engineering filter trees detracts from the core slot booking experience and patient UX.
   - *Alternative*: Focused on clean, instant category chips (General Physician, Cardiologist, Pediatrician, Dermatologist) and real-time search by doctor name, hospital, and clinic address.
5. **Expo Router**
   - *Why Cut*: Expo Router's file-based routing introduces breaking conventions across SDK upgrades and hides navigation state under directory names.
   - *Alternative*: Used explicit, compile-time type-checked **React Navigation 7** with native stack and bottom tab navigators.

---

## ⏱️ Honest Time Spent

**Total Time Spent: 10 Hours**

| Phase | Time | Tasks Completed |
| :--- | :--- | :--- |
| **Phase 1: Project Setup & Architecture** | 1.5 hrs | Expo SDK 58 setup, strict TypeScript configuration, design tokens, color palettes, typography scaling system, and navigation layout. |
| **Phase 2: Config-Driven Dynamic Home Engine** | 2.0 hrs | Zod schema definition, `normalConfig.json` and `diwaliConfig.json` creation, dynamic section dispatcher, and 6 custom home section components. |
| **Phase 3: Doctor Catalog & Slot Booking Flow** | 2.0 hrs | Hyderabad doctor dataset, interactive slot bottom sheet, optimistic booking state machine, checkmark animations, and HTTP 409 concurrency rollback. |
| **Phase 4: Prescription & Dose Adherence Tracker** | 1.5 hrs | Prescription models, compound-key dose persistence (`date_rxId_medId_timing`), interactive dosage checkboxes, and adherence progress bars. |
| **Phase 5: Admin Panel, Theme Customizer & Chaos Simulator** | 1.5 hrs | Admin Panel screen, festive Diwali mode switch, background & text color pickers, font scaling controls, and mock latency/failure/empty toggles. |
| **Phase 6: Performance Optimization & Edge Case Fixes** | 0.75 hrs | Eliminated Switch snap-back with optimistic UI states; decoupled `ThemeProvider` remote color synchronization to prevent React reconciliation warnings. |
| **Phase 7: Comprehensive Testing, EAS Config & Documentation** | 0.75 hrs | 43 automated tests across 9 Jest suites, EAS APK build configuration (`eas.json`, `app.json`), and comprehensive technical documentation. |

---

## 🧪 Test Suite Summary

```text
 PASS  __tests__/theme.test.tsx
 PASS  __tests__/prescriptions.test.ts
 PASS  __tests__/configValidation.test.ts
 PASS  __tests__/bookingState.test.ts
 PASS  __tests__/resilience.test.tsx
 PASS  __tests__/components.test.tsx
 PASS  __tests__/unknownSectionHandling.test.tsx
 PASS  __tests__/dynamicSectionRendering.test.tsx
 PASS  __tests__/diwaliMode.test.tsx

Test Suites: 9 passed, 9 total
Tests:       43 passed, 43 total
Snapshots:   0 total
```

---

## 👨‍💻 Author

- **GitHub**: [@joshiSaiKiran2000](https://github.com/joshiSaiKiran2000)
- **Application**: Tapza Care
- **Platform**: React Native / Expo SDK 58 / Android & iOS

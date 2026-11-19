# Tapza Care – Mobile Healthcare Application

> **Senior React Native Engineer Technical Assessment – Tapza Technologies**  
> A high-performance, config-driven mobile healthcare application built with **React Native**, **Expo SDK 58**, **Strict TypeScript**, and **React Navigation**. Specially tailored for Indian patients and families with Hyderabad clinic support, bilingual Hindi/English guidance, optimistic booking updates, and dose adherence tracking.

---

## 📱 Highlights & Features

- **Config-Driven Dynamic Home Screen**: Entirely rendered from remote `GET /config` payloads with Zod runtime schema validation. Supports 6 interchangeable section types (`hero_banner`, `category_chips`, `quick_actions`, `service_grid`, `doctor_carousel`, `offer_strip`) with fallback handling for unknown section types.
- **Runtime Theme & Festive Switching**: Switch between the standard **Clinical Teal** theme and the festive **Diwali Special Edition** theme (warm maroon/gold palette, Diya illustrations, custom Diwali discounts) in real-time without app restarts or screen duplication.
- **Modern Responsive Home Layout**: Designed to match clean healthcare UI standards with responsive safe-area calculation for Android punch-hole displays, fixed status bar overlap prevention, and a prominent current location pill (*Banjara Hills, Hyderabad*).
- **Gesture-Driven Doctor Slot Booking**: Seamless date picking with `@gorhom/bottom-sheet`, optimistic UI state transitions, spring checkmark success animations, and automated rollback handling for HTTP 409 slot conflicts or 500 network errors.
- **Prescription & Medicine Dose Tracker**: Compound-key dose persistence (`${date}_${rxId}_${medId}_${timing}`) in `AsyncStorage`, interactive Morning/Afternoon/Night dose checkboxes, and real-time compliance progress calculation.
- **Developer & Resilience Controls**: In-app developer settings modal accessible via the top-right sliders button to toggle themes, simulate 600ms network latency, inject simulated API failures (HTTP 500), force empty responses, or trigger slot concurrency conflicts (HTTP 409).
- **Offline Resilience & Skeleton Loading**: Shimmer skeleton loaders across all primary screens, offline config caching, and automatic fallback to bundled configurations.

---

## 🛠 Technology Stack

| Category | Library / Tool | Version | Description |
| :--- | :--- | :--- | :--- |
| **Framework** | Expo | `^58.0.0` | React Native development toolchain |
| **Language** | TypeScript | `^5.3.3` | Strict mode enabled (`"strict": true`) |
| **Navigation** | React Navigation | `^7.x` | Native Stack + Bottom Tabs (Traditional navigators, strictly NO Expo Router) |
| **Styling & Theme** | Dynamic Context + Custom Tokens | N/A | Centralized runtime design token system |
| **Animations** | React Native Reanimated | `^4.2.1` | Native thread fluid animations |
| **Gestures** | React Native Gesture Handler | `~2.28.0` | Touch & gesture orchestration |
| **Bottom Sheet** | `@gorhom/bottom-sheet` | `^5.2.8` | Gesture-driven slot picker sheet |
| **Data Validation** | Zod | `^3.24.2` | Runtime schema validation for remote config & API responses |
| **Network Client** | Axios | `^1.7.9` | Intercepted centralized HTTP client |
| **Local Storage** | AsyncStorage | `1.24.0` | Persistent caching for config, bookings, and medicine doses |
| **Icons** | Lucide React Native | `^1.16.0` | Clean, accessible vector icons |
| **Testing** | Jest + `@testing-library/react-native` | `^29.x` | Unit and integration test suite |

---

## 📂 Project Structure

```text
src/
├── api/                  # Centralized Axios client & mock data
│   ├── client.ts         # Simulated Axios adapter with latency & error hooks
│   ├── mockDoctors.ts    # Hyderabad doctors & slot generators
│   └── mockPrescriptions.ts # Realistic Indian prescriptions & medicine schedules
├── components/           # Reusable UI components by feature
│   ├── booking/          # DateSelectorStrip, SlotSelectionBottomSheet
│   ├── common/           # AppText, Skeletons, EmptyState, ErrorState, DevModal
│   ├── home/             # DynamicSectionRenderer & 6 config-driven sections
│   │   ├── DiyaIllustration.tsx     # Custom SVG glowing Diwali Diya
│   │   ├── MedicalIllustration.tsx  # Custom SVG Medical Shield
│   │   ├── HeroBannerSection.tsx    # Parallax hero banner with CTA
│   │   ├── CategoryChipsSection.tsx # Pastel service tiles (Consult, Lab, etc.)
│   │   ├── QuickActionsSection.tsx  # Circular shortcut buttons
│   │   ├── DoctorCarouselSection.tsx# Horizontal doctor cards
│   │   ├── ServiceGridSection.tsx   # 2-column preventive packages
│   │   └── OfferStripSection.tsx    # Discount strip
│   └── prescriptions/    # MedicineCard, DoseProgressBar
├── config/               # Remote config schemas & bundled fallbacks
│   ├── schema.ts         # Zod schemas for validation
│   ├── types.ts          # Inferred TypeScript contracts
│   ├── normalConfig.json # Clinical Teal theme configuration
│   └── diwaliConfig.json # Festive Diwali Maroon/Gold theme configuration
├── hooks/                # Custom React hooks
│   ├── useBookingFlow.ts # Optimistic booking state machine & conflict rollback
│   ├── usePrescriptions.ts # Dose adherence calculation & local persistence
│   └── useRemoteConfig.ts # Remote config fetching, caching, and theme dispatch
├── navigation/           # Typed navigation hierarchies
│   ├── BottomTabNavigator.tsx # Home, Bookings, Prescriptions, Profile
│   └── RootNavigator.tsx      # Native Stack root navigator
├── screens/              # Core application screens
│   ├── HomeScreen.tsx
│   ├── DoctorDetailsScreen.tsx
│   ├── BookingsScreen.tsx
│   ├── BookingSuccessScreen.tsx
│   ├── PrescriptionsScreen.tsx
│   ├── PrescriptionDetailsScreen.tsx
│   └── ProfileScreen.tsx
├── services/             # Pure business logic services
│   ├── configService.ts  # Remote config fetch, validate, and fallback
│   ├── doctorService.ts  # Doctor catalog and slot reservation
│   ├── prescriptionService.ts # Dose tracking storage operations
│   ├── developerSettings.ts   # Runtime simulation flags (409, 500, latency)
│   └── storageService.ts # AsyncStorage wrapper
├── theme/                # Centralized theme provider & design tokens
│   ├── ThemeContext.tsx  # Theme provider with dynamic color override
│   └── tokens.ts         # Typography, spacing, radii, and color palettes
└── types/                # Domain type definitions
    ├── booking.ts
    ├── navigation.ts
    └── prescription.ts
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended; developed on Node v22)
- [Expo CLI](https://docs.expo.dev/)
- Android device or Android Emulator / iOS Simulator with Expo Go (or development build)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd Tapza
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify TypeScript typecheck**:
   ```bash
   npx tsc --noEmit
   ```

4. **Run unit & integration tests**:
   ```bash
   npm test
   ```

5. **Start the Expo development server**:
   ```bash
   npx expo start
   ```
   - Scan the QR code using the **Expo Go** app on your Android or iOS device.
   - Or press `a` to launch in an Android Emulator.

---

## ⚙️ Developer Settings & Chaos Testing

Tapza Care includes an on-device **Developer Settings Modal** designed for technical reviewers and testers to simulate real-world mobile healthcare challenges:

1. Tap the **Sliders (⚙️)** icon in the top-right corner of the Home screen, or tap the **Theme Indicator Pill** (*🪔 Diwali* or *Teal*).
2. Available simulation toggles:
   - **Active Remote Configuration**: Instantly switch between `diwali` and `normal` themes at runtime. Notice the hero banner, background gradients, Diya illustrations, color schemes, and section ordering update dynamically without app reload.
   - **Simulate Network Latency (600ms)**: Demonstrates shimmer skeleton loaders during screen transitions and data loads.
   - **Simulate API Failure (HTTP 500)**: Forces backend failure to test error states, retry buttons, and offline cached fallbacks.
   - **Simulate Empty Slot Response**: Validates empty state UI when no booking slots remain for a given date.
   - **Simulate Booking Conflict (HTTP 409)**: Triggers an optimistic UI booking, followed by backend slot conflict rejection and automated rollback.

---

## 🧪 Testing Coverage

The test suite contains **8 test suites with 32 automated tests** verifying core logic:

1. `configValidation.test.ts`: Zod schema validation for remote JSON files, verifying required attributes, section types, and gradient configurations.
2. `dynamicSectionRendering.test.tsx`: Section dispatcher rendering, verifying all 6 dynamic home sections render according to config payloads.
3. `unknownSectionHandling.test.tsx`: Fallback resilience when an unsupported section type is delivered by the remote API.
4. `bookingState.test.ts`: Booking flow state transitions, slot selection, and optimistic updates.
5. `bookingConflict.test.ts`: Concurrency handling, verifying instant UI rollback when the backend returns HTTP 409.
6. `prescriptions.test.ts`: Compound-key dose marking, daily completion percentages, and local storage synchronization.
7. `theme.test.tsx`: Centralized theme provider, dark mode toggle, and dynamic color injection.
8. `resilience.test.tsx`: Offline caching, skeleton loaders, and error boundary states.

Run tests anytime with:
```bash
npm test
```

---

## 📐 Architecture & Key Design Decisions

1. **Strictly Traditional React Navigation**: Configured in TypeScript files with compile-time type-safety (`RootStackParamList`, `MainTabParamList`). Expo Router was intentionally omitted per assignment specifications.
2. **Safe Area & Android Edge-to-Edge Resilience**: Built using `react-native-safe-area-context`'s dynamic insets combined with `Platform.OS === 'android'` status bar height detection to prevent header and navigation gesture bar clipping on mid-range Android devices.
3. **Optimistic Updates with Reversion**: In the doctor booking flow, the UI optimistically records the slot reservation to provide zero-latency patient feedback. If the backend subsequently returns HTTP 409 (slot already taken) or HTTP 500 (network error), the state is instantly rolled back, and an alert guides the user to pick an alternate slot.
4. **Compound-Key Medicine Tracking**: Medicine doses are saved per date, prescription ID, medicine ID, and timing schedule (`2026-11-19_rx-1_med-1_morning`) in AsyncStorage. This guarantees doses taken today do not erroneously carry over to future dates.

---

## ⚠️ Known Limitations

- **Expo Go Native Limitations**: Production apps utilizing `@gorhom/bottom-sheet` and `react-native-reanimated` run best on Android development builds (`npx expo run:android`) or standard Expo Go.
- **Mock Persistence Scope**: Bookings and dose adherence are persisted to local device storage via `AsyncStorage` simulating an authenticated patient session.

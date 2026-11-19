# AI Implementation & Decision Log (AI_LOG.md)

> **Tapza Care – Senior React Native Engineer Assessment**  
> Documentation of prompts, architectural decisions, rejected alternatives, and manual adjustments made throughout the milestone development cycle.

---

## 1. AI Prompts Used

### Milestone 1: Setup & Navigation Architecture
- **Prompt**: "Inspect project, set up Expo TypeScript with strict mode, install dependencies, configure project structure, configure traditional React Navigation (Native Stack + Bottom Tabs), create four bottom tabs, and ensure the app runs successfully."
- **Outcome**: Created base project structure (`src/api`, `src/components`, `src/config`, `src/hooks`, `src/navigation`, `src/screens`, `src/services`, `src/theme`, `src/types`), configured `RootNavigator.tsx` and `BottomTabNavigator.tsx` with strict navigation parameter types.

### Milestone 2: Centralized Theme System & Dynamic Config-Driven Home Screen
- **Prompt**: "Implement theme architecture with dynamic color overrides. Create normalConfig.json and diwaliConfig.json. Implement remote config mock service with Zod validation. Build the six reusable home sections and dynamic section dispatcher."
- **Outcome**: Developed `src/theme/ThemeContext.tsx`, `src/config/schema.ts`, `DynamicSectionRenderer.tsx`, and the 6 dynamic section components (`HeroBannerSection`, `CategoryChipsSection`, `QuickActionsSection`, `ServiceGridSection`, `DoctorCarouselSection`, `OfferStripSection`).

### Milestone 3: Doctor Catalog & Gesture-Driven Booking Flow
- **Prompt**: "Implement doctor list and booking flow. Add date selection strip and bottom sheet for slot selection. Implement optimistic updates and failure handling for slot conflicts (HTTP 409)."
- **Outcome**: Implemented `src/services/doctorService.ts`, `DateSelectorStrip.tsx`, `SlotSelectionBottomSheet.tsx` using `@gorhom/bottom-sheet`, `useBookingFlow.ts` with instant rollback on conflict, and animated success screen `BookingSuccessScreen.tsx`.

### Milestone 4: Prescriptions & Medicine Dose Tracking
- **Prompt**: "Implement prescriptions and medicine tracking. Support prescription list, prescription details with doctor/clinic information, and morning/afternoon/night schedule dose checkboxes with local persistence."
- **Outcome**: Developed `src/services/prescriptionService.ts` using compound-key persistence in `AsyncStorage`, `MedicineCard.tsx`, `DoseProgressBar.tsx`, `usePrescriptions.ts`, and full prescription detail views.

### Milestone 5: Resilience, Shimmer Skeletons, Caching & Parallax Animations
- **Prompt**: "Add animations, caching, skeletons, empty states and error handling. The application should remain usable when the API fails."
- **Outcome**: Added `HomeScreenSkeleton`, `DoctorDetailsSkeleton`, `PrescriptionListSkeleton`, `BookingListSkeleton`, `EmptyState.tsx`, `ErrorState.tsx`, and scroll-driven parallax interpolation (`scrollY.interpolate`) on the hero banner.

### User Design Refinement: Mockup Alignment & Android Edge-to-Edge Responsive Layout
- **Prompt**: "fix the home screen overflow issue make it responsive... can you design the home page something like this, it should take the current location it remains same only the home page [Target Mockup Image]".
- **Outcome**: Replaced standard React Native `SafeAreaView` with dynamic insets from `react-native-safe-area-context` + `RNStatusBar.currentHeight` to eliminate Android status bar overlap; redesigned the home screen header to match the target mockup with brand icon, "Tapza Care", "Your Health, Our Priority", current location pill (*Banjara Hills, Hyderabad*), notification bell with unread dot, patient profile avatar, greeting header, rounded pill search bar, glowing Diya illustration, pastel service tiles (*Consult, Lab Tests, Pharmacy, Vaccines*), Quick Actions with *See all →*, and Our Doctors carousel with green *Available* badges.

---

## 2. Important Architectural Decisions

| Decision | Context | Rationale |
| :--- | :--- | :--- |
| **Traditional React Navigation over Expo Router** | Navigators defined in `.tsx` files | Stated requirement in assignment instructions; guarantees fine-grained control over deep typing and stack lifecycles without filesystem routing constraints. |
| **Zod Schema Runtime Validation** | Parsing `GET /config` payloads | Protects the application from crashing if a remote config contains malformed types or missing required arrays, falling back safely to cached or bundled configs. |
| **Optimistic Booking State Machine** | Doctor slot reservation | Minimizes perceived latency for mobile users. If concurrent booking causes an HTTP 409 conflict, the state instantly rolls back and prompts the user to select an alternate slot. |
| **Compound-Key Dose Persistence** | Medicine schedule tracking | Doses are persisted under `${date}_${rxId}_${medId}_${timing}`. Prevents cross-day dose pollution while allowing offline adherence tracking without requiring a complex SQLite setup. |
| **Centralized Theme Provider with Dynamic Overrides** | Remote runtime theme updates | Allows theme colors to update on the fly when switching between `normal` (Clinical Teal) and `diwali` (Warm Maroon/Gold) without recreating navigators or mounting duplicate screens. |
| **Hybrid Safe-Area Calculation for Android** | Notch & Punch-hole displays | Android status bar can be translucent or reported as 0 in early render passes. Combining `insets.top` with `Math.max(insets.top, RNStatusBar.currentHeight)` guarantees zero overlap across any mid-range Android phone. |

---

## 3. Rejected Approaches

1. **Rejected File-Based Expo Router**:
   - *Why*: The assignment explicitly prohibited file-based routing. Navigators were built strictly with `@react-navigation/native-stack` and `@react-navigation/bottom-tabs`.
2. **Rejected Hardcoded UI Colors in Section Components**:
   - *Why*: Hardcoding colors inside individual components violates the remote configuration requirement. All components derive palette tokens directly from `useTheme()`.
3. **Rejected Pure Modals for Slot Selection**:
   - *Why*: A native-feel gesture-driven experience was requested. `@gorhom/bottom-sheet` was chosen over standard React Native modals to allow smooth panning, backdrop dismissal, and natural thumb ergonomics.
4. **Rejected Global Single-Boolean Dose Tracking**:
   - *Why*: Storing a dose as a simple boolean on the prescription object would corrupt tracking when the user checks their schedule tomorrow. A date-qualified compound key was implemented instead.

---

## 4. Manual Changes & Verification Steps

1. **Android Inset Adjustments**:
   - Updated `BottomTabNavigator.tsx` to read `useSafeAreaInsets().bottom` dynamically, eliminating bottom bar clipping on Android 3-button and gesture navigation bars.
   - Updated `HomeScreen.tsx` to read safe area insets directly, preventing header text collision with the Android camera notch and status bar clock.
2. **Jest Test Compatibility Fixes**:
   - Configured ESM mock for `lucide-react-native` in `jest.setup.js`.
   - Mocked `@react-native-async-storage/async-storage` for clean in-memory test execution.
   - Guarded infinite animation loops in `Skeleton.tsx` during test execution (`process.env.NODE_ENV === 'test'`) to prevent Jest test timeouts.
3. **Manual Verification Procedure**:
   - Open Home screen in Expo Go / Android device.
   - Confirm status bar and notch spacing has clean breathing room.
   - Tap top-right theme badge pill (*🪔 Diwali* / *Teal*) or sliders icon to toggle theme between Normal and Diwali.
   - Confirm banner, illustrations, and color scheme update immediately without reload.
   - Tap "Book Now" or any doctor card to open Doctor Details.
   - Select a date and pick an available slot in the gesture bottom sheet.
   - Confirm booking to observe the checkmark animation.
   - Navigate to Prescriptions tab, check off a morning dose, and observe the compliance progress bar update.

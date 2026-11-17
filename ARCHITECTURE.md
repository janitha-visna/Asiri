# Project Architecture & Framework Guide

## 1. Tech Stack & Framework
- **Framework**: Expo (`~57.0.0`) with **Expo Router** (`~57.0.29`) file-based routing
- **UI & Runtime**: React (`19.2.3`), React Native (`0.86.3`)
- **Styling**: **NativeWind v4** (`^4.2.6`) + Tailwind CSS (`^3.4.17`)
  - Configured via [babel.config.js](file:///c:/Users/visna/OneDrive/Desktop/projects/car_care_app_frontend/Asiri/babel.config.js), [metro.config.js](file:///c:/Users/visna/OneDrive/Desktop/projects/car_care_app_frontend/Asiri/metro.config.js), [tailwind.config.js](file:///c:/Users/visna/OneDrive/Desktop/projects/car_care_app_frontend/Asiri/tailwind.config.js), and [global.css](file:///c:/Users/visna/OneDrive/Desktop/projects/car_care_app_frontend/Asiri/global.css)
- **Server State & Caching**: TanStack React Query (`@tanstack/react-query`)
- **HTTP Client**: `apiRequest` (`lib/api/client.ts`) backed by `axios`

---

## 2. Navigation Structure (`app/`)
- **Root Layout** ([app/_layout.tsx](file:///c:/Users/visna/OneDrive/Desktop/projects/car_care_app_frontend/Asiri/app/_layout.tsx)):
  - Wraps the app in `QueryClientProvider`, `ThemeProvider`, `InventoryProvider`, and Expo Router's `<Drawer>`.
  - Drawer routes: `index` (Home), `data-entry`, `analytics`, `revenue-analytics`, `electricity`, `inventory`, `inventory-usage`, `service-pricing`.
- **Feature Stack Layouts**:
  - Nested routes (e.g., [app/data-entry/_layout.tsx](file:///c:/Users/visna/OneDrive/Desktop/projects/car_care_app_frontend/Asiri/app/data-entry/_layout.tsx), `app/inventory/_layout.tsx`, `app/inventory-usage/_layout.tsx`, `app/service-pricing/_layout.tsx`) use Expo Router `<Stack screenOptions={{ headerShown: false }}>`.

---

## 3. Feature-Based Folder Structure
- **`app/`**: Thin route files only (layout wrappers and route entry points).
- **`components/ui/`**: Shared reusable UI primitives (`Button`, `Input`, `Select`, `Text`, `ToggleButton`).
- **`features/`**: Domain-driven feature modules:
  - `features/data-entry/`: Service job creation flow
  - `features/service-pricing/`: Service pricing matrix management
  - `features/inventory/`, `features/bill-comparison/`, `features/revenue-chart/`, etc.

---

## 4. Data-Entry Feature Architecture (`features/data-entry/`)
- **State Management**:
  - `DataEntryContext` (`useReducer` with `draftReducer` in [data-entry.reducer.ts](file:///c:/Users/visna/OneDrive/Desktop/projects/car_care_app_frontend/Asiri/features/data-entry/data-entry.reducer.ts)) manages `ServiceJobDraft`.
  - **UI State vs. API Payload**:
    - `ServiceJobDraft` ([data-entry.types.ts](file:///c:/Users/visna/OneDrive/Desktop/projects/car_care_app_frontend/Asiri/features/data-entry/data-entry.types.ts)) stores UI-friendly structures (e.g., `draft.products[productId][brandId]`, `draft.customer.phones` with `key` and `isPrimary`, `draft.estimatedCost`).
    - `buildCreatePayload(draft)` ([data-entry.utils.ts](file:///c:/Users/visna/OneDrive/Desktop/projects/car_care_app_frontend/Asiri/features/data-entry/data-entry.utils.ts)) validates and transforms `ServiceJobDraft` into `CreateServiceJobPayload` (flat `products` array, `{ number, isPrimary }[]` for `phones`, `estimatedCost`, and optional `totalCost` override) before `POST /service-jobs`.
- **Sections** (`features/data-entry/components/sections/`):
  1. `VehicleSection`: Plate lookup (`GET /vehicles/lookup`), suggestions, category/type selection.
  2. `CustomerSection` + `PhoneList`: Customer name and multi-phone list with primary toggle.
  3. `JobDateSection` & `MeterReadingSection`: Job date and odometer readings.
  4. `ServicePackageSection`: Package selection (`useServicePackages`), sets `draft.estimatedCost`.
  5. `ServiceList` + `ProductQuantityModal`: Multi-brand product/part selection (`GET /products`) with unit-aware quantity modal (`allowDecimal`, `unit`).
  6. `PriceSection` & `SaveBar`: Displays `estimatedCost`, optional price override, validation, and `POST /service-jobs` submission.

---

## 5. Styling & NativeWind v4 Conventions
- Avoid conditionally adding `shadow-*` classes (e.g. `shadow-sm`) after initial render on a reused element (such as across `if (...) return <View>` vs. main `return <View>` without distinct `key`s, or inside `isSelected ? "shadow-sm" : ""`), as `react-native-css-interop` upgrades the element with `VariableContext.Provider` mid-render.
- When bypassing NativeWind on a component, prefer `StyleSheet.create(...)` over inline style objects in JSX.

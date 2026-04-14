# QuickCart Admin Mobile — Git Push Schedule

> **Branch:** `development`
> **Remote:** `origin` → `https://github.com/mujju-212/quickcart.git`
> **Total:** 24 commits across 6 days (4 pushes/day)
> **Times:** 10:00 AM | 1:00 PM | 5:00 PM | 9:00 PM

⚠️ **Before starting:** Make sure you're on `main` branch:
```bash
cd "d:\AVTIVE PROJ\quickcart"
git checkout development
```

> ⚠️ **PowerShell Note:** Paths containing `(auth)` or `[id]` **must be quoted** — PowerShell treats `()` and `[]` as special syntax. All such paths below are already quoted.

---

## 📅 DAY 1 — Project Setup & Foundation

### Push 1 — 10:00 AM | Project initialization & config
```powershell
git add quickcart-admin-mobile/.gitignore quickcart-admin-mobile/package.json quickcart-admin-mobile/package-lock.json quickcart-admin-mobile/tsconfig.json quickcart-admin-mobile/app.json quickcart-admin-mobile/babel.config.js quickcart-admin-mobile/eas.json quickcart-admin-mobile/expo-env.d.ts
git commit -m "feat(admin-mobile): initialize QuickCart admin mobile project with Expo Router & TypeScript"
git push origin development
```

### Push 2 — 1:00 PM | Design system (theme)
```powershell
git add quickcart-admin-mobile/src/theme/colors.ts quickcart-admin-mobile/src/theme/spacing.ts quickcart-admin-mobile/src/theme/typography.ts quickcart-admin-mobile/src/theme/shadows.ts quickcart-admin-mobile/src/theme/index.ts
git commit -m "feat(admin-mobile): add admin theme system — colors, typography, spacing & shadows"
git push origin development
```

### Push 3 — 5:00 PM | Utility functions & permissions
```powershell
git add quickcart-admin-mobile/src/utils/constants.ts quickcart-admin-mobile/src/utils/helpers.ts quickcart-admin-mobile/src/utils/storage.ts quickcart-admin-mobile/src/utils/permissions.ts
git commit -m "feat(admin-mobile): add utility helpers, constants, storage & permissions"
git push origin development
```

### Push 4 — 9:00 PM | API client & auth service
```powershell
git add quickcart-admin-mobile/src/services/api.ts quickcart-admin-mobile/src/services/authService.ts
git commit -m "feat(admin-mobile): setup Axios API client with JWT interceptors & admin auth service"
git push origin development
```

---

## 📅 DAY 2 — Services & Stores

### Push 1 — 10:00 AM | Core data services
```powershell
git add quickcart-admin-mobile/src/services/productService.ts quickcart-admin-mobile/src/services/categoryService.ts quickcart-admin-mobile/src/services/orderService.ts
git commit -m "feat(admin-mobile): add product, category & order API services"
git push origin development
```

### Push 2 — 1:00 PM | Customer, analytics & review services
```powershell
git add quickcart-admin-mobile/src/services/customerService.ts quickcart-admin-mobile/src/services/analyticsService.ts quickcart-admin-mobile/src/services/reviewService.ts
git commit -m "feat(admin-mobile): add customer, analytics & review API services"
git push origin development
```

### Push 3 — 5:00 PM | Management services
```powershell
git add quickcart-admin-mobile/src/services/bannerService.ts quickcart-admin-mobile/src/services/offerService.ts quickcart-admin-mobile/src/services/reportService.ts
git commit -m "feat(admin-mobile): add banner, offer & report API services"
git push origin development
```

### Push 4 — 9:00 PM | Zustand stores
```powershell
git add quickcart-admin-mobile/src/stores/authStore.ts quickcart-admin-mobile/src/stores/dashboardStore.ts quickcart-admin-mobile/src/stores/filterStore.ts
git commit -m "feat(admin-mobile): add Zustand stores — auth, dashboard & filter state"
git push origin development
```

---

## 📅 DAY 3 — Hooks & Common UI Components

### Push 1 — 10:00 AM | Custom hooks
```powershell
git add quickcart-admin-mobile/src/hooks/useDashboard.ts quickcart-admin-mobile/src/hooks/useCustomers.ts quickcart-admin-mobile/src/hooks/useOrders.ts quickcart-admin-mobile/src/hooks/useProducts.ts quickcart-admin-mobile/src/hooks/useDebounce.ts
git commit -m "feat(admin-mobile): add custom hooks — useDashboard, useCustomers, useOrders, useProducts"
git push origin development
```

### Push 2 — 1:00 PM | Common UI components (part 1)
```powershell
git add quickcart-admin-mobile/src/components/common/Button.tsx quickcart-admin-mobile/src/components/common/Input.tsx quickcart-admin-mobile/src/components/common/Card.tsx quickcart-admin-mobile/src/components/common/Badge.tsx quickcart-admin-mobile/src/components/common/StatusBadge.tsx quickcart-admin-mobile/src/components/common/index.ts
git commit -m "feat(admin-mobile): add common UI — Button, Input, Card, Badge, StatusBadge"
git push origin development
```

### Push 3 — 5:00 PM | Common UI components (part 2)
```powershell
git add quickcart-admin-mobile/src/components/common/Skeleton.tsx quickcart-admin-mobile/src/components/common/Modal.tsx quickcart-admin-mobile/src/components/common/BottomSheet.tsx quickcart-admin-mobile/src/components/common/DataTable.tsx quickcart-admin-mobile/src/components/common/EmptyState.tsx
git commit -m "feat(admin-mobile): add Skeleton, Modal, BottomSheet, DataTable & EmptyState"
git push origin development
```

### Push 4 — 9:00 PM | Common UI components (part 3)
```powershell
git add quickcart-admin-mobile/src/components/common/StatCard.tsx quickcart-admin-mobile/src/components/common/SearchHeader.tsx quickcart-admin-mobile/src/components/common/FloatingActionButton.tsx
git commit -m "feat(admin-mobile): add StatCard, SearchHeader & FloatingActionButton components"
git push origin development
```

---

## 📅 DAY 4 — Feature Components

### Push 1 — 10:00 AM | Dashboard components
```powershell
git add quickcart-admin-mobile/src/components/dashboard/RevenueChart.tsx quickcart-admin-mobile/src/components/dashboard/OrdersChart.tsx quickcart-admin-mobile/src/components/dashboard/CategoryPieChart.tsx quickcart-admin-mobile/src/components/dashboard/RecentOrdersList.tsx quickcart-admin-mobile/src/components/dashboard/TopProductsList.tsx quickcart-admin-mobile/src/components/dashboard/QuickActionGrid.tsx
git commit -m "feat(admin-mobile): add dashboard components — charts, recent orders & quick actions"
git push origin development
```

### Push 2 — 1:00 PM | Product components
```powershell
git add quickcart-admin-mobile/src/components/products/ProductCard.tsx quickcart-admin-mobile/src/components/products/ProductForm.tsx quickcart-admin-mobile/src/components/products/ImageUploader.tsx quickcart-admin-mobile/src/components/products/StockBadge.tsx
git commit -m "feat(admin-mobile): add product components — ProductCard, ProductForm, ImageUploader, StockBadge"
git push origin development
```

### Push 3 — 5:00 PM | Order components
```powershell
git add quickcart-admin-mobile/src/components/orders/OrderCard.tsx quickcart-admin-mobile/src/components/orders/OrderItemRow.tsx quickcart-admin-mobile/src/components/orders/OrderTimeline.tsx quickcart-admin-mobile/src/components/orders/StatusUpdateSheet.tsx
git commit -m "feat(admin-mobile): add order components — OrderCard, OrderTimeline, StatusUpdateSheet"
git push origin development
```

### Push 4 — 9:00 PM | Customer, banner & offer components
```powershell
git add quickcart-admin-mobile/src/components/customers/CustomerCard.tsx quickcart-admin-mobile/src/components/customers/CustomerStats.tsx quickcart-admin-mobile/src/components/banners/BannerCard.tsx quickcart-admin-mobile/src/components/banners/BannerForm.tsx quickcart-admin-mobile/src/components/offers/OfferCard.tsx quickcart-admin-mobile/src/components/offers/OfferForm.tsx
git commit -m "feat(admin-mobile): add customer, banner & offer components"
git push origin development
```

---

## 📅 DAY 5 — Report Components & Core Screens

### Push 1 — 10:00 AM | Report components & assets
```powershell
git add quickcart-admin-mobile/src/components/reports/ReportCard.tsx quickcart-admin-mobile/src/components/reports/DateRangePicker.tsx quickcart-admin-mobile/src/components/reports/ExportButton.tsx quickcart-admin-mobile/src/assets/images/icon.png quickcart-admin-mobile/src/assets/images/splash.png quickcart-admin-mobile/src/assets/images/adaptive-icon.png
git commit -m "feat(admin-mobile): add report components & app assets"
git push origin development
```

### Push 2 — 1:00 PM | Root layout & login screen
```powershell
git add quickcart-admin-mobile/src/app/_layout.tsx quickcart-admin-mobile/src/app/index.tsx quickcart-admin-mobile/src/app/login.tsx "quickcart-admin-mobile/src/app/(auth)/_layout.tsx"
git commit -m "feat(admin-mobile): add root layout, index redirect, login screen & auth shell"
git push origin development
```

### Push 3 — 5:00 PM | Main admin screens
```powershell
git add "quickcart-admin-mobile/src/app/(auth)/dashboard.tsx" "quickcart-admin-mobile/src/app/(auth)/reports.tsx" "quickcart-admin-mobile/src/app/(auth)/reviews.tsx" "quickcart-admin-mobile/src/app/(auth)/settings.tsx"
git commit -m "feat(admin-mobile): add dashboard, reports, reviews & settings screens"
git push origin development
```

### Push 4 — 9:00 PM | Products screens
```powershell
git add "quickcart-admin-mobile/src/app/(auth)/products/_layout.tsx" "quickcart-admin-mobile/src/app/(auth)/products/index.tsx" "quickcart-admin-mobile/src/app/(auth)/products/create.tsx" "quickcart-admin-mobile/src/app/(auth)/products/[id].tsx"
git commit -m "feat(admin-mobile): add products management screens — list, create & edit"
git push origin development
```

---

## 📅 DAY 6 — Remaining Admin Screens

### Push 1 — 10:00 AM | Categories screens
```powershell
git add "quickcart-admin-mobile/src/app/(auth)/categories/_layout.tsx" "quickcart-admin-mobile/src/app/(auth)/categories/index.tsx" "quickcart-admin-mobile/src/app/(auth)/categories/create.tsx"
git commit -m "feat(admin-mobile): add categories management screens — list & create"
git push origin development
```

### Push 2 — 1:00 PM | Orders screens
```powershell
git add "quickcart-admin-mobile/src/app/(auth)/orders/_layout.tsx" "quickcart-admin-mobile/src/app/(auth)/orders/index.tsx" "quickcart-admin-mobile/src/app/(auth)/orders/[id].tsx"
git commit -m "feat(admin-mobile): add orders management screens — list & detail"
git push origin development
```

### Push 3 — 5:00 PM | Customers screens
```powershell
git add "quickcart-admin-mobile/src/app/(auth)/customers/_layout.tsx" "quickcart-admin-mobile/src/app/(auth)/customers/index.tsx" "quickcart-admin-mobile/src/app/(auth)/customers/[id].tsx"
git commit -m "feat(admin-mobile): add customers management screens — list & detail"
git push origin development
```

### Push 4 — 9:00 PM | Banners & offers screens (final push)
```powershell
git add "quickcart-admin-mobile/src/app/(auth)/banners/_layout.tsx" "quickcart-admin-mobile/src/app/(auth)/banners/index.tsx" "quickcart-admin-mobile/src/app/(auth)/banners/create.tsx" "quickcart-admin-mobile/src/app/(auth)/offers/_layout.tsx" "quickcart-admin-mobile/src/app/(auth)/offers/index.tsx" "quickcart-admin-mobile/src/app/(auth)/offers/create.tsx"
git commit -m "feat(admin-mobile): add banners & offers management screens — list & create"
git push origin development
```

---

## ✅ Summary

| Day | Focus | Commits | Files |
|-----|-------|--------:|------:|
| 1 | Project setup & foundation | 4 | 19 |
| 2 | Services & stores | 4 | 14 |
| 3 | Hooks & common UI components | 4 | 19 |
| 4 | Feature components | 4 | 18 |
| 5 | Report components & core screens | 4 | 17 |
| 6 | Remaining admin screens | 4 | 15 |
| **Total** | | **24** | **~102** |

---

## 🔔 Reminders
- Run each command block at the scheduled time
- Make sure you're in `d:\AVTIVE PROJ\quickcart` directory
- Make sure you're on the `main` branch before each push
- If a push fails, run `git pull origin development --rebase` first
- **Always quote paths with `(auth)` or `[id]`** — already done in every command above
- Do NOT add `node_modules/` or `.expo/` — they are gitignored

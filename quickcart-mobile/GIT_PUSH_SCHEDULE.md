# QuickCart Mobile — Git Push Schedule

> **Branch:** `main`
> **Remote:** `origin` → `https://github.com/mujju-212/quickcart.git`
> **Total:** 24 commits across 6 days (4 pushes/day)
> **Times:** 10:00 AM | 1:00 PM | 5:00 PM | 9:00 PM

⚠️ **Before starting:** Make sure you're on `main` branch:
```bash
cd "d:\AVTIVE PROJ\quickcart"
git checkout main
```

---

## 📅 DAY 1 — Project Setup & Foundation

### Push 1 — 10:00 AM | Project initialization & config
```bash
git add quickcart-mobile/.gitignore quickcart-mobile/package.json quickcart-mobile/package-lock.json quickcart-mobile/tsconfig.json quickcart-mobile/app.json quickcart-mobile/babel.config.js quickcart-mobile/eas.json
git commit -m "feat(mobile): initialize QuickCart mobile project with Expo Router & TypeScript"
git push origin main
```

### Push 2 — 1:00 PM | Design system (theme)
```bash
git add quickcart-mobile/src/theme/colors.ts quickcart-mobile/src/theme/spacing.ts quickcart-mobile/src/theme/typography.ts quickcart-mobile/src/theme/shadows.ts quickcart-mobile/src/theme/index.ts
git commit -m "feat(mobile): add theme system — colors, typography, spacing & shadows"
git push origin main
```

### Push 3 — 5:00 PM | Types & utility functions
```bash
git add quickcart-mobile/src/types/global.d.ts quickcart-mobile/src/utils/constants.ts quickcart-mobile/src/utils/helpers.ts quickcart-mobile/src/utils/storage.ts quickcart-mobile/src/utils/haptics.ts quickcart-mobile/src/utils/index.ts
git commit -m "feat(mobile): add global types, constants, storage layer & utility helpers"
git push origin main
```

### Push 4 — 9:00 PM | API client setup
```bash
git add quickcart-mobile/src/services/api.ts quickcart-mobile/src/services/index.ts
git commit -m "feat(mobile): setup Axios API client with JWT interceptors & error handling"
git push origin main
```

---

## 📅 DAY 2 — Services & State Management

### Push 1 — 10:00 AM | Auth & product services
```bash
git add quickcart-mobile/src/services/authService.ts quickcart-mobile/src/services/productService.ts quickcart-mobile/src/services/categoryService.ts
git commit -m "feat(mobile): add auth, product & category API services"
git push origin main
```

### Push 2 — 1:00 PM | Cart, order & wishlist services
```bash
git add quickcart-mobile/src/services/cartService.ts quickcart-mobile/src/services/orderService.ts quickcart-mobile/src/services/wishlistService.ts
git commit -m "feat(mobile): add cart, order & wishlist API services"
git push origin main
```

### Push 3 — 5:00 PM | Remaining services
```bash
git add quickcart-mobile/src/services/bannerService.ts quickcart-mobile/src/services/offerService.ts quickcart-mobile/src/services/addressService.ts quickcart-mobile/src/services/reviewService.ts
git commit -m "feat(mobile): add banner, offer, address & review API services"
git push origin main
```

### Push 4 — 9:00 PM | Zustand stores (state management)
```bash
git add quickcart-mobile/src/stores/authStore.ts quickcart-mobile/src/stores/cartStore.ts quickcart-mobile/src/stores/wishlistStore.ts quickcart-mobile/src/stores/locationStore.ts quickcart-mobile/src/stores/index.ts
git commit -m "feat(mobile): add Zustand stores — auth, cart, wishlist & location state"
git push origin main
```

---

## 📅 DAY 3 — Hooks & UI Components

### Push 1 — 10:00 AM | Custom hooks
```bash
git add quickcart-mobile/src/hooks/useAuth.ts quickcart-mobile/src/hooks/useCart.ts quickcart-mobile/src/hooks/useDebounce.ts quickcart-mobile/src/hooks/useOrders.ts quickcart-mobile/src/hooks/useProducts.ts quickcart-mobile/src/hooks/index.ts
git commit -m "feat(mobile): add custom React hooks — useAuth, useCart, useProducts, useDebounce"
git push origin main
```

### Push 2 — 1:00 PM | Core UI components (part 1)
```bash
git add quickcart-mobile/src/components/ui/Button.tsx quickcart-mobile/src/components/ui/Input.tsx quickcart-mobile/src/components/ui/Card.tsx quickcart-mobile/src/components/ui/Badge.tsx quickcart-mobile/src/components/ui/Chip.tsx quickcart-mobile/src/components/ui/index.ts
git commit -m "feat(mobile): add core UI components — Button, Input, Card, Badge, Chip"
git push origin main
```

### Push 3 — 5:00 PM | Core UI components (part 2)
```bash
git add quickcart-mobile/src/components/ui/Skeleton.tsx quickcart-mobile/src/components/ui/Toast.tsx quickcart-mobile/src/components/ui/BottomSheet.tsx
git commit -m "feat(mobile): add Skeleton loader, Toast notifications & BottomSheet"
git push origin main
```

### Push 4 — 9:00 PM | Common shared components
```bash
git add quickcart-mobile/src/components/common/Header.tsx quickcart-mobile/src/components/common/SearchBar.tsx quickcart-mobile/src/components/common/EmptyState.tsx quickcart-mobile/src/components/common/ErrorState.tsx quickcart-mobile/src/components/common/PullToRefresh.tsx quickcart-mobile/src/components/common/index.ts
git commit -m "feat(mobile): add common components — Header, SearchBar, EmptyState, PullToRefresh"
git push origin main
```

---

## 📅 DAY 4 — Feature Components

### Push 1 — 10:00 AM | Product components (part 1)
```bash
git add quickcart-mobile/src/components/product/ProductCard.tsx quickcart-mobile/src/components/product/ProductGrid.tsx quickcart-mobile/src/components/product/QuantitySelector.tsx quickcart-mobile/src/components/product/index.ts
git commit -m "feat(mobile): add ProductCard, ProductGrid & QuantitySelector components"
git push origin main
```

### Push 2 — 1:00 PM | Product components (part 2)
```bash
git add quickcart-mobile/src/components/product/ImageGallery.tsx quickcart-mobile/src/components/product/ReviewCard.tsx quickcart-mobile/src/components/product/ReviewForm.tsx
git commit -m "feat(mobile): add ImageGallery, ReviewCard & ReviewForm components"
git push origin main
```

### Push 3 — 5:00 PM | Home screen components
```bash
git add quickcart-mobile/src/components/home/DeliveryHeader.tsx quickcart-mobile/src/components/home/HeroBanner.tsx quickcart-mobile/src/components/home/CategoryRow.tsx quickcart-mobile/src/components/home/OfferBanner.tsx quickcart-mobile/src/components/home/ProductSection.tsx quickcart-mobile/src/components/home/index.ts
git commit -m "feat(mobile): add home screen components — HeroBanner, CategoryRow, OfferBanner"
git push origin main
```

### Push 4 — 9:00 PM | Cart components
```bash
git add quickcart-mobile/src/components/cart/CartItem.tsx quickcart-mobile/src/components/cart/CartFooter.tsx quickcart-mobile/src/components/cart/CartSummary.tsx quickcart-mobile/src/components/cart/CouponInput.tsx quickcart-mobile/src/components/cart/index.ts
git commit -m "feat(mobile): add cart components — CartItem, CartFooter, CartSummary, CouponInput"
git push origin main
```

---

## 📅 DAY 5 — Address, Order Components & Auth Screens

### Push 1 — 10:00 AM | Order & address components
```bash
git add quickcart-mobile/src/components/order/OrderCard.tsx quickcart-mobile/src/components/order/OrderItems.tsx quickcart-mobile/src/components/order/OrderTimeline.tsx quickcart-mobile/src/components/order/index.ts quickcart-mobile/src/components/address/AddressCard.tsx quickcart-mobile/src/components/address/AddressForm.tsx quickcart-mobile/src/components/address/index.ts
git commit -m "feat(mobile): add order & address components — OrderCard, OrderTimeline, AddressForm"
git push origin main
```

### Push 2 — 1:00 PM | Assets & root layout
```bash
git add quickcart-mobile/src/assets/images/icon.png quickcart-mobile/src/assets/images/splash.png quickcart-mobile/src/assets/images/adaptive-icon.png quickcart-mobile/src/app/_layout.tsx
git commit -m "feat(mobile): add app icons, splash screen & root layout with auth guard"
git push origin main
```

### Push 3 — 5:00 PM | Auth screens
```bash
git add quickcart-mobile/src/app/(auth)/_layout.tsx quickcart-mobile/src/app/(auth)/onboarding.tsx quickcart-mobile/src/app/(auth)/login.tsx quickcart-mobile/src/app/(auth)/verify-otp.tsx quickcart-mobile/src/app/(auth)/complete-profile.tsx
git commit -m "feat(mobile): add auth flow — onboarding, login, OTP verification & profile setup"
git push origin main
```

### Push 4 — 9:00 PM | Tab layout, home & categories
```bash
git add quickcart-mobile/src/app/(tabs)/_layout.tsx quickcart-mobile/src/app/(tabs)/index.tsx quickcart-mobile/src/app/(tabs)/categories.tsx
git commit -m "feat(mobile): add bottom tab navigation, home screen & categories screen"
git push origin main
```

---

## 📅 DAY 6 — Remaining Screens & Final Push

### Push 1 — 10:00 AM | Search, cart & account tabs
```bash
git add quickcart-mobile/src/app/(tabs)/search.tsx quickcart-mobile/src/app/(tabs)/cart.tsx quickcart-mobile/src/app/(tabs)/account.tsx
git commit -m "feat(mobile): add search, cart & account tab screens"
git push origin main
```

### Push 2 — 1:00 PM | Profile, settings & wishlist
```bash
git add quickcart-mobile/src/app/profile-edit.tsx quickcart-mobile/src/app/settings.tsx quickcart-mobile/src/app/wishlist.tsx
git commit -m "feat(mobile): add profile edit, settings & wishlist screens"
git push origin main
```

### Push 3 — 5:00 PM | Orders, offers, notifications & help
```bash
git add quickcart-mobile/src/app/orders/index.tsx quickcart-mobile/src/app/offers.tsx quickcart-mobile/src/app/notifications.tsx quickcart-mobile/src/app/help.tsx
git commit -m "feat(mobile): add orders list, offers, notifications & help screens"
git push origin main
```

### Push 4 — 9:00 PM | Checkout flow & remaining screens
```bash
git add quickcart-mobile/src/app/checkout/address-select.tsx quickcart-mobile/src/app/checkout/payment.tsx quickcart-mobile/src/app/checkout/confirmation.tsx quickcart-mobile/src/app/review/write.tsx quickcart-mobile/src/app/addresses.tsx quickcart-mobile/src/app/category/[id].tsx quickcart-mobile/src/app/orders/[id].tsx quickcart-mobile/src/app/product/[id].tsx
git commit -m "feat(mobile): add checkout flow, review, addresses & dynamic route screens"
git push origin main
```

---

## ✅ Summary

| Day | Focus | Commits | Files |
|-----|-------|--------:|------:|
| 1 | Project setup & foundation | 4 | 20 |
| 2 | Services & state management | 4 | 16 |
| 3 | Hooks & UI components | 4 | 18 |
| 4 | Feature components | 4 | 19 |
| 5 | Address/order components & auth | 4 | 15 |
| 6 | All remaining screens | 4 | 14 |
| **Total** | | **24** | **~102** |

---

## 🔔 Reminders
- Run each command block at the scheduled time
- Make sure you're in `d:\AVTIVE PROJ\quickcart` directory
- Make sure you're on the `main` branch before each push
- If a push fails, run `git pull origin main --rebase` first
- Do NOT add `node_modules/`, `.expo/`, or `package-lock.json`... wait, package-lock.json IS included in Day 1 Push 1 (it's needed for reproducible builds)

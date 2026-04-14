# QuickCart Mobile App — Agent 1: Customer App

## Branch: `main`

## Role: Build the complete customer-facing mobile application

---

## 1. Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **React Native 0.76+** with **Expo SDK 52** | Team knows React, shared logic, cross-platform |
| Navigation | **React Navigation 7** (Native Stack + Bottom Tabs) | Native transitions, gesture-based, smooth 60fps |
| State Management | **Zustand** | Lightweight, no boilerplate, better than Context for mobile perf |
| API Layer | **Axios** + **React Query (TanStack Query v5)** | Caching, retry, background refetch, offline support |
| Animations | **React Native Reanimated 3** + **Moti** | Native thread animations, no JS bridge lag |
| Gestures | **React Native Gesture Handler** | Native gesture recognition (swipe, pan, pinch) |
| Storage | **MMKV** (via react-native-mmkv) | 30x faster than AsyncStorage for tokens/cache |
| UI Components | **Custom components** + **React Native SVG** | Full control over design, no heavy UI library |
| Images | **Expo Image** (or react-native-fast-image) | Aggressive caching, blur placeholders, progressive loading |
| Icons | **Phosphor Icons** or **Lucide React Native** | Modern, consistent icon set |
| Fonts | **Inter** (body) + **Plus Jakarta Sans** (headings) | Modern, clean, great readability on mobile |
| Push Notifications | **Expo Notifications** + **Firebase Cloud Messaging** | For order status updates |
| Maps | **react-native-maps** | Delivery address selection |
| Payments | **Razorpay React Native SDK** | UPI, Cards, Wallets — Indian market |
| Lottie | **lottie-react-native** | Micro-animations (empty states, success, loading) |

---

## 2. Project Structure

```
quickcart-mobile/
├── app/                          # Expo Router file-based routing
│   ├── _layout.tsx               # Root layout (providers, fonts, splash)
│   ├── index.tsx                 # Entry → redirect to (tabs)
│   ├── (auth)/                   # Auth screens (unauthenticated)
│   │   ├── _layout.tsx
│   │   ├── onboarding.tsx        # First-time onboarding slides
│   │   ├── login.tsx             # Phone/email entry
│   │   ├── verify-otp.tsx        # OTP verification
│   │   └── complete-profile.tsx  # Name, email for new users
│   ├── (tabs)/                   # Main tab navigator
│   │   ├── _layout.tsx           # Bottom tab bar config
│   │   ├── index.tsx             # Home screen
│   │   ├── categories.tsx        # All categories grid
│   │   ├── search.tsx            # Search screen
│   │   ├── cart.tsx              # Cart screen
│   │   └── account.tsx           # Account/profile screen
│   ├── product/
│   │   └── [id].tsx              # Product detail screen
│   ├── category/
│   │   └── [id].tsx              # Category products list
│   ├── checkout/
│   │   ├── index.tsx             # Order review + address
│   │   ├── payment.tsx           # Payment method selection
│   │   └── success.tsx           # Order confirmation
│   ├── orders/
│   │   ├── index.tsx             # Order history list
│   │   └── [id].tsx              # Order detail + tracking
│   ├── address/
│   │   ├── index.tsx             # Saved addresses
│   │   ├── add.tsx               # Add new address
│   │   └── edit/[id].tsx         # Edit address
│   ├── wishlist.tsx              # Wishlist screen
│   ├── offers.tsx                # Available offers/coupons
│   ├── notifications.tsx         # Notification center
│   └── settings.tsx              # App settings
├── src/
│   ├── components/               # Reusable components
│   │   ├── ui/                   # Base UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Skeleton.tsx      # Loading skeletons
│   │   │   ├── BottomSheet.tsx   # Reusable bottom sheet
│   │   │   ├── Toast.tsx         # Toast notifications
│   │   │   └── Chip.tsx          # Filter chips
│   │   ├── home/
│   │   │   ├── HeroBanner.tsx    # Auto-scrolling banner carousel
│   │   │   ├── CategoryRow.tsx   # Horizontal category scroll
│   │   │   ├── ProductSection.tsx # Category-wise product sections
│   │   │   ├── OfferBanner.tsx   # Promotional offer card
│   │   │   └── DeliveryHeader.tsx # "Delivery in 10 min" header
│   │   ├── product/
│   │   │   ├── ProductCard.tsx   # Grid/list product card
│   │   │   ├── ProductGrid.tsx   # 2-column product grid
│   │   │   ├── QuantitySelector.tsx # +/- quantity control
│   │   │   ├── ReviewCard.tsx    # Individual review
│   │   │   ├── ReviewForm.tsx    # Write review bottom sheet
│   │   │   └── ImageGallery.tsx  # Zoomable product images
│   │   ├── cart/
│   │   │   ├── CartItem.tsx      # Swipeable cart item
│   │   │   ├── CartSummary.tsx   # Price breakdown
│   │   │   ├── CouponInput.tsx   # Apply coupon
│   │   │   └── CartFooter.tsx    # Sticky checkout button
│   │   ├── order/
│   │   │   ├── OrderCard.tsx     # Order history card
│   │   │   ├── OrderTimeline.tsx # Visual status timeline
│   │   │   └── OrderItems.tsx    # Items in order
│   │   ├── address/
│   │   │   ├── AddressCard.tsx   # Address display card
│   │   │   └── AddressForm.tsx   # Address input form
│   │   └── common/
│   │       ├── Header.tsx        # Screen headers
│   │       ├── SearchBar.tsx     # Animated search bar
│   │       ├── EmptyState.tsx    # Lottie empty states
│   │       ├── ErrorState.tsx    # Error + retry
│   │       └── PullToRefresh.tsx # Custom pull-to-refresh
│   ├── stores/                   # Zustand stores
│   │   ├── authStore.ts          # Auth state + token management
│   │   ├── cartStore.ts          # Cart state + sync
│   │   ├── wishlistStore.ts      # Wishlist state
│   │   └── locationStore.ts      # Selected address/location
│   ├── services/                 # API service layer
│   │   ├── api.ts                # Axios instance + interceptors
│   │   ├── authService.ts        # Auth API calls
│   │   ├── productService.ts     # Product API calls
│   │   ├── cartService.ts        # Cart API calls
│   │   ├── orderService.ts       # Order API calls
│   │   ├── categoryService.ts    # Category API calls
│   │   ├── wishlistService.ts    # Wishlist API calls
│   │   ├── offerService.ts       # Offers/coupons API calls
│   │   ├── reviewService.ts      # Review API calls
│   │   ├── addressService.ts     # Address API calls
│   │   └── bannerService.ts      # Banner API calls
│   ├── hooks/                    # Custom hooks
│   │   ├── useProducts.ts        # Product queries (React Query)
│   │   ├── useCart.ts            # Cart mutations + queries
│   │   ├── useOrders.ts          # Order queries
│   │   ├── useAuth.ts            # Auth convenience hook
│   │   └── useDebounce.ts        # Search debounce
│   ├── utils/
│   │   ├── constants.ts          # API URL, colors, spacing
│   │   ├── helpers.ts            # formatPrice, formatDate, etc.
│   │   ├── storage.ts            # MMKV wrapper
│   │   └── haptics.ts            # Haptic feedback triggers
│   ├── theme/
│   │   ├── colors.ts             # Color palette
│   │   ├── typography.ts         # Font styles
│   │   ├── spacing.ts            # Consistent spacing scale
│   │   └── shadows.ts            # Elevation/shadow presets
│   └── assets/
│       ├── lottie/               # Lottie animation files
│       │   ├── empty-cart.json
│       │   ├── order-success.json
│       │   ├── delivery-bike.json
│       │   └── loading.json
│       ├── images/               # Static images
│       └── fonts/                # Custom fonts
├── app.json                      # Expo config
├── eas.json                      # EAS Build config
├── tsconfig.json
├── package.json
└── babel.config.js
```

---

## 3. Design System & Theme

### Color Palette

```
Primary:        #FFD700 (QuickCart Gold)
Primary Dark:   #E6C200
Background:     #FFFFFF
Surface:        #F7F7F7
Card:           #FFFFFF
Text Primary:   #1A1A1A
Text Secondary: #6B7280
Text Muted:     #9CA3AF
Success:        #22C55E
Error:          #EF4444
Warning:        #F59E0B
Info:           #3B82F6
Border:         #E5E7EB
Divider:        #F3F4F6
Overlay:        rgba(0,0,0,0.5)
```

### Typography Scale

```
Hero:           32px / Bold / Plus Jakarta Sans
H1:             24px / Bold / Plus Jakarta Sans
H2:             20px / SemiBold / Plus Jakarta Sans
H3:             17px / SemiBold / Inter
Body Large:     16px / Regular / Inter
Body:           14px / Regular / Inter
Body Small:     13px / Regular / Inter
Caption:        12px / Medium / Inter
Overline:       11px / SemiBold / Inter / Uppercase / Letter-spacing: 1px
Price:          18px / Bold / Inter
Price Strike:   14px / Regular / Inter / Line-through / #9CA3AF
```

### Spacing Scale (multiples of 4)

```
xs:  4px
sm:  8px
md:  12px
lg:  16px
xl:  20px
2xl: 24px
3xl: 32px
4xl: 40px
```

### Border Radius

```
xs:   4px   (chips, badges)
sm:   8px   (buttons, inputs)
md:   12px  (cards)
lg:   16px  (bottom sheets)
xl:   20px  (modals)
full: 9999  (pills, avatars)
```

### Shadows (iOS + Android)

```
sm:  { shadowOffset: {0, 1}, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }
md:  { shadowOffset: {0, 2}, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }
lg:  { shadowOffset: {0, 4}, shadowOpacity: 0.12, shadowRadius: 16, elevation: 6 }
xl:  { shadowOffset: {0, 8}, shadowOpacity: 0.15, shadowRadius: 24, elevation: 10 }
```

---

## 4. Screen-by-Screen Specification

### 4.1 Onboarding (First Launch Only)

**3 slides with Lottie animations:**
1. "Fresh groceries at your doorstep" — delivery animation
2. "10-minute delivery" — clock/speed animation
3. "Best prices, best quality" — shopping animation

- Horizontal swipe between slides
- Dot indicators at bottom
- "Skip" top-right, "Get Started" button at bottom
- Save `hasOnboarded: true` to MMKV

**Transitions:** `SharedTransition` with `FadeIn` on Lottie, `SlideInRight` on text

---

### 4.2 Login Screen

**Layout:**
- Top: QuickCart logo + tagline "Groceries in 10 minutes"
- Toggle: Phone / Email tabs
- Phone input: Country code +91 (fixed) + 10-digit input with auto-formatting
- Email input: Standard email input
- "Send OTP" button (Gold, full-width, rounded-full)
- Bottom: Terms & Privacy links

**Interactions:**
- Keyboard-aware view (no content hidden behind keyboard)
- Input validation with inline red error messages
- Button disabled until valid input, subtle pulse animation when enabled
- Haptic feedback on button press

---

### 4.3 OTP Verification Screen

**Layout:**
- Back arrow top-left
- "Verify OTP" heading
- "OTP sent to +91 98XXXX7890" (masked)
- 6 individual OTP input boxes (auto-focus next on type, auto-submit on 6th digit)
- Resend timer countdown (60s), then "Resend OTP" link
- Dev mode: auto-fill banner showing demo OTP

**Animations:**
- OTP boxes: scale bounce on focus
- Timer: fade transition on tick
- Success: confetti/checkmark Lottie before navigation

---

### 4.4 Profile Completion (New Users)

**Layout:**
- "Almost there!" heading
- Name input (required)
- Email input (required if phone login, pre-filled if email login)
- "Continue" button

**Transitions:** Slide up from bottom, forms animate in staggered

---

### 4.5 Home Screen (Main Tab)

**This is the hero screen — must be FAST and BEAUTIFUL.**

**Layout (scrollable, top to bottom):**

1. **Sticky Header** (collapses on scroll)
   - QuickCart logo (left)
   - Location pill: "📍 Nagawara, Bangal..." — tap opens address selector bottom sheet
   - Notification bell icon (right) with unread badge

2. **Search Bar** (below header, becomes sticky on scroll up)
   - "Search for atta, dal, milk..." placeholder with rotating text animation
   - Tap → navigates to dedicated search screen with auto-focus

3. **Hero Banner Carousel** (16:9 ratio)
   - Auto-scroll every 4s with smooth `FadeInRight` transition
   - Dot indicators, swipe-enabled
   - Blurred placeholder while loading

4. **Category Row** (horizontal scroll)
   - Circular category icons (64x64) with labels below
   - 2 rows if >8 categories, horizontal scroll
   - Press: scale down 0.95, release: bounce back + navigate

5. **Offers Strip** (horizontal scroll)
   - Colored offer cards with code, discount %, "APPLY" button
   - Long-press to copy code with haptic

6. **"Popular Products"** section
   - 2-column grid, 6-8 products
   - "See All" link top-right

7. **Category-wise Product Sections**
   - For each category with products:
     - Category name + "See All" header
     - Horizontal scroll of ProductCards

8. **Footer Spacing** (80px for bottom tab clearance)

**Performance:**
- `FlashList` instead of `FlatList` for all lists (10x faster rendering)
- Skeleton loading for each section independently
- Images: progressive JPEG, blur hash placeholder, cached via Expo Image
- Sections load independently (parallel React Query calls)

---

### 4.6 Product Card Component

**Compact card (used in grids and horizontal lists):**

```
┌─────────────────────┐
│  [Heart]    [15%OFF] │  ← Wishlist + discount badge
│                      │
│    [Product Image]   │  ← 120x120, cached, blur placeholder
│                      │
│  Product Name...     │  ← 2 lines max, ellipsis
│  500g                │  ← Size/weight in muted text
│                      │
│  ₹120  ₹150         │  ← Price green + strikethrough
│                      │
│  [  ADD  ] or [-1+]  │  ← Add button → transforms to qty selector
└─────────────────────┘
```

**Interactions:**
- Tap card → navigate to product detail
- Tap heart → toggle wishlist with scale animation + haptic
- Tap ADD → add to cart, button morphs into quantity selector with spring animation
- Quantity selector: - and + buttons, number in center
- If stock < 5: "Only X left!" warning badge
- If stock = 0: Greyed overlay with "Out of Stock"

**Micro-animations:**
- Card press: `scale(0.97)` with `withSpring`
- Heart: `scale(1.3) → scale(1)` bounce
- ADD → qty: `layout animation` morph
- Price: `FadeIn` on load

---

### 4.7 Product Detail Screen

**Layout (scrollable):**

1. **Image Gallery** (top 40% of screen)
   - Horizontal swipe, dot indicators
   - Pinch-to-zoom with `react-native-gesture-handler`
   - Share button top-right overlay

2. **Product Info Card** (rounded top corners, overlaps image slightly)
   - Product name (H2)
   - Size/weight badge
   - Price: ₹120 ~~₹150~~ (15% OFF) badge
   - Star rating (★ 4.2) + review count link
   - Short description

3. **Quantity + Add to Cart** (sticky bottom bar)
   - Quantity selector (left)
   - "Add to Cart — ₹240" button (right, full gold)
   - If in cart: "Update Cart — ₹360"

4. **Tabs**: Description | Reviews
   - Description: full product description text
   - Reviews: star breakdown bars + review list + "Write Review" button

5. **Related Products** section (horizontal scroll)

**Transitions:**
- `SharedElement` transition for product image from card
- Info card: `SlideInUp` with spring
- Sticky bar: `FadeInUp` after 200ms delay

---

### 4.8 Search Screen

**Layout:**
- Auto-focused search input with "Cancel" text button
- Recent searches (MMKV persisted) — tap to re-search, X to remove
- As user types (debounced 300ms): live results in 2-col grid
- Empty state: Lottie "search" animation + "Search for products, categories..."
- No results: Lottie "not found" + "Try a different search term"

**Performance:**
- Debounced API calls (300ms)
- Results rendered in `FlashList`
- Keyboard dismiss on scroll

---

### 4.9 Categories Screen (Tab)

**Layout:**
- Grid of category cards (2 columns)
- Each card: category image (circular/rounded) + name + product count
- Tap → category product list screen

**Category Product List (`/category/[id]`):**
- Header: category name + product count
- Sort/filter chips (Price: Low→High, High→Low, Newest)
- 2-column product grid
- Pull-to-refresh

---

### 4.10 Cart Screen (Tab)

**Layout (if cart has items):**

1. **Header**: "Cart" + item count badge
2. **Cart Items List** (swipeable)
   - Each item: image + name + size + price + quantity selector
   - Swipe left → "Remove" red button (with haptic)
   - Quantity change: immediate optimistic update

3. **Coupon Section**
   - "Apply Coupon" row with arrow → opens coupon bottom sheet
   - Applied coupon: green chip with discount amount + X to remove

4. **Bill Details Card**
   - Item total
   - Delivery fee (or "FREE" in green)
   - Handling fee
   - Coupon discount (if applied, in green with minus)
   - **Total** (bold, large)

5. **Sticky Bottom Bar**
   - Total amount (left)
   - "Proceed to Checkout →" button (right, gold)

**Empty State:**
- Lottie empty cart animation
- "Your cart is empty" text
- "Browse Products" button → navigate to Home

**Coupon Bottom Sheet:**
- Search/enter coupon code input
- Available coupons list with "APPLY" button each
- Applied state: checkmark + "Applied!" green text

---

### 4.11 Checkout Flow

#### Step 1: Review & Address (`/checkout`)

**Layout:**
1. **Order Items** (collapsed, expandable)
2. **Delivery Address**
   - Selected address card with "Change" button
   - If no address: "Add Delivery Address" prompt
   - Tap "Change" → address list bottom sheet with "Add New" option
3. **Delivery Time Estimate**: "Estimated delivery: 10-15 minutes"
4. **Bill Summary** (same as cart)
5. **"Continue to Payment →"** button

#### Step 2: Payment (`/checkout/payment`)

**Layout:**
1. **Payment Methods** list:
   - Cash on Delivery (icon + description)
   - UPI Payment (GPay, PhonePe, Paytm icons)
   - Credit/Debit Card (Visa, Mastercard icons)
   - Each is a selectable radio card

2. **Order Total** reminder
3. **"Place Order — ₹XXX"** button

**Interactions:**
- UPI: opens Razorpay UPI intent
- Card: Razorpay card form
- COD: direct order placement
- Button shows loading spinner during order creation
- Haptic on place order

#### Step 3: Success (`/checkout/success`)

**Layout:**
- Full-screen Lottie success/confetti animation
- "Order Placed!" heading
- Order ID
- Estimated delivery time
- "Track Order" button → order detail
- "Continue Shopping" button → home

**Transition:** No back gesture allowed (replace navigation)

---

### 4.12 Account Screen (Tab)

**Layout (scrollable):**

1. **Profile Header**
   - Avatar circle with initials (or photo)
   - Name, phone, email
   - "Edit Profile" icon button

2. **Quick Actions Grid** (2x2)
   - 📦 My Orders
   - ❤️ Wishlist
   - 📍 Addresses
   - 🎫 My Coupons

3. **Settings List**
   - Notifications toggle
   - Language (English)
   - About QuickCart
   - Help & Support
   - Privacy Policy
   - Terms of Service

4. **Logout Button** (red text, bottom)
   - Confirmation alert before logging out

---

### 4.13 Orders Screen (`/orders`)

**Layout:**
- Tab filters: All | Active | Delivered | Cancelled
- Order cards list:
  - Order ID + date
  - Status badge (color-coded)
  - Item thumbnails row (max 3 + "+N more")
  - Total amount
  - "Track" or "Reorder" button

**Order Detail (`/orders/[id]`):**
- Status timeline (visual vertical stepper with icons)
- Order items list with images
- Delivery address
- Payment details
- Bill breakdown
- "Need Help?" → opens support

---

### 4.14 Wishlist Screen (`/wishlist`)

**Layout:**
- 2-column product grid (same ProductCard but with "Move to Cart" instead of ADD)
- Swipe to remove
- Empty state: Lottie heart animation + "Save items you love"

---

### 4.15 Address Management (`/address`)

**Layout:**
- List of saved addresses with type icon (🏠 Home / 💼 Work / 📍 Other)
- Default address highlighted
- Swipe to delete
- "Add New Address" FAB button

**Add/Edit Address:**
- Map view at top (optional — for pin drop)
- Form: House/Flat, Area/Street, City, State, Pincode
- Address type selector (Home/Work/Other pills)
- "Set as Default" toggle
- "Save Address" button

---

## 5. Navigation Structure

```
Root (_layout)
├── (auth)                    # Stack Navigator (modal presentation)
│   ├── onboarding
│   ├── login
│   ├── verify-otp
│   └── complete-profile
│
├── (tabs)                    # Bottom Tab Navigator
│   ├── Home                  # 🏠
│   ├── Categories            # 📂
│   ├── Search                # 🔍
│   ├── Cart                  # 🛒 (with badge count)
│   └── Account               # 👤
│
├── product/[id]              # Stack (push from any tab)
├── category/[id]             # Stack
├── checkout/*                # Stack (push from Cart)
├── orders/*                  # Stack (push from Account)
├── address/*                 # Stack (push from Account/Checkout)
├── wishlist                  # Stack (push from Account)
├── offers                    # Stack
├── notifications             # Stack
└── settings                  # Stack
```

### Bottom Tab Bar Design

```
┌──────────────────────────────────────────────┐
│  🏠 Home    📂 Browse    🔍    🛒 Cart   👤  │
│             Categories  Search  (2)    Me    │
└──────────────────────────────────────────────┘
```

- Active tab: Gold icon + label, inactive: grey
- Cart tab has red badge with item count
- Search tab: just icon, no label (saves space)
- Subtle top border shadow
- Height: 60px (iOS) / 56px (Android) + safe area

---

## 6. Animation & Transition Guide

### Screen Transitions

| From → To | Animation |
|-----------|-----------|
| Tab switch | Instant (no animation, tabs are preloaded) |
| Any → Product Detail | `SharedElement` on product image + `SlideInUp` for content |
| Any → Search | `FadeIn` (200ms) + auto-focus keyboard |
| Cart → Checkout | `SlideInRight` (native stack push) |
| Checkout → Success | `FadeIn` full screen (replace, no back) |
| Any → Bottom Sheet | `SlideInUp` with spring damping |

### Micro-Animations

| Element | Animation | Trigger |
|---------|-----------|---------|
| Product Card press | `scale(0.97)` spring | `onPressIn` |
| Heart toggle | `scale(1.3→1)` + color change | Tap |
| ADD → Quantity | Layout morph animation | First add |
| Cart badge | `scale(1.2→1)` bounce | Item count change |
| Pull to refresh | Custom Lottie at top | Pull gesture |
| Skeleton loading | Shimmer gradient sweep | While loading |
| Toast notification | `SlideInDown` + auto-dismiss | Action feedback |
| Bottom sheet | Spring `translateY` | Open/close |
| Search bar text | Typewriter rotating placeholder | Idle on home |

### Performance Rules

1. **ALL animations on native thread** via Reanimated `useAnimatedStyle` + `useSharedValue`
2. **Never** use `Animated` from React Native core — always Reanimated 3
3. **Worklet** functions for gesture callbacks
4. **`cancelAnimation`** on unmount to prevent leaks
5. **`LayoutAnimation`** for list item add/remove
6. **60fps minimum** — profile with Flipper/React DevTools

---

## 7. API Integration

### Base URL Config

```typescript
const API_BASE_URL = __DEV__
  ? 'http://localhost:5001/api'      // Dev
  : 'https://quickcart-api-a09g.onrender.com/api';  // Prod
```

### Axios Instance Setup

```typescript
// services/api.ts
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor: inject JWT
api.interceptors.request.use((config) => {
  const token = storage.getString('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.delete('auth_token');
      // Navigate to login
    }
    return Promise.reject(error);
  }
);
```

### React Query Setup

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 min
      gcTime: 15 * 60 * 1000,         // 15 min garbage collection
      retry: 2,
      refetchOnWindowFocus: false,     // Mobile: refetch on app foreground instead
      refetchOnReconnect: true,
    },
  },
});
```

### Endpoint Mapping (reuses existing backend)

| Feature | Method | Endpoint | Notes |
|---------|--------|----------|-------|
| Send OTP | POST | `/auth/send-otp` | `{ phoneNumber }` |
| Verify OTP | POST | `/auth/verify-otp` | `{ phoneNumber, otp }` |
| Send Email OTP | POST | `/auth/send-email-otp` | `{ email }` |
| Complete Profile | POST | `/auth/complete-profile` | `{ phone, name, email }` |
| Get Products | GET | `/products` | `?category=&search=&limit=` |
| Get Product | GET | `/products/{id}` | — |
| Related Products | GET | `/products/{id}/related` | — |
| Get Categories | GET | `/categories` | — |
| Get Cart | GET | `/cart?phone=` | — |
| Add to Cart | POST | `/cart/add` | `{ phone, product_id, quantity }` |
| Update Cart | PUT | `/cart/update` | `{ phone, product_id, quantity }` |
| Remove from Cart | DELETE | `/cart/remove` | `{ phone, product_id }` |
| Clear Cart | DELETE | `/cart/clear?phone=` | — |
| Get Wishlist | GET | `/wishlist?phone=` | — |
| Toggle Wishlist | POST | `/wishlist/add` | `{ phone, product_id }` |
| Remove Wishlist | DELETE | `/wishlist/remove` | `{ phone, product_id }` |
| Create Order | POST | `/orders/create` | Full order payload |
| Get Orders | GET | `/orders` | JWT required |
| Get Order | GET | `/orders/{id}` | JWT required |
| Get Addresses | GET | `/users/addresses?phone=` | — |
| Add Address | POST | `/users/addresses` | Address payload |
| Update Address | PUT | `/users/addresses/{id}` | — |
| Delete Address | DELETE | `/users/addresses/{id}` | — |
| Get Profile | GET | `/users/profile?phone=` | — |
| Get Banners | GET | `/banners/active` | — |
| Get Offers | GET | `/offers/active` | — |
| Validate Coupon | POST | `/offers/validate/{code}` | `{ order_total }` |
| Get Reviews | GET | `/reviews/product/{id}` | — |
| Write Review | POST | `/reviews/product/{id}` | JWT required |
| Active Banners | GET | `/banners/active` | — |

**No backend changes needed** — all existing endpoints are compatible.

---

## 8. Offline & Performance Strategy

### Caching Layers

1. **React Query** — in-memory cache (5 min stale time)
2. **MMKV** — persistent cache for:
   - Auth token
   - User profile
   - Last viewed products
   - Recent searches
   - Cart snapshot (for offline viewing)
3. **Expo Image** — automatic disk cache for all product images

### Optimistic Updates

- Add to cart: update UI immediately, sync to backend in background
- Wishlist toggle: immediate UI, background sync
- Quantity change: immediate, debounced API call (500ms)
- On sync failure: revert UI + show error toast

### App Startup Optimization

1. **Splash screen** stays while fonts + critical data load
2. **Parallel fetch**: categories + banners + products all at once
3. **Skeleton screens** per section (not one big spinner)
4. **Prefetch**: when user views home, prefetch first 3 category product lists
5. **Image preload**: prefetch banner images and top 12 product images

---

## 9. Push Notifications (Expo Notifications)

### Notification Types

| Type | Trigger | Content |
|------|---------|---------|
| Order Confirmed | Order status → confirmed | "Your order #QC123 is confirmed!" |
| Out for Delivery | Status → out_for_delivery | "Your order is on the way! 🚴" |
| Delivered | Status → delivered | "Order delivered! Rate your experience" |
| Offers | Admin push | "🎉 50% off on fruits today!" |
| Cart Reminder | 2hrs after cart abandonment | "Items in your cart are selling fast!" |

### Implementation

- Register for push token on login
- Store token in backend (new endpoint needed: `POST /users/push-token`)
- Backend sends via Firebase Cloud Messaging

> **NOTE**: This is the ONE backend addition needed — a `push_tokens` table and endpoint.

---

## 10. Build & Release

### Development

```bash
npx expo start                    # Start dev server
npx expo start --ios              # iOS simulator
npx expo start --android          # Android emulator
```

### Production Build (EAS)

```bash
eas build --platform android      # APK/AAB
eas build --platform ios          # IPA
eas submit --platform ios         # App Store
eas submit --platform android     # Play Store
```

### Environment Variables

```
EXPO_PUBLIC_API_URL=https://quickcart-api-a09g.onrender.com/api
EXPO_PUBLIC_RAZORPAY_KEY=rzp_live_xxxxx
EXPO_PUBLIC_FIREBASE_PROJECT_ID=quickcart-xxxxx
```

---

## 11. Implementation Order (Sprint Plan)

### Sprint 1 (Week 1-2): Foundation
- [ ] Project setup (Expo, TypeScript, dependencies)
- [ ] Design system (theme, colors, typography, base components)
- [ ] Navigation structure (Expo Router setup)
- [ ] API service layer (Axios, interceptors)
- [ ] Zustand stores (auth, cart, wishlist, location)
- [ ] MMKV storage setup
- [ ] Splash screen + app icon

### Sprint 2 (Week 3-4): Auth + Home
- [ ] Onboarding screens (3 slides + Lottie)
- [ ] Login screen (phone + email)
- [ ] OTP verification screen
- [ ] Profile completion screen
- [ ] Home screen (all sections)
- [ ] Banner carousel
- [ ] Category row
- [ ] Product card component

### Sprint 3 (Week 5-6): Products + Search
- [ ] Product detail screen (images, info, tabs)
- [ ] Product reviews display + write review
- [ ] Category listing screen
- [ ] Search screen (debounced, live results)
- [ ] Product grid component
- [ ] Image gallery with zoom
- [ ] Wishlist screen

### Sprint 4 (Week 7-8): Cart + Checkout
- [ ] Cart screen (full CRUD)
- [ ] Swipeable cart items
- [ ] Coupon application bottom sheet
- [ ] Checkout flow (3 steps)
- [ ] Address selection/creation
- [ ] Payment method selection
- [ ] Order creation + success screen
- [ ] Razorpay integration (UPI + Card)

### Sprint 5 (Week 9-10): Account + Polish
- [ ] Account screen
- [ ] Order history + detail + tracking
- [ ] Address management (CRUD)
- [ ] Settings screen
- [ ] Push notifications setup
- [ ] Skeleton loading screens
- [ ] Empty states (Lottie)
- [ ] Error handling + retry states
- [ ] Pull-to-refresh everywhere

### Sprint 6 (Week 11-12): Testing + Release
- [ ] Performance profiling (60fps check)
- [ ] Memory leak detection
- [ ] API error handling edge cases
- [ ] iOS-specific fixes
- [ ] Android-specific fixes
- [ ] App Store assets (screenshots, descriptions)
- [ ] EAS Build + Submit
- [ ] Beta testing

---

## 12. Backend Changes Needed

The existing Flask backend is **99% compatible**. Only additions:

| Change | Type | Details |
|--------|------|---------|
| Push token storage | NEW table + endpoint | `push_tokens` table, `POST /api/users/push-token` |
| Push notification sending | NEW service | Firebase Admin SDK integration in `services/push_service.py` |
| App version check | NEW endpoint | `GET /api/app/version` — for forced update prompts |

Everything else (auth, products, cart, orders, wishlist, addresses, reviews, offers, banners) works as-is.

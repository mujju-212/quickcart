# Frontend: Key Components Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Component Architecture](#component-architecture)
3. [Common Components](#common-components)
4. [Product Components](#product-components)
5. [Cart Components](#cart-components)
6. [Authentication Components](#authentication-components)
7. [Admin Components](#admin-components)
8. [Form Components](#form-components)
9. [Layout Components](#layout-components)
10. [Utility Components](#utility-components)
11. [Component Composition Patterns](#component-composition-patterns)
12. [Props Documentation](#props-documentation)
13. [Best Practices](#best-practices)

---

## 1. Introduction

### Overview

QuickCart uses a **component-based architecture** with React, organizing components by feature and functionality. The application includes **60+ reusable components** that follow React best practices and design patterns.

### Component Organization

```
src/components/
├── common/          # Shared components used throughout the app
├── product/         # Product display and catalog components
├── cart/            # Shopping cart related components
├── auth/            # Authentication and login components
├── checkout/        # Checkout flow components
├── order/           # Order management components
├── account/         # User account components
├── admin/           # Admin dashboard components
├── address/         # Address management components
├── search/          # Search functionality components
└── forms/           # Form input components
```

### Component Categories

| Category | Count | Purpose |
|----------|-------|---------|
| **Common** | 20 | Shared UI elements (Header, Footer, etc.) |
| **Product** | 9 | Product display and catalog |
| **Cart** | 4 | Shopping cart functionality |
| **Auth** | 3 | Authentication flows |
| **Admin** | 15+ | Admin dashboard features |
| **Checkout** | 5 | Checkout process |
| **Forms** | 8 | Reusable form inputs |

---

## 2. Component Architecture

### Component Hierarchy

```
App
├── ErrorBoundary (wraps entire app)
├── AuthProvider
│   ├── CartProvider
│   │   ├── WishlistProvider
│   │   │   └── LocationProvider
│   │   │       ├── Header
│   │   │       ├── Router
│   │   │       │   ├── Public Routes
│   │   │       │   ├── Protected Routes
│   │   │       │   └── Admin Routes
│   │   │       ├── MobileBottomNav
│   │   │       └── Footer
```

### Component Types

#### 1. Container Components (Smart Components)
- Manage state and business logic
- Connect to Context API
- Handle data fetching
- Examples: `ProductList`, `CartSidebar`, `CheckoutPage`

#### 2. Presentational Components (Dumb Components)
- Focus on UI rendering
- Receive data via props
- No direct state management
- Examples: `ProductCard`, `Button`, `LoadingSpinner`

#### 3. Higher-Order Components (HOC)
- Add functionality to components
- Examples: `ProtectedRoute`, `withAuth`

#### 4. Utility Components
- Provide specific functionality
- Examples: `ErrorBoundary`, `LazyImage`, `Toast`

---

## 3. Common Components

### 3.1 Header Component

**File**: `src/components/common/Header.js`

#### Description
The main navigation header with search, cart, user menu, and location selector.

#### Features
- Responsive design (desktop + mobile)
- Search functionality with live search
- Cart badge showing item count
- User authentication menu
- Location selector
- Category navigation
- Mobile sidebar menu

#### Props

```typescript
interface HeaderProps {
  searchTrigger?: boolean;  // Trigger to show search bar on mobile
}
```

#### Usage Example

```jsx
import Header from './components/common/Header';

function App() {
  const [searchTrigger, setSearchTrigger] = useState(false);
  
  return (
    <Header searchTrigger={searchTrigger} />
  );
}
```

#### Key Implementation Details

```javascript
const Header = ({ searchTrigger }) => {
  const { cart, getCartItemsCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Nagawara, Bengaluru');
  const [categories, setCategories] = useState([]);
  
  // Load categories from database
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Update location
          setCurrentLocation(randomLocation);
          // Show success notification
        },
        (error) => {
          setShowLocationModal(true);
        }
      );
    }
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm border-bottom" sticky="top">
      {/* Header content */}
    </Navbar>
  );
};
```

#### State Management
- `searchQuery`: Current search input
- `showLocationModal`: Controls location modal visibility
- `currentLocation`: User's delivery location
- `categories`: Product categories from database
- `showSidebar`: Mobile sidebar state
- `showSearchBar`: Mobile search bar state

---

### 3.2 Footer Component

**File**: `src/components/common/Footer.js`

#### Description
Site-wide footer with links, company information, and social media.

#### Features
- Responsive multi-column layout
- Social media links
- Company information
- Quick links (About, Support, Legal)
- Admin access link
- Copyright notice with current year

#### Usage Example

```jsx
import Footer from './components/common/Footer';

function App() {
  return (
    <div>
      <main>{/* Page content */}</main>
      <Footer />
    </div>
  );
}
```

#### Implementation

```javascript
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Row className="py-5">
          {/* About Section */}
          <Col lg={3} md={6} className="mb-4">
            <h5 className="footer-title">QuickCart</h5>
            <p className="footer-text">
              Your one-stop online grocery store...
            </p>
            <div className="social-links mt-3">
              <a href="https://facebook.com">
                <i className="fab fa-facebook-f"></i>
              </a>
              {/* More social links */}
            </div>
          </Col>

          {/* Company Links */}
          <Col lg={3} md={6} className="mb-4">
            <h5 className="footer-title">Company</h5>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </Col>

          {/* Support & Legal Links */}
        </Row>

        {/* Copyright */}
        <Row className="footer-bottom py-3">
          <Col>
            <p>&copy; {currentYear} QuickCart. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
```

---

### 3.3 LoadingSpinner Component

**File**: `src/components/common/LoadingSpinner.js`

#### Description
Reusable loading indicator with customizable size and text.

#### Props

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';  // Default: 'md'
  text?: string;               // Default: 'Loading...'
}
```

#### Usage Examples

```jsx
// Basic usage
<LoadingSpinner />

// Small spinner without text
<LoadingSpinner size="sm" text="" />

// Large spinner with custom text
<LoadingSpinner size="lg" text="Fetching products..." />

// In Suspense fallback
<Suspense fallback={<LoadingSpinner text="Loading page..." />}>
  <LazyComponent />
</Suspense>
```

#### Implementation

```javascript
const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return 'spinner-border-sm';
      case 'lg': return 'spinner-border-lg';
      default: return '';
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" variant="primary" className={getSize()} />
      {text && <p className="mt-3 text-muted">{text}</p>}
    </div>
  );
};
```

---

### 3.4 ErrorBoundary Component

**File**: `src/components/common/ErrorBoundary.js`

#### Description
Catches JavaScript errors in child components and displays fallback UI.

#### Features
- Catches React component errors
- Displays user-friendly error message
- Provides refresh and home buttons
- Shows error details in development mode
- Prevents entire app crashes

#### Usage Example

```jsx
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>{/* ... */}</Routes>
      </Router>
    </ErrorBoundary>
  );
}
```

#### Implementation

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log to error reporting service
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <Alert variant="danger">
            <Alert.Heading>
              <i className="fas fa-exclamation-triangle me-2"></i>
              Oops! Something went wrong
            </Alert.Heading>
            <p>Please try refreshing the page.</p>
            <hr />
            <div className="d-flex gap-2">
              <Button onClick={() => window.location.reload()}>
                <i className="fas fa-redo me-2"></i>
                Refresh Page
              </Button>
              <Button onClick={() => window.location.href = '/'}>
                <i className="fas fa-home me-2"></i>
                Go Home
              </Button>
            </div>
            
            {/* Development-only error details */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-3">
                <summary>Error Details</summary>
                <pre>{this.state.error?.toString()}</pre>
              </details>
            )}
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}
```

---

### 3.5 ProtectedRoute Component

**File**: `src/components/common/ProtectedRoute.js`

#### Description
Wraps routes that require authentication, redirects to login if not authenticated.

#### Features
- Checks authentication status
- Shows loading spinner during auth check
- Redirects to login page if not authenticated
- Preserves intended destination URL
- Supports both `user` and `currentUser` states

#### Props

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;  // Component to render if authenticated
}
```

#### Usage Example

```jsx
import ProtectedRoute from './components/common/ProtectedRoute';

<Route 
  path="/account" 
  element={
    <ProtectedRoute>
      <AccountPage />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/orders" 
  element={
    <ProtectedRoute>
      <OrdersPage />
    </ProtectedRoute>
  } 
/>
```

#### Implementation

```javascript
const ProtectedRoute = ({ children }) => {
  const { user, currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" 
           style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user && !currentUser) {
    // Save the attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render protected component if authenticated
  return children;
};
```

#### Workflow

```
User navigates to /account
    ↓
ProtectedRoute checks authentication
    ↓
    ├─→ [Loading] Show spinner while checking
    ├─→ [Not Authenticated] Redirect to /login (save location)
    └─→ [Authenticated] Render AccountPage
```

---

### 3.6 LocationModal Component

**File**: `src/components/common/LocationModal.js`

#### Description
Modal for selecting or entering delivery location.

#### Features
- Search location by pincode or area
- Detect current location using GPS
- Popular locations quick select
- Form validation

#### Usage Example

```jsx
const [showLocationModal, setShowLocationModal] = useState(false);
const [currentLocation, setCurrentLocation] = useState('');

<LocationModal
  show={showLocationModal}
  onHide={() => setShowLocationModal(false)}
  onLocationSelect={(location) => {
    setCurrentLocation(location);
    setShowLocationModal(false);
  }}
/>
```

---

### 3.7 MobileBottomNav Component

**File**: `src/components/common/MobileBottomNav.js`

#### Description
Fixed bottom navigation for mobile devices.

#### Features
- Shows on mobile screens only
- Quick access to Home, Categories, Cart, Account
- Active route highlighting
- Cart badge
- Triggers search modal

#### Navigation Items

| Icon | Label | Route | Badge |
|------|-------|-------|-------|
| 🏠 | Home | `/` | - |
| 🔍 | Search | Search modal | - |
| 📦 | Categories | `/categories` | - |
| 🛒 | Cart | `/cart` | Item count |
| 👤 | Account | `/account` | - |

---

### 3.8 Banner Component

**File**: `src/components/common/Banner.js`

#### Description
Displays promotional banners and offers.

#### Features
- Image with overlay text
- Click to navigate
- Responsive design
- Support for multiple banner types

---

### 3.9 BackToTop Component

**File**: `src/components/common/BackToTop.js`

#### Description
Floating button to scroll to top of page.

#### Features
- Appears after scrolling down
- Smooth scroll animation
- Fixed position in bottom-right
- Responsive visibility

---

## 4. Product Components

### 4.1 ProductCard Component

**File**: `src/components/product/ProductCard.js`

#### Description
Displays individual product with image, price, and actions.

#### Props

```typescript
interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image?: string;
    category?: string;
    size?: string;
    inStock?: boolean;
  };
}
```

#### Features
- Product image with fallback placeholder
- Price display with discount badge
- Add to cart button
- Add to wishlist button (heart icon)
- Hover effects (lift and shadow)
- Click to view product details
- Toast notifications for actions

#### Usage Example

```jsx
import ProductCard from './components/product/ProductCard';

function ProductGrid({ products }) {
  return (
    <Row>
      {products.map(product => (
        <Col md={3} key={product.id}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
}
```

#### Implementation

```javascript
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const productImage = getProductImage(product);
  
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    
    // Show notification
    showToast(`${product.name} added to cart!`, 'success');
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    showToast(added ? 'Added to wishlist!' : 'Removed from wishlist!');
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card 
      className="h-100 product-card position-relative shadow-sm"
      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
      onClick={handleProductClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={productImage} 
          alt={product.name}
          style={{ height: '120px', objectFit: 'cover' }}
        />
        
        {/* Wishlist button */}
        <Button
          variant={isInWishlist(product.id) ? "danger" : "outline-danger"}
          size="sm"
          className="position-absolute top-0 end-0 m-1"
          onClick={handleToggleWishlist}
          style={{ borderRadius: '50%', width: '32px', height: '32px' }}
        >
          <i className="fas fa-heart"></i>
        </Button>

        {/* Discount badge */}
        {discount > 0 && (
          <Badge bg="success" className="position-absolute top-0 start-0 m-2">
            {discount}% OFF
          </Badge>
        )}
      </div>

      <Card.Body>
        <Card.Title className="h6">{product.name}</Card.Title>
        <p className="text-muted small mb-2">{product.size}</p>
        
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="fw-bold text-success">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-muted text-decoration-line-through ms-2 small">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>

        <Button 
          variant="primary" 
          size="sm" 
          className="w-100 mt-2"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};
```

#### Interaction Flow

```
User hovers on card
    ↓
Card lifts with shadow (CSS transform)
    ↓
User clicks card → Navigate to product details
    ↓
User clicks "Add to Cart" button (stops propagation)
    ↓
    ├─→ Add product to cart (CartContext)
    ├─→ Show success toast notification
    └─→ Update cart badge in header
```

---

### 4.2 ProductGrid Component

**File**: `src/components/product/ProductGrid.js`

#### Description
Grid layout for displaying multiple products.

#### Props

```typescript
interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
}
```

#### Features
- Responsive grid (4 columns → 2 → 1)
- Loading skeleton
- Empty state message
- Lazy loading support

#### Usage Example

```jsx
<ProductGrid 
  products={filteredProducts}
  loading={isLoading}
  emptyMessage="No products found"
/>
```

---

### 4.3 CategoryCard Component

**File**: `src/components/product/CategoryCard.js`

#### Description
Displays product category with image and count.

#### Features
- Category image
- Product count badge
- Click to filter by category
- Hover effects

---

### 4.4 ProductImageGallery Component

**File**: `src/components/product/ProductImageGallery.js`

#### Description
Image gallery for product details page.

#### Features
- Multiple product images
- Thumbnail navigation
- Zoom on hover
- Lightbox view
- Image lazy loading

---

### 4.5 ProductReviews Component

**File**: `src/components/product/ProductReviews.js`

#### Description
Displays and manages product reviews.

#### Features
- List all reviews
- Star ratings
- Review submission form
- Review filters (rating, date)
- Pagination

---

### 4.6 RelatedProducts Component

**File**: `src/components/product/RelatedProducts.js`

#### Description
Shows products related to current product.

#### Features
- Same category products
- Carousel/slider layout
- ProductCard integration
- Lazy loading

---

## 5. Cart Components

### 5.1 CartItem Component

**File**: `src/components/cart/CartItem.js`

#### Description
Displays individual item in shopping cart.

#### Props

```typescript
interface CartItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    size: string;
    image?: string;
  };
}
```

#### Features
- Product image thumbnail
- Product name and size
- Price display
- Quantity stepper
- Subtotal calculation
- Remove item button

#### Usage Example

```jsx
import CartItem from './components/cart/CartItem';

function CartPage() {
  const { cart } = useCart();
  
  return (
    <div>
      {cart.map(item => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
}
```

#### Implementation

```javascript
const CartItem = ({ item }) => {
  const { removeFromCart } = useCart();

  return (
    <div className="cart-item border-bottom py-3">
      <Row className="align-items-center">
        {/* Product image */}
        <Col xs={3} md={2}>
          <Image 
            src={getProductImage(item)} 
            alt={item.name}
            fluid
            rounded
            style={{ height: '80px', objectFit: 'cover' }}
          />
        </Col>
        
        {/* Product details */}
        <Col xs={6} md={6}>
          <h6 className="mb-1">{item.name}</h6>
          <p className="text-muted small mb-1">{item.size}</p>
          <p className="fw-bold text-success mb-0">₹{item.price}</p>
        </Col>
        
        {/* Quantity stepper */}
        <Col xs={3} md={2}>
          <QuantityStepper 
            productId={item.id}
            quantity={item.quantity}
          />
        </Col>
        
        {/* Subtotal and remove */}
        <Col xs={12} md={2} className="text-end mt-2 mt-md-0">
          <div className="fw-bold mb-2">
            ₹{item.price * item.quantity}
          </div>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => removeFromCart(item.id)}
          >
            <i className="fas fa-trash"></i>
          </Button>
        </Col>
      </Row>
    </div>
  );
};
```

---

### 5.2 QuantityStepper Component

**File**: `src/components/cart/QuantityStepper.js`

#### Description
Increment/decrement product quantity in cart.

#### Props

```typescript
interface QuantityStepperProps {
  productId: number;
  quantity: number;
}
```

#### Features
- Decrease button (disabled when quantity = 1)
- Current quantity display
- Increase button
- Updates CartContext automatically

#### Usage Example

```jsx
<QuantityStepper 
  productId={product.id} 
  quantity={product.quantity} 
/>
```

#### Implementation

```javascript
const QuantityStepper = ({ productId, quantity }) => {
  const { updateQuantity } = useCart();

  const handleDecrease = () => {
    updateQuantity(productId, quantity - 1);
  };

  const handleIncrease = () => {
    updateQuantity(productId, quantity + 1);
  };

  return (
    <ButtonGroup size="sm" className="quantity-stepper">
      <Button 
        variant="outline-secondary"
        onClick={handleDecrease}
        disabled={quantity <= 1}
      >
        -
      </Button>
      <Button variant="outline-secondary" disabled>
        {quantity}
      </Button>
      <Button 
        variant="outline-secondary"
        onClick={handleIncrease}
      >
        +
      </Button>
    </ButtonGroup>
  );
};
```

---

### 5.3 CartSidebar Component

**File**: `src/components/cart/CartSidebar.js`

#### Description
Slide-out cart panel showing cart summary.

#### Features
- Shows when user clicks cart icon
- List of cart items
- Cart total
- Checkout button
- Close button

---

### 5.4 RecommendedProducts Component

**File**: `src/components/cart/RecommendedProducts.js`

#### Description
Shows recommended products based on cart contents.

#### Features
- AI-based recommendations
- Similar category products
- Frequently bought together
- Quick add to cart

---

## 6. Authentication Components

### 6.1 Login Component

**File**: `src/components/auth/Login.js`

#### Description
Customer login form with OTP verification.

#### Features
- Phone number input
- OTP generation and sending
- OTP verification
- Auto-login after verification
- Redirect to previous page after login

#### Implementation Flow

```
1. User enters phone number
   ↓
2. Click "Send OTP"
   ↓
3. Backend generates 6-digit OTP
   ↓
4. OTP sent via SMS (Twilio/Fast2SMS)
   ↓
5. User enters OTP
   ↓
6. Backend verifies OTP
   ↓
7. JWT token generated
   ↓
8. Store token in cookies + localStorage
   ↓
9. Update AuthContext
   ↓
10. Redirect to home or previous page
```

---

### 6.2 AdminLogin Component

**File**: `src/components/auth/AdminLogin.js`

#### Description
Admin login with username and password.

#### Features
- Username input
- Password input (hidden)
- Remember me checkbox
- Password validation
- Error handling

---

### 6.3 Logout Component

**File**: `src/components/auth/Logout.js`

#### Description
Handles user logout process.

#### Features
- Clear auth token from cookies
- Clear localStorage
- Reset AuthContext
- Redirect to home page

---

## 7. Admin Components

### 7.1 AdminLayout Component

**File**: `src/components/admin/layout/AdminLayout.js`

#### Description
Layout wrapper for all admin pages.

#### Features
- Admin sidebar navigation
- Top navbar with admin info
- Logout button
- Responsive design
- Active route highlighting

---

### 7.2 ProductManagement Component

**File**: `src/components/admin/ProductManagement.js`

#### Description
Admin interface for managing products.

#### Features
- Product list with search and filters
- Add new product form
- Edit product inline
- Delete product with confirmation
- Bulk actions (delete, update stock)
- Image upload
- Category selection

---

### 7.3 OrderManagement Component

**File**: `src/components/admin/OrderManagement.js`

#### Description
Manage customer orders.

#### Features
- Order list with status filters
- Order details view
- Update order status
- Print invoice
- Track delivery

---

### 7.4 CategoryManagement Component

**File**: `src/components/admin/CategoryManagement.js`

#### Description
Manage product categories.

#### Features
- Category list
- Add/edit/delete categories
- Category image upload
- Subcategory support

---

### 7.5 UserManagement Component

**File**: `src/components/admin/UserManagement.js`

#### Description
Manage user accounts.

#### Features
- User list with search
- View user details
- Block/unblock users
- View user orders

---

### 7.6 Analytics Component

**File**: `src/components/admin/Analytics.js`

#### Description
Admin analytics dashboard.

#### Features
- Sales charts (daily, weekly, monthly)
- Revenue metrics
- Top products
- Top categories
- User growth
- Order statistics

---

## 8. Form Components

### 8.1 AddressForm Component

**File**: `src/components/forms/AddressForm.js`

#### Description
Form for adding/editing delivery addresses.

#### Props

```typescript
interface AddressFormProps {
  address?: Address;           // For editing existing address
  onSubmit: (data: Address) => void;
  onCancel: () => void;
}
```

#### Fields
- Full name
- Phone number
- Pincode
- Address line 1
- Address line 2 (optional)
- Landmark (optional)
- City
- State
- Address type (Home/Work/Other)

---

### 8.2 SearchBar Component

**File**: `src/components/forms/SearchBar.js`

#### Description
Search input with autocomplete.

#### Features
- Debounced search (500ms)
- Autocomplete suggestions
- Search history
- Category filter

---

### 8.3 FilterPanel Component

**File**: `src/components/forms/FilterPanel.js`

#### Description
Product filtering interface.

#### Filters
- Price range
- Categories
- Brands
- Ratings
- Availability

---

## 9. Layout Components

### 9.1 PageHeader Component

**File**: `src/components/layout/PageHeader.js`

#### Description
Consistent page header for all pages.

#### Props

```typescript
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; link?: string }>;
  actions?: React.ReactNode;
}
```

#### Usage Example

```jsx
<PageHeader
  title="My Orders"
  subtitle="Track and manage your orders"
  breadcrumbs={[
    { label: 'Home', link: '/' },
    { label: 'Account', link: '/account' },
    { label: 'Orders' }
  ]}
  actions={
    <Button variant="primary">Export PDF</Button>
  }
/>
```

---

### 9.2 Container Component

**File**: `src/components/layout/Container.js`

#### Description
Responsive container with consistent padding.

#### Props

```typescript
interface ContainerProps {
  fluid?: boolean;
  className?: string;
  children: React.ReactNode;
}
```

---

## 10. Utility Components

### 10.1 LazyImage Component

**File**: `src/components/common/LazyImage.js`

#### Description
Image component with lazy loading.

#### Features
- Intersection Observer API
- Loading placeholder
- Error fallback
- Fade-in animation

#### Usage Example

```jsx
<LazyImage
  src="/images/product.jpg"
  alt="Product name"
  placeholder="/images/placeholder.jpg"
  width={300}
  height={300}
/>
```

---

### 10.2 Toast Component

**File**: `src/components/common/ToastSystem.js`

#### Description
Toast notification system.

#### Features
- Success, error, warning, info types
- Auto-dismiss (3 seconds)
- Manual dismiss
- Stacking notifications
- Position control

#### Usage Example

```jsx
import { showToast } from './utils/toast';

showToast('Product added to cart!', 'success');
showToast('Failed to load products', 'error');
showToast('Your session will expire soon', 'warning');
```

---

### 10.3 EmptyState Component

**File**: `src/components/common/EmptyState.js`

#### Description
Displays empty state with icon and message.

#### Props

```typescript
interface EmptyStateProps {
  icon?: string;              // FontAwesome icon class
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

#### Usage Example

```jsx
<EmptyState
  icon="fas fa-shopping-cart"
  title="Your cart is empty"
  message="Start adding products to your cart"
  action={{
    label: 'Browse Products',
    onClick: () => navigate('/products')
  }}
/>
```

---

### 10.4 Notification Component

**File**: `src/components/common/Notification.js`

#### Description
In-app notification badge.

#### Features
- Unread count badge
- Notification dropdown
- Mark as read
- Notification types (order, offer, system)

---

## 11. Component Composition Patterns

### 11.1 Compound Components Pattern

Used for complex components with multiple parts.

```jsx
// Example: Accordion component
<Accordion>
  <Accordion.Item>
    <Accordion.Header>Section 1</Accordion.Header>
    <Accordion.Body>Content 1</Accordion.Body>
  </Accordion.Item>
  <Accordion.Item>
    <Accordion.Header>Section 2</Accordion.Header>
    <Accordion.Body>Content 2</Accordion.Body>
  </Accordion.Item>
</Accordion>
```

### 11.2 Render Props Pattern

Used for sharing code between components.

```jsx
// Example: DataFetcher component
<DataFetcher url="/api/products">
  {({ data, loading, error }) => (
    loading ? <LoadingSpinner /> :
    error ? <ErrorMessage error={error} /> :
    <ProductGrid products={data} />
  )}
</DataFetcher>
```

### 11.3 Higher-Order Component (HOC) Pattern

Used for adding functionality to components.

```jsx
// Example: withAuth HOC
const withAuth = (Component) => {
  return (props) => {
    const { user } = useAuth();
    
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    return <Component {...props} />;
  };
};

// Usage
const ProtectedProfile = withAuth(ProfilePage);
```

### 11.4 Custom Hooks Pattern

Reusable stateful logic.

```jsx
// Example: useProducts hook
const useProducts = (category) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getByCategory(category);
        setProducts(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [category]);
  
  return { products, loading, error };
};

// Usage in component
function CategoryPage({ category }) {
  const { products, loading, error } = useProducts(category);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <ProductGrid products={products} />;
}
```

---

## 12. Props Documentation

### Common Props Pattern

Most components follow these prop patterns:

#### Styling Props

```typescript
interface StylingProps {
  className?: string;           // Additional CSS classes
  style?: React.CSSProperties;  // Inline styles
  variant?: string;             // Component variant
  size?: 'sm' | 'md' | 'lg';   // Size variant
}
```

#### Callback Props

```typescript
interface CallbackProps {
  onClick?: (event: React.MouseEvent) => void;
  onChange?: (value: any) => void;
  onSubmit?: (data: any) => void;
  onClose?: () => void;
  onCancel?: () => void;
}
```

#### Loading & Error Props

```typescript
interface AsyncStateProps {
  loading?: boolean;
  error?: Error | string;
  onRetry?: () => void;
}
```

#### Data Props

```typescript
interface DataProps<T> {
  data: T;
  emptyMessage?: string;
  fallback?: React.ReactNode;
}
```

---

## 13. Best Practices

### 13.1 Component Design

#### ✅ DO

- Keep components small and focused (single responsibility)
- Use functional components with hooks
- Implement prop validation with TypeScript/PropTypes
- Use meaningful component and prop names
- Extract reusable logic into custom hooks
- Memoize expensive computations with `useMemo`
- Memoize callbacks with `useCallback`
- Use React.memo for pure components

#### ❌ DON'T

- Create components with > 300 lines of code
- Mix business logic with UI rendering
- Use inline functions in JSX (causes re-renders)
- Mutate props or state directly
- Use index as key in lists
- Forget to handle loading and error states

### 13.2 Props Best Practices

#### ✅ DO

```jsx
// Good: Descriptive prop names
<Button 
  variant="primary" 
  size="lg"
  onClick={handleSubmit}
  disabled={isSubmitting}
>
  Submit
</Button>

// Good: Object destructuring
const ProductCard = ({ product, onAddToCart, className }) => {
  // ...
};

// Good: Default props
const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  // ...
};
```

#### ❌ DON'T

```jsx
// Bad: Unclear prop names
<Button v="p" s="l" c={fn} d={bool}>Submit</Button>

// Bad: Too many props (use configuration object)
<DataTable 
  col1="Name" col2="Email" col3="Phone"
  sort1="asc" sort2="desc"
  filter1="active" filter2="verified"
/>

// Better: Use configuration object
<DataTable 
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true }
  ]}
/>
```

### 13.3 State Management

#### ✅ DO

```jsx
// Good: Local state for UI-only state
const [isOpen, setIsOpen] = useState(false);

// Good: Context for shared state
const { cart, addToCart } = useCart();

// Good: Derived state
const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
```

#### ❌ DON'T

```jsx
// Bad: Storing derived state
const [totalPrice, setTotalPrice] = useState(0);
useEffect(() => {
  setTotalPrice(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
}, [cart]);
```

### 13.4 Performance Optimization

#### ✅ DO

```jsx
// Good: Memoize expensive calculations
const sortedProducts = useMemo(() => {
  return products.sort((a, b) => b.rating - a.rating);
}, [products]);

// Good: Memoize callbacks
const handleAddToCart = useCallback((product) => {
  addToCart(product);
  showToast('Added to cart!');
}, [addToCart]);

// Good: Lazy load heavy components
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

// Good: Use React.memo for pure components
const ProductCard = React.memo(({ product }) => {
  // ...
});
```

### 13.5 Error Handling

#### ✅ DO

```jsx
// Good: Error boundary for component errors
<ErrorBoundary>
  <ProductList />
</ErrorBoundary>

// Good: Handle async errors
const fetchProducts = async () => {
  try {
    const data = await productService.getAll();
    setProducts(data);
  } catch (error) {
    setError(error.message);
    showToast('Failed to load products', 'error');
  }
};

// Good: Show user-friendly error messages
if (error) {
  return (
    <Alert variant="danger">
      <p>Unable to load products. Please try again later.</p>
      <Button onClick={retry}>Retry</Button>
    </Alert>
  );
}
```

### 13.6 Accessibility

#### ✅ DO

```jsx
// Good: Semantic HTML
<button onClick={handleClick}>Submit</button>

// Good: ARIA labels
<button aria-label="Close modal" onClick={onClose}>
  <i className="fas fa-times"></i>
</button>

// Good: Keyboard navigation
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyPress={(e) => e.key === 'Enter' && handleClick()}
>
  Click me
</div>

// Good: Alt text for images
<img src={product.image} alt={product.name} />
```

#### ❌ DON'T

```jsx
// Bad: Non-semantic HTML
<div onClick={handleClick}>Submit</div>

// Bad: Missing labels
<button onClick={onClose}>
  <i className="fas fa-times"></i>
</button>

// Bad: Missing alt text
<img src={product.image} />
```

### 13.7 Code Organization

```jsx
// Component structure order:
const MyComponent = ({ prop1, prop2 }) => {
  // 1. Hooks
  const context = useContext(MyContext);
  const [state, setState] = useState(initialState);
  const dispatch = useDispatch();
  
  // 2. Computed values
  const derivedValue = useMemo(() => {
    return computeExpensiveValue(state);
  }, [state]);
  
  // 3. Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // 4. Event handlers
  const handleClick = useCallback(() => {
    // Handle click
  }, [dependencies]);
  
  // 5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

### 13.8 Testing

#### Component Testing

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';

test('adds product to cart when button clicked', () => {
  const product = { id: 1, name: 'Apple', price: 50 };
  const mockAddToCart = jest.fn();
  
  render(<ProductCard product={product} onAddToCart={mockAddToCart} />);
  
  const button = screen.getByText('Add to Cart');
  fireEvent.click(button);
  
  expect(mockAddToCart).toHaveBeenCalledWith(product);
});
```

---

## Summary

QuickCart's component library provides **60+ reusable components** organized into:

- **Common Components**: Shared UI elements (Header, Footer, Spinner, etc.)
- **Product Components**: Product display and catalog
- **Cart Components**: Shopping cart functionality
- **Authentication Components**: Login/logout flows
- **Admin Components**: Admin dashboard features
- **Form Components**: Reusable form inputs
- **Layout Components**: Page structure
- **Utility Components**: Helper components

### Key Features

✅ **Reusable**: Components designed for reuse across the app  
✅ **Responsive**: Mobile-first design with Bootstrap  
✅ **Accessible**: ARIA labels, semantic HTML, keyboard navigation  
✅ **Performant**: Lazy loading, memoization, code splitting  
✅ **Tested**: Unit tests with React Testing Library  
✅ **Documented**: Clear props and usage examples

### Component Guidelines

- Keep components focused (single responsibility)
- Use TypeScript/PropTypes for prop validation
- Implement proper error handling
- Add loading states for async operations
- Follow accessibility best practices
- Memoize expensive operations
- Write tests for critical components

---

**Related Documentation**:
- [Frontend Architecture](FRONTEND_01_ARCHITECTURE.md)
- [API Documentation](BACKEND_01_API_DOCUMENTATION.md)
- [State Management (Context API)](FRONTEND_01_ARCHITECTURE.md#context-api)

**Version**: 1.0.0  
**Last Updated**: February 2026

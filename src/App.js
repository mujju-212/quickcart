import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { LocationProvider } from './context/LocationContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import BackToTop from './components/common/BackToTop';
import MobileBottomNav from './components/common/MobileBottomNav';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Account = lazy(() => import('./pages/Account'));
const Login = lazy(() => import('./pages/Login'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Admin = lazy(() => import('./pages/Admin'));
const ProtectedRoute = lazy(() => import('./components/common/ProtectedRoute'));

// Static pages
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Careers = lazy(() => import('./pages/Careers'));
const Blog = lazy(() => import('./pages/Blog'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Support = lazy(() => import('./pages/Support'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));

// Loading component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  }}>
    <div className="text-center">
      <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted">Loading QuickCart...</p>
    </div>
  </div>
);

// Layout component to conditionally show Header/Footer
function Layout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [triggerSearch, setTriggerSearch] = React.useState(false);

  const handleSearchClick = () => {
    setTriggerSearch(prev => !prev);
  };

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header searchTrigger={triggerSearch} />
      <main>{children}</main>
      <Footer />
      <BackToTop />
      <MobileBottomNav onSearchClick={handleSearchClick} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <LocationProvider>
            <Router>
              <div className="App">
                <Layout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/product/:id" element={<ProductDetails />} />
                      <Route path="/search" element={<SearchResults />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/login" element={<Login />} />
                      <Route 
                        path="/checkout" 
                        element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/account" 
                        element={
                          <ProtectedRoute>
                            <Account />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/order-confirmation/:orderId" 
                        element={
                        <ProtectedRoute>
                          <OrderConfirmation />
                        </ProtectedRoute>
                      } 
                    />
                      
                      {/* Admin Route */}
                      <Route path="/admin" element={<Admin />} />
                      
                      {/* Static Pages */}
                      <Route path="/about" element={<AboutUs />} />
                      <Route path="/careers" element={<Careers />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/contact" element={<ContactUs />} />
                      <Route path="/help" element={<HelpCenter />} />
                      <Route path="/support" element={<Support />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/terms-of-service" element={<TermsOfService />} />
                    </Routes>
                  </Suspense>
                </Layout>
              </div>
            </Router>
          </LocationProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
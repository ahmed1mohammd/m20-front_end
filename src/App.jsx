import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import PoliciesPage from './pages/PoliciesPage';
import OffersPage from './pages/OffersPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import { captureAttribution } from './utils/attribution';
import { initTracking, trackPageView } from './utils/tracking';
import { getPublicSettings } from './services/api';

/**
 * Route & Tracking Watcher
 * Captures UTM parameters / click IDs on landing and fires PageView events
 */
function RouteAndTrackingWatcher() {
  const location = useLocation();

  useEffect(() => {
    captureAttribution();
    trackPageView(location.pathname);
  }, [location.pathname, location.search]);

  return null;
}

function StorePausedScreen({ status }) {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const msg = (isAr ? status.messageAr : status.messageEn) || status.messageAr || status.messageEn;
  const back = status.resumeAt
    ? new Date(status.resumeAt).toLocaleString(isAr ? 'ar-EG' : 'en-GB', { dateStyle: 'long', timeStyle: 'short' })
    : '';
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F3EF] px-6 text-center" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-md space-y-4">
        <img src="/img/m20-logo-emerald.png" alt="M20" className="h-14 mx-auto" onError={(e) => { e.target.style.display = 'none'; }} />
        <h1 className="text-2xl font-serif text-[#174F43] uppercase">{isAr ? 'المتجر متوقف مؤقتاً' : 'Temporarily Paused'}</h1>
        <p className="text-sm text-slate-600 leading-relaxed">{msg}</p>
        {back && <p className="text-xs text-slate-500">{isAr ? 'موعد العودة المتوقع: ' : 'Expected back: '}{back}</p>}
      </div>
    </div>
  );
}

function AppContent() {
  const [storeStatus, setStoreStatus] = useState(null);

  useEffect(() => {
    captureAttribution();
    getPublicSettings()
      .then((settings) => {
        if (settings?.storeStatus?.paused) {
          setStoreStatus(settings.storeStatus);
        }
        if (settings?.tracking) {
          initTracking(settings.tracking);
        }
      })
      .catch(() => {});
  }, []);

  if (storeStatus?.paused) {
    return <StorePausedScreen status={storeStatus} />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F4F3EF] text-[#0B0B0B]">
      {/* Dynamic Route & Tracking Watcher */}
      <RouteAndTrackingWatcher />

      <div>
        {/* Top Announcement Bar */}
        <AnnouncementBar />

        {/* Navbar */}
        <Navbar />

        {/* Application Routes */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/men" element={<CollectionPage category="Men" titleKey="nav.men" />} />
            <Route path="/women" element={<CollectionPage category="Women" titleKey="nav.women" />} />
            <Route path="/shop" element={<CollectionPage category="All" titleKey="nav.allFragrances" />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/track-order" element={<OrderTrackingPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />
            <Route path="/auth" element={<LoginPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/policies" element={<PoliciesPage />} />
          </Routes>
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Optional Auth Modal */}
      <AuthModal />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

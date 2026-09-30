import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './context/CartContext';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutElan from './components/AboutElan';
import AboutPage from './pages/AboutPage';
import PoliciesSection from './components/PoliciesSection';
import PoliciesPage from './pages/PoliciesPage';
import OffersSection from './components/OffersSection';
import CheckoutPage from './pages/CheckoutPage';
import FloatingWhatsApp from './components/FloatingWhatsApp';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col justify-between bg-white text-[#03204E]">
          <div>
            {/* Top Announcement Bar */}
            <AnnouncementBar />

            {/* Navbar */}
            <Navbar />

            {/* Application Routes */}
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/men" element={<CollectionPage category="Men" title="FOR HIM COLLECTION" />} />
                <Route path="/women" element={<CollectionPage category="Women" title="FOR HER COLLECTION" />} />
                <Route path="/shop" element={<CollectionPage category="All" title="ALL FRAGRANCES" />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/offers" element={
                  <div className="py-12">
                    <OffersSection offers={[{ code: 'ELAN10', discountPercent: 10, description: '10% off on your first order' }]} />
                  </div>
                } />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/policies" element={<PoliciesPage />} />
              </Routes>
            </main>
          </div>

          {/* Footer */}
          <Footer />

          {/* Cart Drawer */}
          <CartDrawer />

          {/* Floating WhatsApp Action Button */}
          <FloatingWhatsApp />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

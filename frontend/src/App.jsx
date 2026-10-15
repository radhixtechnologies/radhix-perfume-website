import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';

import CustomCursor from './components/CustomCursor';
import ParticlesBackground from './components/ParticlesBackground';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import UpiPaymentModal from './components/UpiPaymentModal';
import LeadModal from './components/LeadModal';
import IntroLoader from './components/IntroLoader';

// Public Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import TrackOrder from './pages/TrackOrder';
import OrderSuccess from './pages/OrderSuccess';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductsManager from './pages/admin/ProductsManager';
import LeadsManager from './pages/admin/LeadsManager';
import OrdersManager from './pages/admin/OrdersManager';
import SettingsManager from './pages/admin/SettingsManager';

function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

function MainAppContent() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const { settings } = useSettings();

  // Auto trigger VIP voucher modal after 10s once per session
  useEffect(() => {
    const shown = sessionStorage.getItem('bnb_popup_shown');
    if (!shown) {
      const timer = setTimeout(() => {
        setIsConsultationOpen(true);
        sessionStorage.setItem('bnb_popup_shown', 'true');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const targetWhatsApp = settings?.whatsapp_number || '919990385942';

  return (
    <Router>
      <div className="min-h-screen bg-dark-950 text-cream-100 flex flex-col relative">
        
        {/* Film Grain Texture */}
        <div className="film-grain" />

        {/* Custom Gold Magnetic Cursor */}
        <CustomCursor />

        {/* Ambient Gold Particles */}
        <ParticlesBackground />

        {/* Intro Cinematic Loader */}
        <IntroLoader />

        {/* Cart Drawer & UPI Payment Modal */}
        <CartDrawer />
        <UpiPaymentModal />
        <LeadModal
          isOpen={isConsultationOpen}
          onClose={() => setIsConsultationOpen(false)}
        />

        {/* Floating WhatsApp Quick Concierge Button (Live synced from settings) */}
        <a
          href={`https://wa.me/${targetWhatsApp}?text=Hello%20Boss%20N%20Buzz%20Originals,%20I%20would%20like%20to%20order%20perfumes.`}
          target="_blank"
          rel="noreferrer"
          title="Chat with Perfumer Concierge"
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_0_25px_rgba(37,211,102,0.5)] hover:scale-110 active:scale-95 transition-all duration-300 group"
        >
          <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </a>

        {/* Public Header on public pages */}
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<Navbar onOpenConsultation={() => setIsConsultationOpen(true)} />} />
        </Routes>

        {/* Route Pages */}
        <div className="flex-1">
          <Routes>
            {/* Public Website */}
            <Route path="/" element={<Home onOpenConsultation={() => setIsConsultationOpen(true)} />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail onOpenConsultation={() => setIsConsultationOpen(true)} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/order-success/:orderNumber" element={<OrderSuccess />} />

            {/* Admin Auth */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Protected Panel */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductsManager />} />
              <Route path="orders" element={<OrdersManager />} />
              <Route path="leads" element={<LeadsManager />} />
              <Route path="settings" element={<SettingsManager />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Public Footer */}
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<Footer />} />
        </Routes>

      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SettingsProvider>
          <MainAppContent />
        </SettingsProvider>
      </CartProvider>
    </AuthProvider>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Sparkles, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

export default function Navbar({ onOpenConsultation }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Collection', path: '/shop' },
    { name: 'Scent Pyramid', path: '/#scent-notes' },
    { name: 'Our Story', path: '/about' },
    { name: 'Track Order', path: '/track-order', highlight: true },
    { name: 'Atelier & Contact', path: '/contact' },
  ];

  const announcement = settings.announcement_text || '✨ FREE LUXURY VELVET BOX & EXPRESS SHIPPING ACROSS INDIA ON ALL ORDERS ✨';

  return (
    <>
      {/* Top Luxury Announcement Bar (Dynamic from Admin Settings) */}
      <div className="bg-gradient-to-r from-dark-950 via-dark-900 to-dark-950 border-b border-gold-500/20 py-1.5 px-4 text-center text-xs tracking-[0.2em] uppercase font-cinzel text-gold-300">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse shrink-0" />
          <span>{announcement}</span>
          <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse shrink-0" />
        </span>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-dark-950/90 backdrop-blur-md border-b border-gold-500/20 py-3 shadow-2xl'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo & Monogram */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-gold-400/40 p-1 bg-dark-900 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:border-gold-400 shadow-gold-glow">
              <span className="font-cinzel text-gold-400 font-extrabold text-sm tracking-widest">
                BNB
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-base md:text-lg font-black tracking-[0.25em] text-cream-50 group-hover:text-gold-300 transition-colors">
                BOSS N BUZZ
              </span>
              <span className="text-[9px] tracking-[0.35em] text-gold-500 font-semibold uppercase -mt-0.5">
                ORIGINALS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs uppercase tracking-[0.2em] font-medium transition-all hover:text-gold-300 flex items-center gap-1.5 ${
                  location.pathname === link.path
                    ? 'text-gold-400 font-semibold'
                    : link.highlight
                    ? 'text-gold-300/90 hover:text-gold-200'
                    : 'text-cream-200'
                }`}
              >
                {link.highlight && <Truck className="w-3.5 h-3.5 text-gold-400" />}
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* Action Buttons: Cart + VIP Consultation */}
          <div className="flex items-center gap-4">
            {/* VIP Consultation Lead Button */}
            <button
              onClick={onOpenConsultation}
              className="hidden lg:inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-cinzel font-semibold px-4 py-2 rounded-full border border-gold-400/50 text-gold-300 hover:bg-gold-500 hover:text-dark-950 transition-all duration-300 shadow-gold-glow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              VIP Consultation
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full border border-gold-400/30 text-gold-300 hover:border-gold-400 hover:text-gold-200 bg-dark-900/60 transition-all shadow-sm"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-gradient text-dark-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-lg font-sans animate-scale">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-cream-100 hover:text-gold-400 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark-950/95 border-b border-gold-500/20 px-6 py-6 backdrop-blur-xl animate-fadeIn">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-sm uppercase tracking-[0.2em] font-medium text-cream-100 hover:text-gold-400 py-1 border-b border-dark-800 flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  {link.highlight && <Truck className="w-4 h-4 text-gold-400" />}
                </Link>
              ))}
              <div className="pt-2 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenConsultation();
                  }}
                  className="w-full text-center py-2.5 rounded-full bg-gold-gradient text-dark-950 font-cinzel font-bold text-xs uppercase tracking-widest shadow-gold-glow"
                >
                  Book VIP Consultation
                </button>
                <Link
                  to="/admin"
                  className="text-center text-[11px] text-cream-300 hover:text-gold-400 uppercase tracking-widest py-1"
                >
                  Atelier Admin Portal →
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

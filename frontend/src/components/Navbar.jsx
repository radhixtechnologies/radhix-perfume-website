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

  const rawAnnouncement = settings.announcement_text || '✨ FREE LUXURY GIFT PACKAGING + EXPRESS SHIPPING ACROSS INDIA ON ALL ORDERS ✨';
  const announcement = rawAnnouncement
    .replace(/[Ô£¿\u00d4\u00a3\u00bf]+/g, '✨')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <>
      {/* Top Luxury Announcement Bar (Dynamic from Admin Settings) */}
      <div className="bg-gradient-to-r from-dark-950 via-dark-900 to-dark-950 border-b border-gold-500/20 py-2 px-4 text-center text-[10px] sm:text-xs tracking-[0.16em] sm:tracking-[0.22em] uppercase font-cinzel text-gold-300 overflow-hidden">
        <span className="inline-flex items-center justify-center gap-2 max-w-full">
          <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse shrink-0" />
          <span className="truncate">{announcement}</span>
          <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse shrink-0" />
        </span>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-dark-950/95 backdrop-blur-md border-b border-gold-500/20 py-3 shadow-2xl'
            : 'bg-dark-950/80 backdrop-blur-sm lg:bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Official Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0 py-0.5">
            <img
              src="/bnnlogo.png"
              alt="Boss N Buzz Originals"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.35)]"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-8 shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[11px] xl:text-xs uppercase tracking-[0.14em] xl:tracking-[0.2em] font-medium transition-all hover:text-gold-300 flex items-center gap-1.5 whitespace-nowrap shrink-0 py-1 ${
                  location.pathname === link.path
                    ? 'text-gold-400 font-semibold'
                    : link.highlight
                    ? 'text-gold-300 hover:text-gold-200'
                    : 'text-cream-200'
                }`}
              >
                {link.highlight && <Truck className="w-3.5 h-3.5 text-gold-400 shrink-0" />}
                <span className="whitespace-nowrap">{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* Action Buttons: Cart + VIP Consultation */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* VIP Consultation Lead Button */}
            <button
              onClick={onOpenConsultation}
              className="hidden xl:inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-cinzel font-semibold px-4 py-2 rounded-full border border-gold-400/50 text-gold-300 hover:bg-gold-500 hover:text-dark-950 transition-all duration-300 shadow-gold-glow whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>VIP Consultation</span>
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-full border border-gold-400/30 text-gold-300 hover:border-gold-400 hover:text-gold-200 bg-dark-900/60 transition-all shadow-sm shrink-0"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-gradient text-dark-950 font-bold text-[9px] sm:text-[10px] w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-lg font-sans animate-scale">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile / Tablet Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-cream-100 hover:text-gold-400 focus:outline-none shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-dark-950/98 border-b border-gold-500/20 px-6 py-6 backdrop-blur-xl animate-fadeIn shadow-2xl">
            <div className="flex flex-col gap-3.5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-xs sm:text-sm uppercase tracking-[0.18em] font-medium text-cream-100 hover:text-gold-400 py-2 border-b border-dark-850 flex items-center justify-between whitespace-nowrap"
                >
                  <span className="whitespace-nowrap">{link.name}</span>
                  {link.highlight && <Truck className="w-4 h-4 text-gold-400 shrink-0" />}
                </Link>
              ))}
              <div className="pt-3 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenConsultation();
                  }}
                  className="w-full py-3 rounded-full bg-gold-gradient text-dark-950 font-cinzel font-bold text-xs uppercase tracking-widest shadow-gold-glow flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Book VIP Consultation</span>
                </button>
                <Link
                  to="/admin"
                  className="text-center text-[11px] text-cream-400 hover:text-gold-400 uppercase tracking-widest py-1 whitespace-nowrap"
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

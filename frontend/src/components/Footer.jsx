import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle, Sparkles, ShieldCheck, Flame, Compass, Truck } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  const targetWhatsApp = settings.whatsapp_number || '919990385942';
  const targetAddress = settings.address || 'Faridabad, Delhi NCR, India';
  const targetEmail = settings.contact_email || 'concierge@bossnbuzz.com';
  const targetPhone = settings.contact_phone || '+91 99903 85942';
  const targetInstagram = settings.instagram_url || 'https://instagram.com/bossnbuzzoriginals';
  const targetFacebook = settings.facebook_url || 'https://facebook.com/bossnbuzzoriginals';
  const tagline = settings.site_tagline || 'BE THE BOSS. CREATE THE BUZZ.';

  return (
    <footer className="bg-dark-950 border-t border-gold-500/20 text-cream-100 relative overflow-hidden">
      
      {/* Upper Luxury Trust Strip */}
      <div className="border-b border-dark-800/80 py-8 bg-dark-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0 bg-dark-900 shadow-gold-glow">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-cinzel text-sm font-bold text-cream-50 uppercase tracking-wider">40% Pure Oil Extrait</h4>
              <p className="text-xs text-cream-300">Nuclear longevity lasting over 24 hours on skin & fabric.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0 bg-dark-900 shadow-gold-glow">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-cinzel text-sm font-bold text-cream-50 uppercase tracking-wider">Express Air Courier</h4>
              <p className="text-xs text-cream-300">Complimentary velvet gift packaging across India.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0 bg-dark-900 shadow-gold-glow">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-cinzel text-sm font-bold text-cream-50 uppercase tracking-wider">Instant UPI Payment</h4>
              <p className="text-xs text-cream-300">Verified via GPay, PhonePe, Paytm, and BHIM QR.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-1 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-full border border-gold-400 p-1 bg-dark-900 flex items-center justify-center shadow-gold-glow">
                <span className="font-cinzel text-gold-400 font-extrabold text-sm tracking-widest">BNB</span>
              </div>
              <div className="flex flex-col">
                <span className="font-cinzel text-lg font-black tracking-[0.2em] text-cream-50">BOSS N BUZZ</span>
                <span className="text-[9px] tracking-[0.35em] text-gold-500 font-semibold uppercase -mt-0.5">ORIGINALS</span>
              </div>
            </Link>
            <p className="text-xs text-cream-300 leading-relaxed mb-6 font-light">
              India's premier luxury perfume house. Engineered for bold Gen-Z leaders and connoisseurs who demand nuclear longevity and magnetic sillage.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={targetInstagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-gold-400/30 flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-dark-950 transition-all"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={targetFacebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-gold-400/30 flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-dark-950 transition-all"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={`https://wa.me/${targetWhatsApp}?text=Hello%20Boss%20N%20Buzz%20Originals,%20I%20would%20like%20to%20order%20perfumes.`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-gold-400/30 flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-dark-950 transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-gold-400 mb-4">The Parfumerie</h5>
            <ul className="space-y-2.5 text-xs text-cream-200">
              <li><Link to="/shop" className="hover:text-gold-300 transition-colors">Complete Haute Collection</Link></li>
              <li><Link to="/shop?category=unisex-extrait" className="hover:text-gold-300 transition-colors">Unisex Extrait de Parfum</Link></li>
              <li><Link to="/shop?category=men-haute-parfumerie" className="hover:text-gold-300 transition-colors">Men's Smoky Oud & Leather</Link></li>
              <li><Link to="/shop?category=women-royal-florals" className="hover:text-gold-300 transition-colors">Women's Velvet Rose & Saffron</Link></li>
              <li><Link to="/#scent-notes" className="hover:text-gold-300 transition-colors">The Scent Pyramid Guide</Link></li>
            </ul>
          </div>

          {/* Atelier & Maison */}
          <div>
            <h5 className="font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-gold-400 mb-4">Maison & Concierge</h5>
            <ul className="space-y-2.5 text-xs text-cream-200">
              <li><Link to="/track-order" className="hover:text-gold-300 text-gold-400 font-bold transition-colors flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Track Live Order</Link></li>
              <li><Link to="/about" className="hover:text-gold-300 transition-colors">Our 40% Oil Philosophy</Link></li>
              <li><Link to="/contact" className="hover:text-gold-300 transition-colors">Bespoke Fragrance Consultation</Link></li>
              <li><a href={`https://wa.me/${targetWhatsApp}`} target="_blank" rel="noreferrer" className="hover:text-gold-300 transition-colors">Direct WhatsApp Concierge</a></li>
              <li><Link to="/admin" className="hover:text-gold-300 text-gold-500 font-semibold transition-colors">Atelier Staff Login →</Link></li>
            </ul>
          </div>

          {/* Contact Details (Dynamic from Admin Settings) */}
          <div>
            <h5 className="font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-gold-400 mb-4">Flagship Atelier</h5>
            <ul className="space-y-3 text-xs text-cream-200">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>{targetAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`tel:${targetPhone.replace(/\s/g, '')}`} className="hover:text-gold-300">{targetPhone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`mailto:${targetEmail}`} className="hover:text-gold-300">{targetEmail}</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-dark-800 flex flex-col md:flex-row items-center justify-between text-[11px] text-cream-300 gap-4">
          <p>© {currentYear} BOSS N BUZZ ORIGINALS. All Rights Reserved. Indian Haute Parfumerie.</p>
          <div className="flex items-center gap-6">
            <span className="text-gold-500 font-cinzel">{tagline}</span>
            <span>Handcrafted in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

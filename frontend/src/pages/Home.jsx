import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Compass, Star, CheckCircle, MessageCircle, Heart, Share2, Truck } from 'lucide-react';
import { api, getFullImageUrl } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import ProductCard from '../components/ProductCard';

export default function Home({ onOpenConsultation }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNoteTab, setActiveNoteTab] = useState('top');
  const { settings } = useSettings();

  // Hero interactive 3D parallax on mouse move
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    api.getFeaturedProducts()
      .then((res) => {
        if (res?.data) setFeaturedProducts(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / 35;
      const y = (e.clientY - innerHeight / 2) / 35;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Split headline for luxury gold styling
  const rawHeadline = settings.hero_headline || 'BE THE BOSS. CREATE THE BUZZ.';
  const headlineParts = rawHeadline.includes('.')
    ? rawHeadline.split('.')
    : [rawHeadline];

  const heroSubtext = settings.hero_subtext || 'Macerated with rare botanicals and aged Indian Assam agarwood at a rare 40% pure Extrait de Parfum concentration. Engineered for 24-hour magnetic sillage that commands the room.';

  return (
    <div className="relative overflow-hidden">
      
      {/* ======================================================== */}
      {/* 1. CINEMATIC HERO SECTION */}
      {/* ======================================================== */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        
        {/* Soft Spotlight Beam Effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-gold-500/15 via-gold-600/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900 border border-gold-500/30 text-gold-400 text-xs font-cinzel font-semibold tracking-[0.25em] uppercase shadow-gold-glow">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>INDIAN LUXURY HAUTE PARFUMERIE</span>
            </div>

            <h1 className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-black text-cream-50 leading-[1.08] tracking-wider">
              {headlineParts[0]?.trim()}
              {headlineParts[1] && (
                <>
                  <br />
                  <span className="gold-text">{headlineParts[1].trim()}</span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-cream-200 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {heroSubtext}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-3">
              <Link
                to="/shop"
                className="px-7 py-3.5 rounded-full bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 font-cinzel font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 shadow-gold-glow-lg hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
              >
                <span>Explore Haute Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/track-order"
                className="px-5 py-3.5 rounded-full border border-gold-500/40 text-cream-100 hover:text-gold-300 hover:border-gold-400 font-cinzel font-bold text-xs uppercase tracking-[0.16em] transition-all bg-dark-900/60 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Truck className="w-4 h-4 text-gold-400" />
                <span>Track Order</span>
              </Link>

              <button
                onClick={onOpenConsultation}
                className="px-5 py-3.5 rounded-full border border-dark-700 hover:border-gold-400 text-cream-200 font-cinzel font-semibold text-xs uppercase tracking-[0.16em] transition-all whitespace-nowrap"
              >
                VIP Consultation
              </button>
            </div>

            {/* Micro Stats */}
            <div className="pt-6 grid grid-cols-3 gap-3 sm:gap-4 border-t border-dark-800/80 max-w-md mx-auto lg:mx-0 text-center sm:text-left">
              <div>
                <span className="block font-cinzel text-xl sm:text-2xl font-black text-gold-300 whitespace-nowrap">40%</span>
                <span className="text-[10px] text-cream-300 uppercase tracking-widest whitespace-nowrap">Pure Oil Extrait</span>
              </div>
              <div>
                <span className="block font-cinzel text-xl sm:text-2xl font-black text-gold-300 whitespace-nowrap">24+ H</span>
                <span className="text-[10px] text-cream-300 uppercase tracking-widest whitespace-nowrap">Nuclear Sillage</span>
              </div>
              <div>
                <span className="block font-cinzel text-xl sm:text-2xl font-black text-gold-300 whitespace-nowrap">100%</span>
                <span className="text-[10px] text-cream-300 uppercase tracking-widest whitespace-nowrap">Cruelty-Free IFRA</span>
              </div>
            </div>

          </div>

          {/* Right Floating Perfume Bottle Column (Interactive 3D Float) */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative w-[300px] sm:w-[380px] aspect-[4/5] flex items-center justify-center">
              
              {/* Back ambient radial ring */}
              <div className="absolute inset-0 rounded-full border border-gold-500/20 animate-spin-slow pointer-events-none" />
              <div className="absolute inset-4 rounded-full border border-gold-500/10 border-dashed pointer-events-none" />

              {/* Floating Hero Perfume Bottle */}
              <div
                className="relative z-10 transition-transform duration-200 ease-out will-change-transform"
                style={{
                  transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0px) rotate(${mouseOffset.x * 0.15}deg)`,
                }}
              >
                <Link to="/product/boss-n-buzz-originals">
                  <img
                    src="/uploads/bnb-originals-bottle.jpg"
                    alt="Boss N Buzz Originals Extrait de Parfum"
                    onError={(e) => { e.currentTarget.src = 'http://127.0.0.1:8000/uploads/bnb-originals-bottle.jpg'; }}
                    className="w-[280px] sm:w-[340px] drop-shadow-[0_25px_35px_rgba(212,175,55,0.45)] animate-float-slow rounded-2xl hover:scale-105 transition-transform"
                  />
                </Link>
              </div>

              {/* Floating Gold Monogram Badge */}
              <div className="absolute bottom-4 right-4 z-20 px-3.5 py-2 rounded-xl bg-dark-900/90 border border-gold-400/40 backdrop-blur-md shadow-gold-glow flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border border-gold-400/50 p-0.5 bg-dark-950 flex items-center justify-center shrink-0">
                  <img src="/bnn-monogram.png" alt="BNB" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = '/bnb-monogram.svg'; }} />
                </div>
                <div className="text-left">
                  <span className="block text-[9px] text-cream-300 font-cinzel uppercase tracking-wider">SIGNATURE RELEASE</span>
                  <span className="block text-[11px] text-gold-300 font-bold font-cinzel">Boss N Buzz Originals • 100 ML</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. THE BRAND STORY & 40% EXTRAIT PHILOSOPHY */}
      {/* ======================================================== */}
      <section className="py-20 bg-dark-900/30 border-y border-gold-500/15 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] font-cinzel text-gold-400 uppercase tracking-[0.25em] font-bold block">
              THE 40% CONCENTRATION REVOLUTION
            </span>
            <h2 className="font-cinzel text-3xl sm:text-5xl font-black text-cream-50 leading-tight">
              "NOT JUST A SCENT, <br />
              <span className="gold-text">A MAGNETIC AURA."</span>
            </h2>
            <p className="text-xs sm:text-sm text-cream-200 font-light leading-relaxed">
              Tired of watered-down designer EDTs that fade in 2 hours? Boss N Buzz was founded with one uncompromising obsession: bring the grandeur of Indian royal perfumery for the bold, ambitious generation.
            </p>
            <p className="text-xs sm:text-sm text-cream-200 font-light leading-relaxed">
              We macerate 15-year aged agarwood from Assam, hand-picked midnight roses from Isparta, and crystalline solar ambroxan from Grasse in dark vaults for 60 days in temperature-controlled dark rooms until liquid perfection.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs text-cream-100 font-semibold">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gold-400" /> IFRA Certified Formulations</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gold-400" /> Zero Synthetic Diluents</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gold-400" /> 100% Hand-Poured in India</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4 sm:gap-5 items-stretch">
              
              {/* Card 1: Pure Bottle */}
              <div className="luxury-glass rounded-2xl p-4 border border-gold-500/20 text-center group flex flex-col justify-between h-full">
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-dark-950 mb-3 flex items-center justify-center border border-gold-500/10 shadow-inner">
                  <img
                    src="/uploads/bnb-originals-bottle.jpg"
                    alt="Boss N Buzz Originals Bottle"
                    onError={(e) => { e.currentTarget.src = 'http://127.0.0.1:8000/uploads/bnb-originals-bottle.jpg'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h4 className="font-cinzel text-xs sm:text-sm font-bold text-cream-50">Pure 40% Extrait</h4>
                  <p className="text-[10px] text-gold-400 uppercase tracking-widest mt-0.5">Heavy Crystal Bottle</p>
                </div>
              </div>

              {/* Card 2: Presentation Chest */}
              <div className="luxury-glass rounded-2xl p-4 border border-gold-500/20 text-center group flex flex-col justify-between h-full">
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-dark-950 mb-3 flex items-center justify-center border border-gold-500/10 shadow-inner">
                  <img
                    src="/uploads/bnb-originals-gift-box.jpg"
                    alt="Boss N Buzz Presentation Box"
                    onError={(e) => { e.currentTarget.src = 'http://127.0.0.1:8000/uploads/bnb-originals-gift-box.jpg'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h4 className="font-cinzel text-xs sm:text-sm font-bold text-cream-50">Artisan Chest</h4>
                  <p className="text-[10px] text-gold-400 uppercase tracking-widest mt-0.5">Gold Braided Handles</p>
                </div>
              </div>

              {/* Card 3: Velvet Bedding */}
              <div className="luxury-glass rounded-2xl p-4 border border-gold-500/20 text-center group flex flex-col justify-between h-full">
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-dark-950 mb-3 flex items-center justify-center border border-gold-500/10 shadow-inner">
                  <img
                    src="/uploads/bnb-originals-box-horizontal.jpg"
                    alt="Open Velvet Gift Chest"
                    onError={(e) => { e.currentTarget.src = 'http://127.0.0.1:8000/uploads/bnb-originals-box-horizontal.jpg'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h4 className="font-cinzel text-xs sm:text-sm font-bold text-cream-50">Satin Gift Box</h4>
                  <p className="text-[10px] text-gold-400 uppercase tracking-widest mt-0.5">Gold Silk Bedding</p>
                </div>
              </div>

              {/* Card 4: Bespoke Carry Bag */}
              <div className="luxury-glass rounded-2xl p-4 border border-gold-500/20 text-center group flex flex-col justify-between h-full">
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-dark-950 mb-3 flex items-center justify-center border border-gold-500/10 shadow-inner">
                  <img
                    src="/uploads/bnb-originals-bag.jpg"
                    alt="Haute Boutique Shopping Bag"
                    onError={(e) => { e.currentTarget.src = 'http://127.0.0.1:8000/uploads/bnb-originals-bag.jpg'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h4 className="font-cinzel text-xs sm:text-sm font-bold text-cream-50">Bespoke Carry Bag</h4>
                  <p className="text-[10px] text-gold-400 uppercase tracking-widest mt-0.5">Matte Black & Gold Embossed</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. FEATURED HAUTE PARFUMS CAROUSEL / GRID */}
      {/* ======================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900 border border-gold-500/20 text-gold-400 text-[10px] font-cinzel uppercase tracking-[0.2em] mb-3">
              <Sparkles className="w-3 h-3 text-gold-400" />
              <span>THE CURATED EDIT</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-5xl font-black text-cream-50 uppercase tracking-wider">
              Signature Releases
            </h2>
          </div>
          
          <Link
            to="/shop"
            className="text-xs font-cinzel font-bold text-gold-400 hover:text-gold-300 uppercase tracking-[0.2em] flex items-center gap-2 group"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-dark-900/50 animate-pulse border border-dark-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 4. INTERACTIVE SCENT PYRAMID EXPLORER */}
      {/* ======================================================== */}
      <section id="scent-notes" className="py-24 bg-dark-900/50 border-t border-gold-500/15 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-cinzel text-gold-400 uppercase tracking-[0.25em] font-bold block">
              OLFACTORY ARCHITECTURE
            </span>
            <h2 className="font-cinzel text-3xl sm:text-5xl font-black text-cream-50 uppercase tracking-wider">
              The 3-Tier Scent Pyramid
            </h2>
            <p className="text-xs text-cream-300 font-light">
              Explore how 40% concentration allows our top, heart, and base notes to evolve dynamically over 24 hours.
            </p>
          </div>

          {/* Interactive Note Tabs */}
          <div className="flex flex-wrap justify-center p-1.5 rounded-2xl sm:rounded-full bg-dark-950 border border-gold-500/30 gap-1.5 sm:gap-2 max-w-full">
            {[
              { id: 'top', label: 'Top Notes (0-30 Mins)', time: 'First Impact' },
              { id: 'heart', label: 'Heart Notes (1-6 Hours)', time: 'Magnetic Core' },
              { id: 'base', label: 'Base Notes (7-24+ Hours)', time: 'Nuclear Drydown' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveNoteTab(tab.id)}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-cinzel font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                  activeNoteTab === tab.id
                    ? 'bg-gold-gradient text-dark-950 shadow-gold-glow scale-105'
                    : 'text-cream-300 hover:text-gold-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Note Tab Card Details */}
          <div className="max-w-3xl mx-auto luxury-glass p-8 rounded-3xl border border-gold-500/30 shadow-2xl transition-all duration-500">
            {activeNoteTab === 'top' && (
              <div className="space-y-4 animate-fadeIn">
                <span className="text-[10px] text-gold-400 font-cinzel tracking-widest uppercase font-bold">
                  THE FIRST 30 MINUTES
                </span>
                <h3 className="font-cinzel text-2xl font-black text-cream-50">
                  Calabrian Bergamot, Kashmiri Saffron, Crushed Cardamom
                </h3>
                <p className="text-xs text-cream-200 leading-relaxed font-light">
                  An immediate electric burst that commands attention. The crisp citrus cuts through the warmth of raw Himalayan spices, leaving an undeniable signature in any room you enter.
                </p>
              </div>
            )}

            {activeNoteTab === 'heart' && (
              <div className="space-y-4 animate-fadeIn">
                <span className="text-[10px] text-gold-400 font-cinzel tracking-widest uppercase font-bold">
                  HOUR 1 TO 6
                </span>
                <h3 className="font-cinzel text-2xl font-black text-cream-50">
                  Aged Assam Oud, Midnight Turkish Rose, French Cognac
                </h3>
                <p className="text-xs text-cream-200 leading-relaxed font-light">
                  As the fragrance settles, the heart blooms into a rich, royal symphony. Macerated Turkish rose petals entwine with dark French cognac and distilled Assam wood for an opulent, intoxicating middle.
                </p>
              </div>
            )}

            {activeNoteTab === 'base' && (
              <div className="space-y-4 animate-fadeIn">
                <span className="text-[10px] text-gold-400 font-cinzel tracking-widest uppercase font-bold">
                  HOUR 7 TO 24+ (NUCLEAR DRYDOWN)
                </span>
                <h3 className="font-cinzel text-2xl font-black text-cream-50">
                  Solar Ambroxan, Smoky Leather, Bourbon Vanilla, Smoked Birch
                </h3>
                <p className="text-xs text-cream-200 leading-relaxed font-light">
                  The legend of Boss N Buzz. Even after a shower or on clothing 3 days later, the warmth of solar ambroxan, dark birch leather, and aged vanilla stays permanently etched into your presence.
                </p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. INSTAGRAM & VIP CLIENTELE WALL */}
      {/* ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[10px] font-cinzel text-gold-400 uppercase tracking-[0.25em] font-bold block mb-1">
              THE BUZZ IN SOCIETY
            </span>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-black text-cream-50 uppercase tracking-wider">
              Worn by Founders, Creators & Royalty
            </h2>
          </div>
          <a
            href={settings.instagram_url || 'https://instagram.com/bossnbuzzoriginals'}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-cinzel font-bold text-gold-300 hover:text-gold-200 uppercase tracking-widest border-b border-gold-400/40 pb-1"
          >
            Follow on Instagram →
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { tag: 'VIP Night Out', quote: 'Nuclear trail that lasted through the afterparty.', bottle: '/uploads/bnb-originals-bottle.jpg', handle: '@kabir_v' },
            { tag: 'Atelier Unboxing', quote: 'The gold satin presentation box is breathtaking.', bottle: '/uploads/bnb-originals-gift-box.jpg', handle: '@ananya.roy' },
            { tag: 'Pure Luxury', quote: 'The aged Cambodian oud note is pure liquid royalty.', bottle: '/uploads/bnb-originals-box-horizontal.jpg', handle: '@rajveer_singh' },
            { tag: 'Haute Gift Bag', quote: 'The unboxing experience feels like high Parisian fashion.', bottle: '/uploads/bnb-originals-bag.jpg', handle: '@meera.z' },
          ].map((item, idx) => (
            <div key={idx} className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-dark-900 border border-gold-500/20 p-4 flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent z-10" />
              
              <img
                src={item.bottle}
                alt={item.tag}
                onError={(e) => { e.currentTarget.src = 'http://127.0.0.1:8000' + item.bottle; }}
                className="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
              />

              <div className="relative z-20 flex justify-between items-center text-[10px] text-gold-400 font-cinzel uppercase tracking-wider">
                <span>{item.tag}</span>
                <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-500 fill-red-500" /> 1.4k</span>
              </div>

              <div className="relative z-20 space-y-1">
                <p className="text-xs text-cream-100 font-light italic">"{item.quote}"</p>
                <span className="text-[10px] text-gold-300 font-semibold block">{item.handle}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. CONCIERGE CALLOUT BANNER */}
      {/* ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="luxury-glass p-8 sm:p-14 rounded-3xl border border-gold-500/30 text-center space-y-6 shadow-gold-glow relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-gold-400/10 border border-gold-400/40 mx-auto flex items-center justify-center text-gold-400 shadow-gold-glow">
            <Sparkles className="w-8 h-8" />
          </div>

          <h2 className="font-cinzel text-2xl sm:text-4xl font-black text-cream-50 uppercase tracking-wider">
            Need a Personalized Fragrance Consultation?
          </h2>

          <p className="text-xs sm:text-sm text-cream-200 max-w-xl mx-auto font-light leading-relaxed">
            Our Master Perfumer concierge helps you choose the perfect scent signature for your personality, boardroom aura, or wedding wardrobe.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenConsultation}
              className="px-8 py-3.5 rounded-full bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 font-cinzel font-bold text-xs uppercase tracking-widest shadow-gold-glow hover:scale-105 active:scale-95 transition-all"
            >
              Book Complimentary Consultation
            </button>
            <a
              href={`https://wa.me/${settings.whatsapp_number || '919990385942'}?text=Hello%20Boss%20N%20Buzz,%20I%20would%20like%20a%20personal%20scent%20consultation.`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-full border border-gold-500/40 text-cream-100 hover:text-gold-300 font-cinzel font-bold text-xs uppercase tracking-widest flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Atelier Directly</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

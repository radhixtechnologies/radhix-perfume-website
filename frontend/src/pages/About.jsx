import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Award, ShieldCheck, Compass, CheckCircle } from 'lucide-react';

export default function About() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen space-y-20">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[11px] font-cinzel text-gold-400 uppercase tracking-[0.25em] font-bold block">
          HERITAGE & CRAFTSMANSHIP
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-cream-50 uppercase tracking-wider">
          The Maison of Boss N Buzz
        </h1>
        <p className="text-xs sm:text-sm text-cream-200 font-light leading-relaxed">
          Crafting nuclear-longevity perfumes inspired by the ancient distillation secrets of Kannauj and the modern refinement of Grasse.
        </p>
      </div>

      {/* Philosophy Block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="luxury-glass rounded-3xl p-8 sm:p-12 border border-gold-500/25 space-y-5">
          <span className="text-[10px] text-gold-400 font-cinzel uppercase tracking-widest font-bold">OUR ORIGIN</span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-cream-50">Born Out of Frustration with Watered-Down Fragrances</h2>
          <p className="text-xs sm:text-sm text-cream-200 font-light leading-relaxed">
            In 2024, our founders noticed that international designer luxury brands in India charge ₹15,000+ for perfumes containing merely 10-15% fragrance oil that vanish before lunch.
          </p>
          <p className="text-xs sm:text-sm text-cream-200 font-light leading-relaxed">
            We asked: Why shouldn't a modern leader possess an elixir formulated at <strong>40% pure Extrait de Parfum concentration</strong> that clings through 16-hour flights, high-stakes boardrooms, and late-night celebrations?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 text-center">
            <div className="font-cinzel text-3xl font-black text-gold-300 mb-1">40%</div>
            <p className="text-xs text-cream-100 font-bold uppercase tracking-wider">Extrait Concentration</p>
            <p className="text-[11px] text-cream-300 mt-1">Triple the oil content of generic EDTs</p>
          </div>
          <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 text-center">
            <div className="font-cinzel text-3xl font-black text-gold-300 mb-1">60 Days</div>
            <p className="text-xs text-cream-100 font-bold uppercase tracking-wider">Dark Chamber Aging</p>
            <p className="text-[11px] text-cream-300 mt-1">Cold maturation for seamless blends</p>
          </div>
          <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 text-center">
            <div className="font-cinzel text-3xl font-black text-gold-300 mb-1">15 Years</div>
            <p className="text-xs text-cream-100 font-bold uppercase tracking-wider">Assam Oud Vintage</p>
            <p className="text-[11px] text-cream-300 mt-1">Sustainably aged wild agarwood</p>
          </div>
          <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 text-center">
            <div className="font-cinzel text-3xl font-black text-gold-300 mb-1">Zero</div>
            <p className="text-xs text-cream-100 font-bold uppercase tracking-wider">Compromises</p>
            <p className="text-[11px] text-cream-300 mt-1">IFRA certified and skin friendly</p>
          </div>
        </div>
      </div>

    </div>
  );
}

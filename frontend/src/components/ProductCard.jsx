import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Sparkles, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getFullImageUrl } from '../services/api';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const price = Number(product.price);
  const discountPrice = product.discount_price ? Number(product.discount_price) : null;
  const effectivePrice = discountPrice || price;
  const discountPercent = discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;

  const handleWhatsAppEnquiry = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const message = encodeURIComponent(
      `Hello Boss N Buzz Originals, I am interested in ordering ${product.name} (Extrait de Parfum, ₹${effectivePrice}). Please share availability and delivery timeframe.`
    );
    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
  };

  return (
    <div className="group relative luxury-glass-interactive rounded-2xl p-4 sm:p-5 flex flex-col h-full overflow-hidden transition-all duration-500">
      
      {/* Top Badges */}
      <div className="flex items-center justify-between z-10 mb-3">
        {discountPercent > 0 ? (
          <span className="bg-gold-gradient text-dark-950 font-bold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full font-cinzel shadow-sm">
            {discountPercent}% OFF
          </span>
        ) : (
          <span className="bg-dark-900 border border-gold-500/30 text-gold-400 text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full font-cinzel">
            ORIGINALS
          </span>
        )}

        <span className="text-[10px] text-cream-300 font-cinzel uppercase tracking-widest bg-dark-900/80 px-2 py-0.5 rounded border border-dark-700">
          {product.size_ml} ML
        </span>
      </div>

      {/* Perfume Bottle Image with Parallax Hover */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden rounded-xl mb-4 bg-dark-950 flex items-center justify-center p-3">
        <img
          src={getFullImageUrl(product.main_image)}
          alt={product.name}
          onError={(e) => { e.currentTarget.src = 'http://127.0.0.1:8000' + product.main_image; }}
          className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-108 group-hover:-translate-y-2 filter drop-shadow-[0_15px_25px_rgba(212,175,55,0.25)]"
          loading="lazy"
        />

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <span className="px-3 py-1.5 rounded-full bg-gold-gradient text-dark-950 font-cinzel text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
            <Eye className="w-3.5 h-3.5" /> Explore Scent
          </span>
        </div>
      </Link>

      {/* Scent Info */}
      <div className="flex-1 flex flex-col">
        <span className="text-[10px] text-gold-400 font-cinzel uppercase tracking-[0.2em] font-bold mb-1">
          {product.concentration || 'Extrait de Parfum'}
        </span>

        <Link to={`/product/${product.slug}`}>
          <h3 className="font-cinzel text-base sm:text-lg font-bold text-cream-50 group-hover:text-gold-300 transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-cream-300 line-clamp-2 font-light leading-relaxed mb-3">
          {product.short_description}
        </p>

        {/* Top Notes Highlight */}
        {product.top_notes && (
          <div className="text-[10px] text-cream-200 bg-dark-900/90 rounded px-2.5 py-1 mb-4 border border-dark-700/60 line-clamp-1">
            <span className="text-gold-500 font-semibold">Notes:</span> {product.top_notes}
          </div>
        )}

        {/* Price & Action Row */}
        <div className="mt-auto pt-3 border-t border-dark-800 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-cinzel text-lg font-black text-gold-300">
                ₹{effectivePrice.toLocaleString('en-IN')}
              </span>
              {discountPrice && (
                <span className="text-xs text-cream-300 line-through">
                  ₹{price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[9px] text-cream-300 uppercase tracking-widest block">Incl. all taxes</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* WhatsApp Enquire */}
            <button
              onClick={handleWhatsAppEnquiry}
              title="Order on WhatsApp"
              className="p-2 rounded-xl border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            {/* Add to Cart */}
            <button
              onClick={() => addToCart(product, 1)}
              className="px-3.5 py-2 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-gold-glow hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cart</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

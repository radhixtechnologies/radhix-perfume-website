import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, MessageCircle, ShieldCheck, Sparkles, ArrowLeft, Heart, Check, Star, Clock, Zap } from 'lucide-react';
import { api, getFullImageUrl } from '../services/api';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail({ onOpenConsultation }) {
  const { slug } = useParams();
  const { addToCart, setIsCheckoutOpen } = useCart();
  const { settings } = useSettings();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getProductBySlug(slug)
      .then((res) => {
        if (res?.data) {
          setProduct(res.data);
          setSelectedImage(res.data.main_image);
        } else {
          setError('Perfume not found');
        }
      })
      .catch((err) => setError(err.message || 'Error loading product'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-gold-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="font-cinzel text-2xl font-bold text-cream-50 mb-2">Perfume Not Found</h2>
        <p className="text-xs text-cream-300 mb-6">The requested fragrance elixir could not be located in our archives.</p>
        <Link to="/shop" className="px-6 py-2.5 rounded-full bg-gold-gradient text-dark-950 font-cinzel font-bold text-xs uppercase tracking-widest">
          Return to Collection
        </Link>
      </div>
    );
  }

  const price = Number(product.price);
  const discountPrice = product.discount_price ? Number(product.discount_price) : null;
  const effectivePrice = discountPrice || price;

  const handleInstantBuy = () => {
    addToCart(product, 1);
    setIsCheckoutOpen(true);
  };

  const handleWhatsAppOrder = () => {
    const targetWhatsApp = settings.whatsapp_number || '919990385942';
    const message = encodeURIComponent(
      `Hello Boss N Buzz Originals Atelier,\n\nI would like to order:\nProduct: ${product.name}\nSize: ${product.size_ml} ML Extrait\nPrice: ₹${effectivePrice}\n\nPlease guide me on delivery.`
    );
    window.open(`https://wa.me/${targetWhatsApp}?text=${message}`, '_blank');
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Back Link */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-xs font-cinzel font-bold text-cream-300 hover:text-gold-300 uppercase tracking-widest mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Collection</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        
        {/* Left: Product Gallery */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full aspect-[4/5] rounded-3xl bg-dark-950 border border-gold-500/25 p-8 flex items-center justify-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-radial-gradient from-gold-500/10 via-transparent to-transparent pointer-events-none" />
            <img
              src={getFullImageUrl(selectedImage || product.main_image)}
              alt={product.name}
              className="max-h-[85%] object-contain drop-shadow-[0_25px_35px_rgba(212,175,55,0.3)] animate-float-slow"
            />
          </div>

          {/* Additional Images Thumbnails if available */}
          {product.additional_images && product.additional_images.length > 0 && (
            <div className="w-full mt-5">
              <span className="block text-center text-[10px] font-cinzel uppercase tracking-[0.2em] text-gold-400 font-semibold mb-2.5">
                Fragrance & Packaging Gallery
              </span>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedImage(product.main_image)}
                  className={`w-16 h-20 rounded-xl bg-dark-900 border p-1 transition-all duration-300 ${
                    selectedImage === product.main_image
                      ? 'border-gold-400 ring-2 ring-gold-400/50 shadow-gold-glow scale-105'
                      : 'border-dark-700 hover:border-dark-500 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={getFullImageUrl(product.main_image)} alt="Cover view" className="w-full h-full object-contain" />
                </button>
                {product.additional_images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-20 rounded-xl bg-dark-900 border p-1 transition-all duration-300 ${
                      selectedImage === img
                        ? 'border-gold-400 ring-2 ring-gold-400/50 shadow-gold-glow scale-105'
                        : 'border-dark-700 hover:border-dark-500 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={getFullImageUrl(img)} alt={`Gallery view ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900 border border-gold-500/30 text-gold-400 text-[10px] font-cinzel uppercase tracking-[0.2em] font-semibold mb-3">
              <Sparkles className="w-3 h-3" />
              {product.concentration || 'Extrait de Parfum'}
            </div>

            <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-cream-50 leading-tight">
              {product.name}
            </h1>
            
            {product.tagline && (
              <p className="font-serif italic text-base text-gold-300 mt-1">
                "{product.tagline}"
              </p>
            )}
          </div>

          {/* Price Strip */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="font-cinzel text-3xl font-black text-gold-300">
              ₹{effectivePrice.toLocaleString('en-IN')}
            </span>
            {discountPrice && (
              <span className="text-base text-cream-300 line-through">
                ₹{price.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-[11px] text-cream-300 uppercase tracking-widest pl-2">
              • {product.size_ml} ML Bottle (Incl. Taxes)
            </span>
          </div>

          <p className="text-xs sm:text-sm text-cream-200 leading-relaxed font-light">
            {product.full_description}
          </p>

          {/* Scent Pyramid Breakdown Box */}
          <div className="luxury-glass rounded-2xl p-5 border border-gold-500/25 space-y-3">
            <h3 className="font-cinzel text-xs font-bold text-gold-400 uppercase tracking-[0.2em]">
              The Scent Pyramid
            </h3>
            
            <div className="text-xs space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <span className="text-gold-300 font-semibold uppercase tracking-wider text-[11px] w-28 shrink-0">Top Notes:</span>
                <span className="text-cream-100">{product.top_notes}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <span className="text-gold-300 font-semibold uppercase tracking-wider text-[11px] w-28 shrink-0">Heart Notes:</span>
                <span className="text-cream-100">{product.heart_notes}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <span className="text-gold-300 font-semibold uppercase tracking-wider text-[11px] w-28 shrink-0">Base Notes:</span>
                <span className="text-cream-100">{product.base_notes}</span>
              </div>
            </div>
          </div>

          {/* Longevity & Sillage Gauges */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-dark-900 border border-dark-800">
              <div className="flex items-center gap-1.5 text-gold-400 text-xs font-cinzel font-bold mb-1">
                <Clock className="w-3.5 h-3.5" /> Longevity
              </div>
              <span className="text-xs text-cream-100 font-medium">{product.longevity || '24+ Hours Nuclear'}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-900 border border-dark-800">
              <div className="flex items-center gap-1.5 text-gold-400 text-xs font-cinzel font-bold mb-1">
                <Zap className="w-3.5 h-3.5" /> Sillage
              </div>
              <span className="text-xs text-cream-100 font-medium">{product.sillage || 'Magnetic Aura'}</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-4">
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => addToCart(product, 1)}
                className="flex-1 py-4 rounded-xl border border-gold-400/60 hover:bg-gold-500/10 text-gold-300 font-cinzel font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-sm whitespace-nowrap"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>

              <button
                onClick={handleInstantBuy}
                className="flex-1 py-4 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 font-cinzel font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-gold-glow hover:scale-[1.01] whitespace-nowrap"
              >
                Buy Now with UPI
              </button>
            </div>

            {/* Direct WhatsApp Order Button */}
            <button
              onClick={handleWhatsAppOrder}
              className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-dark-950 font-cinzel font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              Order Instantly on WhatsApp
            </button>

          </div>

          {/* Guarantee Perks */}
          <div className="pt-4 border-t border-dark-800 grid grid-cols-2 gap-3 text-[11px] text-cream-300">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-gold-400" />
              <span>Complimentary Velvet Box</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-gold-400" />
              <span>Free Express Insured Delivery</span>
            </div>
          </div>

        </div>

      </div>

      {/* Related Perfumes */}
      {product.related && product.related.length > 0 && (
        <div className="pt-16 border-t border-dark-800">
          <h2 className="font-cinzel text-2xl font-bold text-cream-50 mb-8 text-center sm:text-left">
            Complementary Fragrances
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {product.related.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

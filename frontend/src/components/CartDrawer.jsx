import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getFullImageUrl } from '../services/api';

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, setIsCheckoutOpen } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Dark Backdrop */}
      <div
        className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-dark-900 border-l border-gold-500/20 text-cream-100 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-5 border-b border-dark-800 flex items-center justify-between bg-dark-950">
            <div className="flex items-center gap-2.5">
              <img src="/bnn-monogram.png" alt="BNB" className="w-6 h-6 object-contain" />
              <h2 className="font-cinzel text-base font-bold text-cream-50 uppercase tracking-widest">
                Your Luxury Bag
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-cream-300 hover:text-gold-400 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-cream-300">
                <div className="w-16 h-16 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-400 mb-4 bg-dark-950">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="font-cinzel text-base font-bold text-cream-100 mb-2">Your Bag is Empty</h3>
                <p className="text-xs text-cream-300 mb-6">Discover our 40% pure oil Extrait de Parfum collection and claim your signature aura.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-gold-gradient text-dark-950 font-cinzel font-bold text-xs uppercase tracking-widest shadow-gold-glow"
                >
                  Explore Fragrances
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl bg-dark-950/70 border border-dark-800 relative group"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-20 rounded-lg bg-dark-900 border border-dark-700/50 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={getFullImageUrl(item.main_image)}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-cinzel text-sm font-bold text-cream-50 line-clamp-1">{item.name}</h4>
                      <span className="text-[10px] text-gold-400 font-cinzel uppercase">{item.size_ml} ML • Extrait</span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-dark-700 rounded-lg bg-dark-900">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-gold-400 text-cream-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-cream-50 font-sans">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-gold-400 text-cream-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-cinzel font-bold text-gold-300 text-sm">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-cream-300 hover:text-red-400 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {items.length > 0 && (
            <div className="p-5 border-t border-dark-800 bg-dark-950 space-y-4">
              
              {/* Packaging Perk */}
              <div className="flex items-center gap-2 text-[11px] text-gold-400 bg-gold-500/10 border border-gold-500/20 p-2.5 rounded-xl font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0 text-gold-400" />
                <span>Includes Signature Gold-Embossed Velvet Box & Insured Shipping</span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-cream-300">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-cream-300">
                  <span>Express Luxury Shipping</span>
                  <span className="text-gold-400 uppercase font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-cream-50 pt-2 border-t border-dark-800">
                  <span className="font-cinzel uppercase tracking-wider">Total</span>
                  <span className="font-cinzel text-gold-300 text-base">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 font-cinzel font-extrabold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-gold-glow hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Proceed to UPI Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

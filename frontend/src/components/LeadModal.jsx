import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export default function LeadModal({ isOpen, onClose, defaultProduct = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    product_name: defaultProduct || 'BNB Gold Intense',
    message: '',
    website_url_hp: '', // Honeypot anti-spam
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (defaultProduct) {
      setFormData((prev) => ({ ...prev, product_name: defaultProduct }));
    }
  }, [defaultProduct]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.submitLead({
        ...formData,
        source_page: window.location.pathname,
      });

      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || 'Failed to submit VIP request');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[130] bg-dark-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-dark-900 border border-gold-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-cream-100 overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-gold-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-cream-300 hover:text-gold-400 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gold-gradient text-dark-950 flex items-center justify-center mx-auto shadow-gold-glow animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-cream-50">VIP Access Granted</h3>
            <p className="text-xs text-cream-300 max-w-xs mx-auto leading-relaxed">
              Our Master Perfumer concierge will reach out to you within 2 business hours with your personalized scent recommendation and 15% VIP voucher.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-full bg-gold-gradient text-dark-950 font-cinzel font-bold text-xs uppercase tracking-widest shadow-gold-glow"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <img
                src="/bnnlogo.png"
                alt="Boss N Buzz Originals"
                className="h-11 w-auto mx-auto mb-3 object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
              />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[10px] font-cinzel uppercase tracking-widest mb-2">
                <Sparkles className="w-3 h-3" /> VIP Consultation & 15% Off
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-black text-cream-50 uppercase tracking-wider">
                Claim Your Signature Scent
              </h3>
              <p className="text-xs text-cream-300 mt-1 font-light">
                Connect directly with our Bengaluru atelier for bespoke perfume recommendations.
              </p>
            </div>

            {error && (
              <div className="p-2.5 bg-red-900/40 border border-red-500/40 text-red-200 text-xs rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Honeypot field (hidden) */}
            <input
              type="text"
              name="website_url_hp"
              value={formData.website_url_hp}
              onChange={(e) => setFormData({ ...formData, website_url_hp: e.target.value })}
              className="hidden"
              tabIndex="-1"
              autoComplete="off"
            />

            <div>
              <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Rohan Varma"
                className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl px-3.5 py-2.5 text-xs text-cream-50 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl px-3.5 py-2.5 text-xs text-cream-50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rohan@vip.com"
                  className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl px-3.5 py-2.5 text-xs text-cream-50 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                Fragrance of Interest
              </label>
              <select
                value={formData.product_name}
                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl px-3 py-2.5 text-xs text-cream-50 focus:outline-none"
              >
                <option value="BNB Gold Intense">BNB Gold Intense (Extrait de Parfum)</option>
                <option value="BNB Noir Absolu">BNB Noir Absolu (Dark Leather & Oud)</option>
                <option value="BNB Royal Oud Sovereign">BNB Royal Oud Sovereign (Aged Cambodian Oud)</option>
                <option value="BNB Velvet Rose & Saffron">BNB Velvet Rose & Saffron</option>
                <option value="BNB Elixir Blanc">BNB Elixir Blanc (Mediterranean Fresh)</option>
                <option value="BNB Sovereign Amber">BNB Sovereign Amber (French Cognac & Amber)</option>
                <option value="Custom Bespoke Scent Consultation">Bespoke Custom Consultation</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                Your Preferred Scent Aura / Occasion
              </label>
              <textarea
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Looking for a magnetic evening scent with 24-hour projection..."
                className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl px-3.5 py-2.5 text-xs text-cream-50 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 font-cinzel font-bold text-xs uppercase tracking-[0.2em] shadow-gold-glow hover:scale-[1.01] active:scale-[0.98] transition-all"
            >
              {loading ? 'Transmitting Request...' : 'Submit VIP Request'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

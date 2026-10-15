import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';

export default function Contact() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    product_name: 'Atelier Consultation',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.submitLead({
        ...formData,
        source_page: 'Contact Atelier Page',
      });
      if (res.success) setSuccess(true);
      else setError(res.message || 'Failed to submit inquiry');
    } catch (err) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const targetWhatsApp = settings.whatsapp_number || '919990385942';
  const targetAddress = settings.address || 'Faridabad, Delhi NCR, India';
  const targetEmail = settings.contact_email || 'concierge@bossnbuzz.com';
  const targetPhone = settings.contact_phone || '+91 99903 85942';

  return (
    <div className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-[11px] font-cinzel text-gold-400 uppercase tracking-[0.25em] font-bold block mb-2">
          CONCIERGE & APPOINTMENTS
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-cream-50 uppercase tracking-wider">
          Connect with the Atelier
        </h1>
        <p className="text-xs text-cream-300 mt-2 font-light">
          Whether you require bespoke corporate gifting or personal scent consultation, our concierge is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Info (Dynamic from Admin Settings) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="luxury-glass rounded-2xl p-6 border border-gold-500/25 space-y-4 shadow-xl">
            <h3 className="font-cinzel text-sm font-bold text-cream-50 uppercase tracking-wider">Flagship Atelier</h3>
            
            <div className="space-y-3.5 text-xs text-cream-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>{targetAddress}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`tel:${targetPhone.replace(/\s/g, '')}`} className="hover:text-gold-300">{targetPhone}</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`mailto:${targetEmail}`} className="hover:text-gold-300">{targetEmail}</a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Mon - Sun: 11:00 AM - 9:00 PM IST</span>
              </div>
            </div>

            <div className="pt-3">
              <a
                href={`https://wa.me/${targetWhatsApp}?text=Hello%20Boss%20N%20Buzz%20Atelier,%20I%20would%20like%20to%20connect.`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-[#25D366] text-dark-950 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition-transform"
              >
                <MessageCircle className="w-4 h-4" />
                Direct WhatsApp Concierge
              </a>
            </div>
          </div>

          {/* Location Highlight Badge */}
          <div className="rounded-2xl overflow-hidden border border-dark-800 p-6 text-center text-cream-300 bg-dark-900/60 luxury-glass">
            <MapPin className="w-8 h-8 text-gold-400 mb-2 mx-auto animate-bounce" />
            <h4 className="font-cinzel text-xs font-bold text-cream-100">{targetAddress}</h4>
            <p className="text-[10px] text-cream-300 mt-1">Indian Haute Parfumerie Dispatch Atelier</p>
          </div>
        </div>

        {/* Lead Form */}
        <div className="lg:col-span-7">
          <div className="luxury-glass rounded-2xl p-6 sm:p-10 border border-gold-500/25 shadow-2xl">
            {success ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="font-cinzel text-xl font-bold text-cream-50 uppercase tracking-wider">
                  Appointment Request Received
                </h3>
                <p className="text-xs text-cream-300 max-w-md mx-auto">
                  Our private client concierge will contact you via WhatsApp & Email within 2 business hours.
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setFormData({ name: '', phone: '', email: '', product_name: 'Atelier Consultation', message: '' });
                  }}
                  className="px-6 py-2.5 rounded-full border border-gold-400/40 text-gold-300 font-cinzel text-xs uppercase tracking-widest mt-4"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {error && (
                  <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-200 rounded-xl">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Aryan Malhotra"
                      className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl p-3 text-cream-50 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                      WhatsApp Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl p-3 text-cream-50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. aryan@example.com"
                    className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl p-3 text-cream-50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                    Scent of Interest / Inquiry Type
                  </label>
                  <select
                    value={formData.product_name}
                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                    className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl p-3 text-cream-50 focus:outline-none"
                  >
                    <option value="Atelier Consultation">General Atelier Scent Consultation</option>
                    <option value="BNB Gold Intense (Signature Release)">BNB Gold Intense Extrait</option>
                    <option value="BNB Noir Absolu (Smoky Leather)">BNB Noir Absolu Extrait</option>
                    <option value="BNB Royal Oud Sovereign">BNB Royal Oud Sovereign</option>
                    <option value="BNB Velvet Rose & Saffron">BNB Velvet Rose & Saffron</option>
                    <option value="BNB Elixir Blanc">BNB Elixir Blanc</option>
                    <option value="BNB Sovereign Amber">BNB Sovereign Amber</option>
                    <option value="Luxury Corporate Gifting">Corporate / Wedding Luxury Gifting (Bulk)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                    Your Message / Notes
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the scent profile you prefer or gifting requirements..."
                    className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl p-3 text-cream-50 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 font-cinzel font-bold text-xs uppercase tracking-widest shadow-gold-glow hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? 'Submitting Request...' : 'Send Inquiry to Concierge'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

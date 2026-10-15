import React, { useState, useEffect } from 'react';
import { Save, Lock, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

export default function SettingsManager() {
  const { settings: globalSettings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState({
    site_title: '',
    site_tagline: '',
    hero_headline: '',
    hero_subtext: '',
    announcement_text: '',
    whatsapp_number: '',
    upi_id: 'thakurshanky650@oksbi',
    upi_merchant_name: 'BOSS N BUZZ ORIGINALS',
    contact_email: '',
    contact_phone: '',
    address: '',
    instagram_url: '',
    facebook_url: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Password change
  const [passData, setPassData] = useState({ current_password: '', new_password: '' });
  const [passMsg, setPassMsg] = useState('');

  useEffect(() => {
    api.getSettings()
      .then((res) => {
        if (res?.data) {
          setFormData((prev) => ({ ...prev, ...res.data }));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.updateSettings(formData);
      await refreshSettings();
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassMsg('');
    try {
      const res = await api.changePassword(passData);
      setPassMsg(res.message || 'Password updated successfully');
      setPassData({ current_password: '', new_password: '' });
    } catch (err) {
      setPassMsg(err.message || 'Failed to update password');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="font-cinzel text-gold-400 animate-pulse text-sm">Loading Store Settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-10">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-2xl font-black text-cream-50 uppercase tracking-wider">
            Live Store & Brand Settings
          </h1>
          <p className="text-xs text-cream-300 mt-1">
            Yahan jo bhi update karenge (UPI ID, Hero Headline, Address, WhatsApp), woh turant poori website par live update ho jayega.
          </p>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            api.getSettings()
              .then((res) => {
                if (res?.data) setFormData((prev) => ({ ...prev, ...res.data }));
                refreshSettings();
              })
              .finally(() => setLoading(false));
          }}
          className="px-3.5 py-2 rounded-xl border border-dark-700 hover:border-gold-400 text-xs text-cream-200 flex items-center gap-2 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gold-400" />
          <span>Reload From DB</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-green-950/70 border border-green-500/60 text-green-200 text-xs flex items-center gap-3 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <span>
            <strong>Success!</strong> All brand copy, hero text, and store settings have been saved to MySQL and applied immediately to the live website!
          </span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="luxury-glass p-6 sm:p-8 rounded-2xl border border-dark-800 space-y-8 text-xs">
        
        {/* SECTION 1: HERO COPY */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-dark-800">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <h3 className="font-cinzel text-sm font-bold text-gold-400 uppercase tracking-wider">
              1. Hero Section Headline & Subtext (Homepage Main Banner)
            </h3>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
              Hero Main Headline (Displayed in bold gold on homepage) *
            </label>
            <input
              type="text"
              required
              value={formData.hero_headline || ''}
              onChange={(e) => setFormData({ ...formData, hero_headline: e.target.value })}
              placeholder="e.g. BE THE BOSS. CREATE THE BUZZ."
              className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl p-3 text-cream-50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
              Hero Subtext / Brand Description *
            </label>
            <textarea
              rows={3}
              required
              value={formData.hero_subtext || ''}
              onChange={(e) => setFormData({ ...formData, hero_subtext: e.target.value })}
              placeholder="Macerated with rare botanicals and aged Indian Assam agarwood at a rare 40% pure Extrait de Parfum concentration..."
              className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl p-3 text-cream-50 focus:outline-none"
            />
          </div>
        </div>

        {/* SECTION 2: TOP ANNOUNCEMENT BAR */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-dark-800">
            <h3 className="font-cinzel text-sm font-bold text-gold-400 uppercase tracking-wider">
              2. Top Header Announcement Bar
            </h3>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
              Announcement Ticker Text (Shown above navbar on every page)
            </label>
            <input
              type="text"
              value={formData.announcement_text || ''}
              onChange={(e) => setFormData({ ...formData, announcement_text: e.target.value })}
              placeholder="✨ FREE LUXURY VELVET BOX & EXPRESS SHIPPING ACROSS INDIA ON ALL ORDERS ✨"
              className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl p-3 text-cream-50 focus:outline-none"
            />
          </div>
        </div>

        {/* SECTION 3: UPI PAYMENT CONFIG */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-dark-800">
            <h3 className="font-cinzel text-sm font-bold text-gold-400 uppercase tracking-wider">
              3. Official UPI Payment Gateway Configuration
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                Recipient UPI ID / VPA *
              </label>
              <input
                type="text"
                required
                value={formData.upi_id || ''}
                onChange={(e) => setFormData({ ...formData, upi_id: e.target.value })}
                placeholder="thakurshanky650@oksbi"
                className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl p-3 text-cream-50 font-mono font-bold focus:outline-none"
              />
              <span className="text-[10px] text-gold-400/80 mt-1 block">
                Current configured: <strong>{formData.upi_id || 'thakurshanky650@oksbi'}</strong>
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                UPI Merchant / Beneficiary Display Name *
              </label>
              <input
                type="text"
                required
                value={formData.upi_merchant_name || ''}
                onChange={(e) => setFormData({ ...formData, upi_merchant_name: e.target.value })}
                placeholder="BOSS N BUZZ ORIGINALS"
                className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl p-3 text-cream-50 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: CONTACT & ATELIER INFO */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-dark-800">
            <h3 className="font-cinzel text-sm font-bold text-gold-400 uppercase tracking-wider">
              4. Atelier Contact Details (Footer, Contact Page & WhatsApp)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                WhatsApp Number (e.g. 919990385942)
              </label>
              <input
                type="text"
                value={formData.whatsapp_number || ''}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                placeholder="919990385942"
                className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl p-3 text-cream-50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                Phone Display
              </label>
              <input
                type="text"
                value={formData.contact_phone || ''}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                placeholder="+91 99903 85942"
                className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl p-3 text-cream-50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                Concierge Email
              </label>
              <input
                type="email"
                value={formData.contact_email || ''}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="concierge@bossnbuzz.com"
                className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl p-3 text-cream-50 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
              Flagship Atelier Address
            </label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. Faridabad, Delhi NCR, India"
              className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl p-3 text-cream-50 focus:outline-none"
            />
          </div>
        </div>

        {/* SECTION 5: BRANDING & SOCIAL LINKS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-dark-800">
            <h3 className="font-cinzel text-sm font-bold text-gold-400 uppercase tracking-wider">
              5. Store Titles & Social Handles
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                Browser Tab Title
              </label>
              <input
                type="text"
                value={formData.site_title || ''}
                onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
                className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl p-3 text-cream-50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={formData.site_tagline || ''}
                onChange={(e) => setFormData({ ...formData, site_tagline: e.target.value })}
                className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl p-3 text-cream-50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                value={formData.instagram_url || ''}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                placeholder="https://instagram.com/bossnbuzzoriginals"
                className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl p-3 text-cream-50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                Facebook URL
              </label>
              <input
                type="text"
                value={formData.facebook_url || ''}
                onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                placeholder="https://facebook.com/bossnbuzzoriginals"
                className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl p-3 text-cream-50 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 font-cinzel font-black text-xs uppercase tracking-widest shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Updating Website...' : 'Save & Publish All Brand Settings'}</span>
        </button>

      </form>

      {/* Change Password */}
      <form onSubmit={handlePasswordChange} className="luxury-glass p-6 sm:p-8 rounded-2xl border border-dark-800 space-y-4 text-xs">
        <h3 className="font-cinzel text-sm font-bold text-gold-400 uppercase tracking-wider pb-2 border-b border-dark-800 flex items-center gap-2">
          <Lock className="w-4 h-4 text-gold-400" />
          <span>Change Atelier Admin Password</span>
        </h3>

        {passMsg && (
          <div className="p-3 bg-dark-950 text-gold-300 rounded-xl border border-dark-700">
            {passMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={passData.current_password}
              onChange={(e) => setPassData({ ...passData, current_password: e.target.value })}
              className="w-full bg-dark-950 border border-dark-700 rounded-xl p-2.5 text-cream-50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
              New Password (min. 6 characters)
            </label>
            <input
              type="password"
              required
              value={passData.new_password}
              onChange={(e) => setPassData({ ...passData, new_password: e.target.value })}
              className="w-full bg-dark-950 border border-dark-700 rounded-xl p-2.5 text-cream-50 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl border border-gold-400/50 text-gold-300 hover:bg-gold-500/10 font-cinzel font-bold uppercase tracking-wider"
        >
          Update Password
        </button>
      </form>

    </div>
  );
}

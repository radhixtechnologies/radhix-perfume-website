import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const defaultSettings = {
  site_title: 'BOSS N BUZZ ORIGINALS | Luxury Parfumerie',
  site_tagline: 'Be The Boss. Create The Buzz.',
  hero_headline: 'BE THE BOSS. CREATE THE BUZZ.',
  hero_subtext: 'Macerated with rare botanicals and aged Indian Assam agarwood at a rare 40% pure Extrait de Parfum concentration. Engineered for 24-hour magnetic sillage that commands the room.',
  announcement_text: '✨ FREE LUXURY VELVET BOX & EXPRESS SHIPPING ACROSS INDIA ON ALL ORDERS ✨',
  whatsapp_number: '919990385942',
  upi_id: 'thakurshanky650@oksbi',
  upi_merchant_name: 'BOSS N BUZZ ORIGINALS',
  contact_email: 'concierge@bossnbuzz.com',
  contact_phone: '+91 99903 85942',
  address: 'Faridabad, Delhi NCR, India',
  instagram_url: 'https://instagram.com/bossnbuzzoriginals',
  facebook_url: 'https://facebook.com/bossnbuzzoriginals',
};

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.getSettings();
      if (res?.data && Object.keys(res.data).length > 0) {
        setSettings((prev) => ({ ...prev, ...res.data }));
        if (res.data.site_title) {
          document.title = res.data.site_title;
        }
      }
    } catch (err) {
      console.warn('Could not load remote settings, using fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, refreshSettings: fetchSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);

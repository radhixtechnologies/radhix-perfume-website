import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, MessageCircle, ArrowRight, Truck, Package } from 'lucide-react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const { settings } = useSettings();

  useEffect(() => {
    if (orderNumber) {
      api.getOrder(orderNumber).then((res) => {
        if (res?.data) setOrder(res.data);
      }).catch(() => {});
    }
  }, [orderNumber]);

  const targetWhatsApp = settings.whatsapp_number || '919990385942';

  return (
    <div className="py-20 px-4 max-w-xl mx-auto text-center min-h-[75vh] flex flex-col justify-center">
      {/* Brand Logo */}
      <div className="flex justify-center mb-6">
        <img
          src="/bnnlogo.png"
          alt="Boss N Buzz Originals"
          className="h-14 sm:h-16 w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(212,175,55,0.25)]"
        />
      </div>

      <div className="w-16 h-16 rounded-full bg-gold-gradient text-dark-950 flex items-center justify-center mx-auto shadow-gold-glow mb-6">
        <CheckCircle className="w-10 h-10" />
      </div>

      <span className="text-xs text-gold-400 font-cinzel uppercase tracking-[0.25em]">ATELIER ORDER CONFIRMED</span>
      <h1 className="font-cinzel text-3xl font-black text-cream-50 mt-1 mb-3">
        Thank You for Your Order
      </h1>

      <p className="text-xs text-cream-300 leading-relaxed mb-6">
        Order Reference: <strong className="text-gold-300 font-mono text-sm">{orderNumber}</strong>. We are hand-pouring and preparing your luxury Extrait de Parfum dispatch.
      </p>

      {order && (
        <div className="luxury-glass p-5 rounded-2xl border border-dark-800 text-left text-xs space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-cream-300">Customer:</span>
            <span className="text-cream-100 font-medium">{order.customer_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cream-300">Contact Phone:</span>
            <span className="text-cream-100 font-medium">{order.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cream-300">Payment Status:</span>
            <span className="text-gold-400 font-semibold">{order.payment_status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cream-300">Total Amount:</span>
            <span className="font-cinzel text-gold-300 font-bold text-sm">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to={`/track-order?order=${orderNumber}`}
          className="py-3 px-6 rounded-xl bg-gold-gradient text-dark-950 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow hover:scale-105 active:scale-95 transition-all"
        >
          <Truck className="w-4 h-4" />
          <span>Track Order Status</span>
        </Link>

        <a
          href={`https://wa.me/${targetWhatsApp}?text=${encodeURIComponent('Hello Boss N Buzz Originals, I am checking the dispatch status for order #' + orderNumber)}`}
          target="_blank"
          rel="noreferrer"
          className="py-3 px-6 rounded-xl bg-[#25D366] text-dark-950 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Concierge WhatsApp</span>
        </a>

        <Link
          to="/shop"
          className="py-3 px-6 rounded-xl border border-dark-700 hover:border-gold-400 text-cream-200 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <span>Shop More</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

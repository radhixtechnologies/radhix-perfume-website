import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Clock, Truck, CheckCircle2, AlertCircle, ArrowRight, MessageCircle, MapPin, Phone, Calendar, ShieldCheck } from 'lucide-react';
import { api, getFullImageUrl } from '../services/api';
import { useSettings } from '../context/SettingsContext';

const ORDER_STEPS = [
  { key: 'Placed', label: 'Order Placed', desc: 'Order received & payment queued' },
  { key: 'Processing', label: 'Handcrafted & Bottled', desc: '40% oil maturation & packaging' },
  { key: 'Dispatched', label: 'Dispatched', desc: 'Handed over to express air courier' },
  { key: 'Delivered', label: 'Delivered', desc: 'Safely delivered to your address' },
];

function getStepIndex(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('deliver')) return 3;
  if (s.includes('dispatch') || s.includes('transit') || s.includes('shipped')) return 2;
  if (s.includes('process') || s.includes('bottle') || s.includes('pack')) return 1;
  return 0;
}

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('order') || searchParams.get('phone') || '';
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const { settings } = useSettings();

  const handleSearch = async (searchVal) => {
    const q = (searchVal !== undefined ? searchVal : query).trim();
    if (!q) {
      setError('Please enter your Order Reference ID or 10-digit Mobile Number.');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const res = await api.trackOrder(q);
      if (res.success && res.data && res.data.length > 0) {
        setOrders(res.data);
      } else {
        setOrders([]);
        setError(res.message || 'No orders found matching your search.');
      }
    } catch (err) {
      setOrders([]);
      setError(err.message || 'No matching orders found. Please check your Order ID or Phone Number.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const targetWhatsApp = settings.whatsapp_number || '919990385942';

  return (
    <div className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-dark-900 border border-gold-500/30 text-gold-400 text-xs font-cinzel tracking-widest uppercase">
          <Truck className="w-3.5 h-3.5 text-gold-400" />
          <span>REAL-TIME COURIER DISPATCH</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-cream-50 uppercase tracking-wider">
          Track Your Elixir
        </h1>
        <p className="text-xs sm:text-sm text-cream-300 font-light">
          Track your handcrafted Boss N Buzz fragrance by entering your <strong>Order Reference ID</strong> or your registered <strong>10-Digit Mobile Number</strong>.
        </p>
      </div>

      {/* Search Bar Card */}
      <div className="max-w-2xl mx-auto luxury-glass p-4 sm:p-6 rounded-2xl border border-gold-500/30 shadow-gold-glow">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gold-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Order ID (e.g. BNB-20261015-3601) or Mobile No (e.g. 9876543210)"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-dark-950 border border-dark-700 focus:border-gold-400 text-cream-50 text-xs sm:text-sm tracking-wide focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 font-cinzel font-bold text-xs uppercase tracking-widest shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            {loading ? (
              <span className="animate-pulse">Tracking...</span>
            ) : (
              <>
                <span>Track Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Example Searches */}
        <div className="mt-4 pt-4 border-t border-dark-800 flex flex-wrap items-center justify-between text-[11px] text-cream-300 gap-2">
          <span className="text-gold-400 font-cinzel">Quick Samples:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setQuery('9876543210');
                handleSearch('9876543210');
              }}
              className="px-2.5 py-1 rounded-lg bg-dark-900 border border-dark-700 hover:border-gold-500/50 text-cream-200 transition-colors"
            >
              📱 Phone: 9876543210
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery('BNB-20261015-3601');
                handleSearch('BNB-20261015-3601');
              }}
              className="px-2.5 py-1 rounded-lg bg-dark-900 border border-dark-700 hover:border-gold-500/50 text-cream-200 transition-colors"
            >
              🏷️ Order ID: 3601
            </button>
          </div>
        </div>
      </div>

      {/* Error / Not Found Message */}
      {error && (
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Results List */}
      {orders.length > 0 && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-dark-800 pb-3">
            <h2 className="font-cinzel text-lg font-bold text-cream-50 uppercase tracking-wider">
              Found {orders.length} Order{orders.length > 1 ? 's' : ''}
            </h2>
            <span className="text-xs text-gold-400 font-cinzel">Boss N Buzz Originals Atelier</span>
          </div>

          {orders.map((order) => {
            const currentStepIdx = getStepIndex(order.order_status);
            const isDelivered = currentStepIdx === 3;

            return (
              <div
                key={order.id}
                className="luxury-glass rounded-2xl border border-gold-500/25 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
              >
                {/* Gold Glow Ambient */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Order Top Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dark-800/80 relative z-10">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-cinzel text-xl font-black text-gold-300 tracking-wider">
                        {order.order_number}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-cinzel uppercase font-bold tracking-wider ${
                        isDelivered
                          ? 'bg-green-950 border border-green-500/40 text-green-300'
                          : 'bg-gold-950/60 border border-gold-500/40 text-gold-300'
                      }`}>
                        {order.order_status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-cream-300 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gold-400" />
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span>•</span>
                      <span>Payment: <strong className="text-cream-100">{order.payment_method}</strong> ({order.payment_status})</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-cream-300 font-cinzel uppercase tracking-widest block">TOTAL VALUE</span>
                    <span className="font-cinzel text-2xl font-black text-cream-50">
                      ₹{Number(order.total_amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Visual Status Stepper */}
                <div className="py-4 relative z-10">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                    {ORDER_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div key={step.key} className="flex flex-col items-center text-center relative group">
                          {/* Circle Icon Indicator */}
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-cinzel font-bold text-xs mb-3 transition-all duration-300 ${
                              isCurrent
                                ? 'bg-gold-gradient text-dark-950 shadow-gold-glow scale-110 ring-4 ring-gold-400/20'
                                : isCompleted
                                ? 'bg-dark-900 border-2 border-gold-400 text-gold-300'
                                : 'bg-dark-950 border border-dark-700 text-cream-300/40'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-current" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>

                          <h4 className={`font-cinzel text-xs font-bold uppercase tracking-wider ${
                            isCurrent ? 'text-gold-300' : isCompleted ? 'text-cream-100' : 'text-cream-300/50'
                          }`}>
                            {step.label}
                          </h4>
                          <p className="text-[10px] text-cream-300/70 mt-0.5 leading-tight">
                            {step.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ordered Items Breakdown */}
                <div className="space-y-3 pt-2 relative z-10">
                  <h4 className="font-cinzel text-xs font-bold text-gold-400 uppercase tracking-widest">
                    Bottles in this Dispatch
                  </h4>
                  <div className="divide-y divide-dark-800 bg-dark-950/60 rounded-xl border border-dark-800 p-3 sm:p-4">
                    {order.items && order.items.map((item) => (
                      <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getFullImageUrl(item.image_url)}
                            alt={item.product_name}
                            onError={(e) => { e.currentTarget.src = '/bnb-monogram.svg'; }}
                            className="w-12 h-12 rounded-lg bg-dark-900 border border-dark-700 object-contain p-1"
                          />
                          <div>
                            <h5 className="font-cinzel text-xs font-bold text-cream-50">{item.product_name}</h5>
                            <span className="text-[10px] text-cream-300">
                              {item.size_ml} ml Extrait de Parfum • Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="font-cinzel text-xs font-bold text-gold-300">
                          ₹{Number(item.subtotal || item.price).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Verification Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs relative z-10">
                  <div className="p-4 rounded-xl bg-dark-950/80 border border-dark-800 space-y-2">
                    <span className="text-[10px] font-cinzel text-gold-400 uppercase tracking-widest flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Destination Address
                    </span>
                    <p className="text-cream-100 font-medium">{order.customer_name}</p>
                    <p className="text-cream-300 text-[11px] leading-relaxed">
                      {order.shipping_address}, {order.city}, {order.state} - {order.pincode}
                    </p>
                    <p className="text-cream-300 text-[11px]">Contact: {order.phone}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-dark-950/80 border border-dark-800 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-cinzel text-gold-400 uppercase tracking-widest flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> Payment & Dispatch Guarantee
                      </span>
                      <p className="text-cream-200 text-[11px] mt-1">
                        Method: <strong className="text-cream-100">{order.payment_method}</strong>
                      </p>
                      {order.upi_utr && (
                        <p className="text-cream-200 text-[11px]">
                          UPI UTR Reference: <strong className="text-gold-300 font-mono">{order.upi_utr}</strong>
                        </p>
                      )}
                    </div>

                    <a
                      href={`https://wa.me/${targetWhatsApp}?text=${encodeURIComponent(
                        'Hello Boss N Buzz Originals Atelier,\n\nMain apne Order #' + order.order_number + ' ka status check karna chahta hu.\nCustomer: ' + order.customer_name + ' (' + order.phone + ')'
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#25D366] text-dark-950 font-cinzel font-bold text-[11px] uppercase tracking-wider shadow hover:scale-[1.02] transition-transform mt-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat with Concierge about this Order
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Zero State if searched but no orders */}
      {hasSearched && orders.length === 0 && !loading && !error && (
        <div className="max-w-md mx-auto text-center py-12 space-y-4">
          <Package className="w-12 h-12 text-gold-400/50 mx-auto" />
          <h3 className="font-cinzel text-base font-bold text-cream-50 uppercase">No Orders Found</h3>
          <p className="text-xs text-cream-300">
            Please make sure you entered the correct Order ID or 10-digit phone number used during checkout.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-2.5 rounded-full bg-gold-gradient text-dark-950 font-cinzel font-bold text-xs uppercase tracking-widest shadow-gold-glow"
          >
            Explore Collection
          </Link>
        </div>
      )}

    </div>
  );
}

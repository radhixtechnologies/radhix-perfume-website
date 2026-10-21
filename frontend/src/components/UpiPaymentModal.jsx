import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  MessageCircle,
  Banknote,
  Truck,
  Sparkles,
  CreditCard,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { api } from '../services/api';

export default function UpiPaymentModal() {
  const { items, totalPrice, isCheckoutOpen, setIsCheckoutOpen, clearCart } = useCart();
  const { settings } = useSettings();

  const [step, setStep] = useState('shipping'); // 'shipping' | 'upi_payment' | 'confirmed'
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'COD'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Shipping Form
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    shipping_address: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
  });

  // Created Order details
  const [createdOrder, setCreatedOrder] = useState(null);
  const [upiUtr, setUpiUtr] = useState('');
  const [utrSubmitted, setUtrSubmitted] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInitiateOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.customer_name || !formData.phone || !formData.shipping_address || !formData.pincode) {
      setError('Kripya sabhi zaroori shipping details bharein.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        payment_method: paymentMethod,
        items: items.map((it) => ({
          id: it.id,
          quantity: it.quantity,
        })),
      };

      const res = await api.createOrder(payload);
      if (res.success && res.order) {
        setCreatedOrder(res.order);
        if (paymentMethod === 'COD') {
          // Trigger celebratory confetti for instant COD order confirmation
          confetti({
            particleCount: 140,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#F5D77A', '#D4AF37', '#B8860B', '#FFFFFF'],
          });
          setStep('confirmed');
          clearCart();
        } else {
          setStep('upi_payment');
        }
      } else {
        setError(res.message || 'Order initiate karne mein samasya aayi.');
      }
    } catch (err) {
      setError(err.message || 'Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const targetUpiId = createdOrder?.upi_id || 'thakurshanky650@oksbi';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(targetUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmUpiPayment = async () => {
    if (!upiUtr.trim()) {
      setError('Payment ke baad mila hua 12-digit UPI UTR / Reference Transaction ID yahan dalein.');
      return;
    }

    if (upiUtr.trim().length < 8) {
      setError('Kripya valid 12-digit UTR / Reference ID dalein.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api.submitUtr({
        order_number: createdOrder.order_number,
        upi_utr: upiUtr.trim(),
      });

      // Confetti celebration!
      confetti({
        particleCount: 130,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#F5D77A', '#D4AF37', '#B8860B', '#FFFFFF'],
      });

      setUtrSubmitted(true);
      setStep('confirmed');
      clearCart();
    } catch (err) {
      setError(err.message || 'Payment reference verify karne mein samasya aayi.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppReceipt = () => {
    const targetWhatsApp = settings.whatsapp_number || '919990385942';
    let text = '';
    if (createdOrder?.payment_method === 'COD') {
      text = encodeURIComponent(
        `Hello Boss N Buzz Originals Atelier,\n\nMaine Cash on Delivery (COD) order place kiya hai:\n\n• Order Number: ${createdOrder?.order_number}\n• Amount to Pay on Delivery: ₹${createdOrder?.total_amount}\n• Payment Mode: Cash on Delivery (COD)\n• Customer: ${formData.customer_name} (${formData.phone})\n• Shipping Address: ${formData.shipping_address}, ${formData.city}, ${formData.pincode}\n\nKripya mera order confirm karke dispatch timeline share karein.\nDhanyawad!`
      );
    } else {
      text = encodeURIComponent(
        `Hello Boss N Buzz Originals Atelier,\n\nMaine UPI payment successfully krr diya hai:\n\n• Order Number: ${createdOrder?.order_number}\n• UPI ID: ${targetUpiId}\n• Amount Paid: ₹${createdOrder?.total_amount}\n• 12-Digit UTR Reference: ${upiUtr}\n• Customer: ${formData.customer_name} (${formData.phone})\n\nKripya mera order verify karke dispatch status share karein.\nDhanyawad!`
      );
    }
    window.open(`https://wa.me/${targetWhatsApp}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-dark-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-dark-900 border border-gold-500/30 rounded-2xl shadow-2xl overflow-hidden text-cream-100">
        
        {/* Modal Header */}
        <div className="p-5 bg-dark-950 border-b border-gold-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-gold-400/40 p-1 flex items-center justify-center bg-dark-900 shadow-gold-glow shrink-0 overflow-hidden">
              <img src="/bnn-monogram.png" alt="BNB" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-cinzel text-base font-bold text-cream-50 uppercase tracking-wider">
                {step === 'shipping' && 'Luxury Express Checkout'}
                {step === 'upi_payment' && 'Instant UPI Payment QR'}
                {step === 'confirmed' && (createdOrder?.payment_method === 'COD' ? 'Cash on Delivery Confirmed' : 'VIP Order Confirmed')}
              </h3>
              <p className="text-[10px] text-gold-400 font-medium">BOSS N BUZZ ORIGINALS ATELIER</p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-cream-300 hover:text-gold-400 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="m-4 p-3 rounded-xl bg-red-900/40 border border-red-500/50 text-red-200 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* STEP 1: SHIPPING & PAYMENT SELECTION */}
        {step === 'shipping' && (
          <form onSubmit={handleInitiateOrder} className="p-6 space-y-4">
            
            {/* Order Summary Strip */}
            <div className="p-3 rounded-xl bg-dark-950 border border-dark-800 flex items-center justify-between text-xs">
              <span className="text-cream-300">{items.length} Perfume(s) in Bag</span>
              <span className="font-cinzel font-bold text-gold-300 text-sm">
                Total Payable: ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="e.g. Aryan Malhotra"
                  required
                  className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl px-3.5 py-2.5 text-xs text-cream-50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                  WhatsApp Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  required
                  className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl px-3.5 py-2.5 text-xs text-cream-50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                Email Address (For Invoice)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="aryan@gmail.com"
                className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl px-3.5 py-2.5 text-xs text-cream-50 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                Full Shipping Address *
              </label>
              <textarea
                name="shipping_address"
                value={formData.shipping_address}
                onChange={handleChange}
                rows={2}
                placeholder="House / Flat No, Street, Landmark"
                required
                className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl px-3.5 py-2.5 text-xs text-cream-50 focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Delhi / Bengaluru"
                  required
                  className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl px-3 py-2 text-xs text-cream-50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Karnataka"
                  required
                  className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl px-3 py-2 text-xs text-cream-50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="560001"
                  required
                  className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl px-3 py-2 text-xs text-cream-50 focus:outline-none"
                />
              </div>
            </div>

            {/* PAYMENT METHOD SELECTION */}
            <div className="pt-2 space-y-2">
              <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider">
                Select Payment Method *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Instant UPI Option */}
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  className={`cursor-pointer rounded-xl p-3.5 border transition-all relative flex flex-col justify-between ${
                    paymentMethod === 'UPI'
                      ? 'bg-gold-500/10 border-gold-400 shadow-gold-glow'
                      : 'bg-dark-950 border-dark-700/60 hover:border-dark-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-gold-500/20 text-gold-300">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <span className="font-cinzel text-xs font-bold text-cream-50">Instant UPI</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'UPI' ? 'border-gold-400 bg-gold-400' : 'border-dark-600'
                      }`}>
                        {paymentMethod === 'UPI' && <Check className="w-2.5 h-2.5 text-dark-950 font-bold" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-cream-300 leading-tight">
                      GPay, PhonePe, Paytm, QR Scan & Zero Fees
                    </p>
                  </div>
                  <span className="inline-block mt-2.5 text-[9px] uppercase tracking-wider font-semibold text-gold-400 bg-gold-500/15 border border-gold-500/30 px-2 py-0.5 rounded w-fit">
                    Fastest Dispatch
                  </span>
                </div>

                {/* Cash on Delivery (COD) Option */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`cursor-pointer rounded-xl p-3.5 border transition-all relative flex flex-col justify-between ${
                    paymentMethod === 'COD'
                      ? 'bg-gold-500/10 border-gold-400 shadow-gold-glow'
                      : 'bg-dark-950 border-dark-700/60 hover:border-dark-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-gold-500/20 text-gold-300">
                          <Banknote className="w-4 h-4" />
                        </div>
                        <span className="font-cinzel text-xs font-bold text-cream-50">Cash on Delivery</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'COD' ? 'border-gold-400 bg-gold-400' : 'border-dark-600'
                      }`}>
                        {paymentMethod === 'COD' && <Check className="w-2.5 h-2.5 text-dark-950 font-bold" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-cream-300 leading-tight">
                      Pay cash at your doorstep when parcel arrives
                    </p>
                  </div>
                  <span className="inline-block mt-2.5 text-[9px] uppercase tracking-wider font-semibold text-cream-200 bg-dark-800 border border-dark-700 px-2 py-0.5 rounded w-fit">
                    Pay at Doorstep
                  </span>
                </div>

              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 font-cinzel font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-gold-glow hover:scale-[1.01]"
              >
                {loading ? (
                  'Processing...'
                ) : paymentMethod === 'COD' ? (
                  <>
                    <Banknote className="w-4 h-4" />
                    <span>Place COD Order (₹{totalPrice.toLocaleString('en-IN')})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Proceed to UPI Payment (₹{totalPrice.toLocaleString('en-IN')})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: DYNAMIC UPI PAYMENT SCREEN */}
        {step === 'upi_payment' && createdOrder && (
          <div className="p-6 space-y-5">
            
            {/* Amount & Order Header */}
            <div className="text-center">
              <span className="text-[10px] text-cream-300 font-cinzel uppercase tracking-widest block">ORDER NO: {createdOrder.order_number}</span>
              <div className="mt-1 font-cinzel text-3xl font-black text-gold-300">
                ₹{Number(createdOrder.total_amount).toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-cream-200 block mt-0.5">Payable to: <strong>BOSS N BUZZ ORIGINALS</strong></span>
            </div>

            {/* UPI ID Copy Highlight Badge */}
            <div className="p-3.5 rounded-xl bg-dark-950 border border-gold-500/40 flex items-center justify-between gap-3 shadow-inner">
              <div className="overflow-hidden">
                <span className="text-[10px] text-gold-400 font-cinzel uppercase tracking-wider block font-bold">
                  Official Recipient UPI ID:
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-cream-50 tracking-wide select-all">
                  {targetUpiId}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="px-3.5 py-2 rounded-lg bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 text-xs font-cinzel font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-gold-glow transition-all active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-dark-950" /> : <Copy className="w-3.5 h-3.5 text-dark-950" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* High-Resolution QR Code Card */}
            <div className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-white text-dark-950 shadow-2xl max-w-[270px] mx-auto border-4 border-gold-400/80">
              <QRCodeSVG
                value={createdOrder.upi_intent_uri}
                size={195}
                level="H"
                includeMargin={true}
                imageSettings={{
                  src: '/bnn-monogram.png',
                  height: 38,
                  width: 38,
                  excavate: true,
                }}
              />
              <p className="text-[11px] font-bold text-dark-900 tracking-wider uppercase mt-2">
                Scan with any UPI App
              </p>
              <div className="flex items-center justify-center gap-2 mt-1 text-[9px] font-bold text-dark-700">
                <span>Google Pay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span> • <span>Cred</span>
              </div>
            </div>

            {/* Mobile One-Tap Pay Direct Link */}
            <div className="space-y-2">
              <a
                href={createdOrder.upi_intent_uri}
                className="w-full py-3.5 px-4 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow transition-all hover:scale-[1.01]"
              >
                <Smartphone className="w-4 h-4" />
                Mobile User? Click Here to Pay in UPI App
              </a>
              <p className="text-center text-[10px] text-cream-300">
                (PhonePe / Google Pay / Paytm automatic open ho jayega)
              </p>
            </div>

            {/* UTR Input Section */}
            <div className="p-4 rounded-xl bg-dark-950 border border-gold-500/40 space-y-3">
              <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-gold-300">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                Step 2: Payment ke baad mila 12-Digit UTR No. Dalein
              </div>
              <p className="text-[11px] text-cream-300 leading-relaxed font-light">
                Apne GPay / PhonePe / Paytm app ke receipt se <strong>12-digit UPI Transaction / UTR ID</strong> copy karke yahan confirm karein:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={upiUtr}
                  onChange={(e) => setUpiUtr(e.target.value)}
                  placeholder="e.g. 428172918291"
                  className="flex-1 bg-dark-900 border border-dark-700 focus:border-gold-400 rounded-xl px-3.5 py-2.5 text-xs text-cream-50 tracking-wider font-mono focus:outline-none"
                />
                <button
                  onClick={handleConfirmUpiPayment}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-gold-gradient text-dark-950 font-cinzel font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:scale-105 active:scale-95 transition-all"
                >
                  {loading ? 'Saving...' : 'Confirm'}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* STEP 3: ORDER CONFIRMED SCREEN */}
        {step === 'confirmed' && createdOrder && (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-gold-gradient text-dark-950 flex items-center justify-center mx-auto shadow-gold-glow animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs text-gold-400 font-cinzel uppercase tracking-[0.25em]">
                {createdOrder.payment_method === 'COD' ? 'Cash on Delivery Booked' : 'Payment Verification Underway'}
              </span>
              <h3 className="font-cinzel text-2xl font-bold text-cream-50 mt-1">
                {createdOrder.payment_method === 'COD' ? 'Order Booked Successfully!' : 'Order Placed Successfully!'}
              </h3>
              <p className="text-xs text-cream-300 mt-2 max-w-md mx-auto leading-relaxed">
                Dhanyawad, <strong className="text-cream-100">{formData.customer_name}</strong>! Aapka order{' '}
                <strong className="text-gold-300">{createdOrder.order_number}</strong> receive ho gaya hai.{' '}
                {createdOrder.payment_method === 'COD' ? (
                  <span>Delivery ke waqt courier partner ko cash payment ready rakhein. Hamari team dispatch se pehle confirm karegi.</span>
                ) : (
                  <span>Hamare atelier mein payment verification complete hote hi dispatch notification share hogi.</span>
                )}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-dark-950 border border-dark-800 text-xs space-y-2 text-left max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-cream-300">Order ID:</span>
                <span className="font-mono text-gold-300 font-bold">{createdOrder.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cream-300">Payment Mode:</span>
                <span className="font-semibold text-gold-400">
                  {createdOrder.payment_method === 'COD' ? 'Cash on Delivery (COD)' : 'Instant UPI Payment'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-cream-300">
                  {createdOrder.payment_method === 'COD' ? 'Pay on Delivery:' : 'Amount Paid:'}
                </span>
                <span className="font-bold text-cream-50">₹{Number(createdOrder.total_amount).toLocaleString('en-IN')}</span>
              </div>
              {createdOrder.payment_method !== 'COD' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-cream-300">Paid to UPI ID:</span>
                    <span className="font-mono text-cream-100">{targetUpiId}</span>
                  </div>
                  {upiUtr && (
                    <div className="flex justify-between">
                      <span className="text-cream-300">Submitted UTR:</span>
                      <span className="font-mono text-gold-400">{upiUtr}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleWhatsAppReceipt}
                className="py-3 px-6 rounded-xl bg-[#25D366] text-dark-950 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                {createdOrder.payment_method === 'COD' ? 'Confirm Order on WhatsApp' : 'Send Receipt on WhatsApp'}
              </button>

              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="py-3 px-6 rounded-xl border border-gold-400/40 text-cream-100 hover:text-gold-300 text-xs font-cinzel tracking-wider"
              >
                Return to Store
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

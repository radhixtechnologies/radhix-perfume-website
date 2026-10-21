import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock, MessageCircle, AlertCircle, Banknote, Smartphone } from 'lucide-react';
import { api } from '../../services/api';

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState('All');

  useEffect(() => {
    loadOrders();
  }, [paymentFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (paymentFilter === 'Cash on Delivery') {
        params.payment_method = 'COD';
      } else if (paymentFilter === 'Instant UPI') {
        params.payment_method = 'UPI';
      } else if (paymentFilter !== 'All') {
        params.payment_status = paymentFilter;
      }
      const res = await api.getAdminOrders(params);
      if (res?.data) setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async (id, status) => {
    try {
      await api.updateOrderStatus(id, { payment_status: status });
      loadOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await api.updateOrderStatus(id, { order_status: status });
      loadOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="font-cinzel text-2xl font-black text-cream-50 uppercase tracking-wider">
          Orders & Payment Verifications (UPI & COD)
        </h1>
        <p className="text-xs text-cream-300 mt-1">
          Review customer orders, verify UPI UTR transaction references or Cash on Delivery bookings, and manage dispatch fulfillment.
        </p>
      </div>

      {/* Filter */}
      <div className="luxury-glass p-4 rounded-xl border border-dark-800 flex flex-wrap gap-2">
        {['All', 'Cash on Delivery', 'Instant UPI', 'Pending Verification', 'Verified / Paid', 'Failed'].map((f) => (
          <button
            key={f}
            onClick={() => setPaymentFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-cinzel uppercase tracking-wider transition-all ${
              paymentFilter === f ? 'bg-gold-gradient text-dark-950 font-bold shadow-gold-glow' : 'text-cream-300 hover:text-gold-300 bg-dark-900/60'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="luxury-glass rounded-2xl overflow-hidden border border-dark-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-950 text-gold-400 font-cinzel uppercase tracking-wider border-b border-dark-800">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method & Ref</th>
                <th className="p-4">Payment Verification</th>
                <th className="p-4">Fulfillment</th>
                <th className="p-4 text-right">WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-cream-300 text-xs">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => {
                  const isCod = ord.payment_method === 'COD';
                  return (
                    <tr key={ord.id} className="hover:bg-dark-800/40 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-gold-300 font-bold">{ord.order_number}</span>
                        <div className="text-[10px] text-cream-300">{ord.created_at}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-cream-50">{ord.customer_name}</div>
                        <div className="text-[10px] text-cream-300">{ord.phone} • {ord.city}, {ord.state} ({ord.pincode})</div>
                        <div className="text-[10px] text-cream-300/80 line-clamp-1 max-w-[200px] mt-0.5" title={ord.shipping_address}>
                          {ord.shipping_address}
                        </div>
                      </td>
                      <td className="p-4 font-cinzel font-bold text-cream-50 text-sm whitespace-nowrap">
                        ₹{Number(ord.total_amount).toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        {isCod ? (
                          <span className="inline-flex items-center gap-1.5 font-cinzel text-[10px] uppercase font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-600/40">
                            <Banknote className="w-3.5 h-3.5" />
                            Cash on Delivery
                          </span>
                        ) : (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 font-cinzel text-[10px] uppercase font-bold text-gold-300 bg-gold-950/60 px-2 py-0.5 rounded border border-gold-600/30">
                              <Smartphone className="w-3 h-3" />
                              UPI
                            </span>
                            <div>
                              {ord.upi_utr ? (
                                <span className="font-mono text-gold-300 text-[10px] bg-dark-950 px-1.5 py-0.5 rounded border border-dark-700 block max-w-[120px] truncate" title={ord.upi_utr}>
                                  {ord.upi_utr}
                                </span>
                              ) : (
                                <span className="text-red-400 text-[10px] block font-medium">Pending UTR</span>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <select
                          value={ord.payment_status}
                          onChange={(e) => handleUpdatePaymentStatus(ord.id, e.target.value)}
                          className={`rounded-lg p-1.5 text-xs font-semibold focus:outline-none bg-dark-950 border ${
                            ord.payment_status === 'Verified / Paid'
                              ? 'border-green-500 text-green-400'
                              : 'border-amber-warm text-amber-warm'
                          }`}
                        >
                          <option value="Pending Verification">Pending Verification</option>
                          <option value="Verified / Paid">Verified / Paid</option>
                          <option value="Failed">Failed</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <select
                          value={ord.order_status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-dark-950 border border-dark-700 text-cream-100 rounded-lg p-1.5 text-xs focus:outline-none"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <a
                          href={`https://wa.me/${ord.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${ord.customer_name},\nUpdate regarding your Boss N Buzz Originals Atelier Order ${ord.order_number}:\n• Payment Method: ${ord.payment_method}\n• Status: ${ord.order_status}\n\nThank you for choosing Boss N Buzz!`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#25D366] text-dark-950 font-bold hover:scale-105 transition-all text-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Chat
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

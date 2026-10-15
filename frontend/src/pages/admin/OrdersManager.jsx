import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock, MessageCircle, AlertCircle } from 'lucide-react';
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
      if (paymentFilter !== 'All') params.payment_status = paymentFilter;
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
          Orders & UPI Verifications
        </h1>
        <p className="text-xs text-cream-300 mt-1">Review orders, match 12-digit UPI UTR numbers with your bank, and update dispatch status.</p>
      </div>

      {/* Filter */}
      <div className="luxury-glass p-4 rounded-xl border border-dark-800 flex gap-2">
        {['All', 'Pending Verification', 'Verified / Paid', 'Failed'].map((f) => (
          <button
            key={f}
            onClick={() => setPaymentFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-cinzel uppercase tracking-wider ${
              paymentFilter === f ? 'bg-gold-gradient text-dark-950 font-bold' : 'text-cream-300 hover:text-gold-300'
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
                <th className="p-4">UPI UTR Ref</th>
                <th className="p-4">Payment Verification</th>
                <th className="p-4">Fulfillment</th>
                <th className="p-4 text-right">WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-dark-800/40 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-gold-300 font-bold">{ord.order_number}</span>
                    <div className="text-[10px] text-cream-300">{ord.created_at}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-cream-50">{ord.customer_name}</div>
                    <div className="text-[10px] text-cream-300">{ord.phone} • {ord.city}, {ord.state}</div>
                  </td>
                  <td className="p-4 font-cinzel font-bold text-cream-50 text-sm">
                    ₹{Number(ord.total_amount).toLocaleString('en-IN')}
                  </td>
                  <td className="p-4">
                    {ord.upi_utr ? (
                      <span className="font-mono text-gold-300 bg-dark-950 px-2 py-1 rounded border border-dark-700">
                        {ord.upi_utr}
                      </span>
                    ) : (
                      <span className="text-red-400 text-[10px]">Pending UTR</span>
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
                      href={`https://wa.me/${ord.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(ord.customer_name)},%20update%20regarding%20your%20Boss%20N%20Buzz%20Originals%20Order%20${ord.order_number}:`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg border border-dark-700 hover:border-[#25D366] text-[#25D366] inline-block"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

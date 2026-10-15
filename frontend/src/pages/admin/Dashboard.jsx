import React, { useState, useEffect } from 'react';
import { Sparkles, Users, ShoppingBag, IndianRupee, Clock, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStats()
      .then((res) => {
        if (res?.data) setStats(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-gold-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-cream-50 uppercase tracking-wider">
          Atelier Overview
        </h1>
        <p className="text-xs text-cream-300 mt-1">Real-time performance metrics and recent customer activities.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="luxury-glass p-5 rounded-2xl border border-gold-500/20 space-y-2">
          <div className="flex items-center justify-between text-gold-400">
            <span className="text-[11px] font-cinzel font-bold uppercase tracking-wider">Total Sales</span>
            <IndianRupee className="w-4 h-4" />
          </div>
          <div className="font-cinzel text-2xl font-black text-cream-50">
            ₹{stats?.total_sales?.toLocaleString('en-IN') || 0}
          </div>
          <span className="text-[10px] text-cream-300">Verified UPI orders</span>
        </div>

        <div className="luxury-glass p-5 rounded-2xl border border-gold-500/20 space-y-2">
          <div className="flex items-center justify-between text-gold-400">
            <span className="text-[11px] font-cinzel font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="font-cinzel text-2xl font-black text-cream-50">
            {stats?.total_orders || 0}
          </div>
          <span className="text-[10px] text-amber-warm font-semibold">
            {stats?.pending_upi_verification || 0} Pending Verification
          </span>
        </div>

        <div className="luxury-glass p-5 rounded-2xl border border-gold-500/20 space-y-2">
          <div className="flex items-center justify-between text-gold-400">
            <span className="text-[11px] font-cinzel font-bold uppercase tracking-wider">VIP Leads</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="font-cinzel text-2xl font-black text-cream-50">
            {stats?.total_leads || 0}
          </div>
          <span className="text-[10px] text-green-400 font-semibold">
            +{stats?.today_leads || 0} New Today
          </span>
        </div>

        <div className="luxury-glass p-5 rounded-2xl border border-gold-500/20 space-y-2">
          <div className="flex items-center justify-between text-gold-400">
            <span className="text-[11px] font-cinzel font-bold uppercase tracking-wider">Active Fragrances</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="font-cinzel text-2xl font-black text-cream-50">
            {stats?.total_products || 0}
          </div>
          <span className="text-[10px] text-cream-300">Extrait de Parfum</span>
        </div>

      </div>

      {/* Two Columns: Recent Orders & Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Orders */}
        <div className="luxury-glass rounded-2xl p-6 border border-dark-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-cinzel text-sm font-bold text-cream-50 uppercase tracking-wider">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-gold-400 hover:text-gold-300 font-cinzel">View All →</Link>
          </div>

          {stats?.recent_orders?.length === 0 ? (
            <p className="text-xs text-cream-300 py-4">No orders placed yet.</p>
          ) : (
            <div className="space-y-3">
              {stats?.recent_orders?.map((ord) => (
                <div key={ord.id} className="p-3 bg-dark-950 rounded-xl border border-dark-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-gold-300 font-bold">{ord.order_number}</span>
                    <p className="text-cream-200">{ord.customer_name} • {ord.phone}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-cinzel font-bold text-cream-50">₹{Number(ord.total_amount).toLocaleString('en-IN')}</span>
                    <span className={`block text-[10px] font-semibold ${
                      ord.payment_status === 'Verified / Paid' ? 'text-green-400' : 'text-amber-warm'
                    }`}>
                      {ord.payment_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Leads */}
        <div className="luxury-glass rounded-2xl p-6 border border-dark-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-cinzel text-sm font-bold text-cream-50 uppercase tracking-wider">Recent Leads</h3>
            <Link to="/admin/leads" className="text-xs text-gold-400 hover:text-gold-300 font-cinzel">View All →</Link>
          </div>

          {stats?.recent_leads?.length === 0 ? (
            <p className="text-xs text-cream-300 py-4">No inquiries received yet.</p>
          ) : (
            <div className="space-y-3">
              {stats?.recent_leads?.map((lead) => (
                <div key={lead.id} className="p-3 bg-dark-950 rounded-xl border border-dark-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-cream-50">{lead.name}</span>
                    <p className="text-cream-300">{lead.product_name || 'General Inquiry'}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-gold-300">{lead.phone}</span>
                    <span className="block text-[10px] text-cream-300">{lead.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

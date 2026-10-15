import React, { useState, useEffect } from 'react';
import { Download, Search, Phone, MessageCircle, Trash2 } from 'lucide-react';
import { api } from '../../services/api';

export default function LeadsManager() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadLeads();
  }, [statusFilter]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search) params.search = search;
      const res = await api.getAdminLeads(params);
      if (res?.data) setLeads(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateLeadStatus(id, { status: newStatus });
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this inquiry?')) {
      try {
        await api.deleteLead(id);
        loadLeads();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleExportCsv = () => {
    window.open('http://127.0.0.1:8000/api/admin/leads/export', '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-2xl font-black text-cream-50 uppercase tracking-wider">
            VIP Leads & Enquiries
          </h1>
          <p className="text-xs text-cream-300 mt-1">Manage consultation inquiries, customer contacts, and exports.</p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 rounded-xl border border-gold-400/40 text-gold-300 hover:bg-gold-500/10 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Leads CSV
        </button>
      </div>

      {/* Filter Row */}
      <div className="luxury-glass p-4 rounded-xl border border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-2">
          {['All', 'New', 'Contacted', 'Converted', 'Closed'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-cinzel uppercase tracking-wider ${
                statusFilter === s ? 'bg-gold-gradient text-dark-950 font-bold' : 'text-cream-300 hover:text-gold-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-cream-300 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadLeads()}
            placeholder="Search phone, name..."
            className="w-full bg-dark-950 border border-dark-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-cream-50 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="luxury-glass rounded-2xl overflow-hidden border border-dark-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-950 text-gold-400 font-cinzel uppercase tracking-wider border-b border-dark-800">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Product of Interest</th>
                <th className="p-4">Message</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-dark-800/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-cream-50">{lead.name}</div>
                    {lead.email && <div className="text-[10px] text-cream-300">{lead.email}</div>}
                  </td>
                  <td className="p-4 font-mono text-gold-300">{lead.phone}</td>
                  <td className="p-4 text-cream-200">{lead.product_name || 'VIP Consultation'}</td>
                  <td className="p-4 max-w-xs truncate text-cream-300" title={lead.message}>
                    {lead.message || '—'}
                  </td>
                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className="bg-dark-950 border border-dark-700 text-cream-100 rounded-lg p-1.5 text-xs focus:outline-none"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Converted">Converted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <a
                      href={`tel:${lead.phone}`}
                      title="Call Customer"
                      className="inline-block p-1.5 rounded-lg border border-dark-700 hover:border-gold-400 text-gold-300"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20reaching%20out%20to%20Boss%20N%20Buzz%20Originals.`}
                      target="_blank"
                      rel="noreferrer"
                      title="WhatsApp Customer"
                      className="inline-block p-1.5 rounded-lg border border-dark-700 hover:border-[#25D366] text-[#25D366]"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="p-1.5 rounded-lg border border-dark-700 hover:border-red-400 text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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

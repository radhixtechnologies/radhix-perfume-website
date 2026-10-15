import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Sparkles, ShoppingBag, Users, Settings, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { admin, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products Catalog', path: '/admin/products', icon: Sparkles },
    { name: 'Orders & Payments', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Leads & Enquiries', path: '/admin/leads', icon: Users },
    { name: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-cream-100 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-dark-900 border-r border-gold-500/20 p-5 flex flex-col shrink-0">
        
        {/* Brand */}
        <div className="flex items-center gap-3 pb-6 border-b border-dark-800">
          <div className="w-10 h-10 rounded-full border border-gold-400 p-1 bg-dark-950 flex items-center justify-center shadow-gold-glow">
            <span className="font-cinzel text-gold-400 font-black text-sm">BNB</span>
          </div>
          <div>
            <h2 className="font-cinzel text-sm font-bold text-cream-50 uppercase tracking-widest">
              ATELIER ADMIN
            </h2>
            <p className="text-[10px] text-gold-400 font-medium">Boss N Buzz Originals</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-cinzel tracking-wider uppercase transition-all ${
                  active
                    ? 'bg-gold-gradient text-dark-950 font-bold shadow-gold-glow'
                    : 'text-cream-200 hover:bg-dark-800 hover:text-gold-300'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Actions */}
        <div className="pt-6 border-t border-dark-800 space-y-3">
          <div className="text-xs">
            <span className="text-[10px] text-cream-300 uppercase tracking-widest block">Logged In As</span>
            <span className="font-bold text-cream-50">{admin?.name || 'Administrator'}</span>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between text-xs text-cream-300 hover:text-gold-400 py-1"
            >
              <span>View Public Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 py-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}

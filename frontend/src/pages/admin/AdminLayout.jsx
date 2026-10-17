import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Store,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Mobile drawer open state
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Desktop sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const currentRoute = navItems.find((item) => item.path === location.pathname) || {
    name: 'Atelier Console',
  };

  return (
    <div className="min-h-screen bg-dark-950 text-cream-100 flex flex-col md:flex-row relative selection:bg-[#D4AF37] selection:text-[#050505]">
      
      {/* ======================================================== */}
      {/* 1. MOBILE BACKDROP & SLIDE-OUT DRAWER (< md) */}
      {/* ======================================================== */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark-950/80 backdrop-blur-md md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-dark-900 border-r border-gold-500/30 p-5 flex flex-col justify-between shadow-2xl md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-dark-800">
            <Link
              to="/"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-full border border-gold-400/60 p-1 bg-dark-950 flex items-center justify-center shadow-gold-glow shrink-0">
                <img
                  src="/bnn-monogram.png"
                  alt="BNB"
                  className="w-full h-full object-contain filter drop-shadow-[0_1px_4px_rgba(212,175,55,0.5)]"
                />
              </div>
              <div>
                <h2 className="font-cinzel text-xs font-black text-cream-50 uppercase tracking-[0.18em]">
                  ATELIER ADMIN
                </h2>
                <p className="text-[9px] text-gold-400 uppercase tracking-widest font-semibold">
                  Boss N Buzz Originals
                </p>
              </div>
            </Link>

            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-xl bg-dark-950 border border-gold-500/20 text-cream-300 hover:text-gold-400 transition-colors"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-cinzel tracking-wider uppercase transition-all ${
                    active
                      ? 'bg-gold-gradient text-dark-950 font-bold shadow-gold-glow'
                      : 'text-cream-200 hover:bg-dark-800 hover:text-gold-300'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{item.name}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Drawer Footer */}
        <div className="pt-4 border-t border-dark-800 space-y-3">
          <div className="text-xs bg-dark-950/80 p-3 rounded-xl border border-dark-800">
            <span className="text-[9px] text-cream-300 uppercase tracking-widest block font-cinzel">Logged In Admin</span>
            <span className="font-bold text-cream-50 text-xs truncate block">{admin?.name || 'Administrator'}</span>
            <span className="text-[9px] text-green-400 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live Session Active
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-dark-950 border border-gold-500/20 text-xs font-cinzel text-gold-300 hover:text-gold-200"
            >
              <span className="flex items-center gap-2">
                <Store className="w-3.5 h-3.5 text-gold-400" />
                View Public Store
              </span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-xs font-cinzel text-red-300 hover:bg-red-900/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. DESKTOP SIDEBAR (>= md) */}
      {/* ======================================================== */}
      <aside
        className={`hidden md:flex flex-col justify-between shrink-0 bg-dark-900 border-r border-gold-500/20 p-4 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="pb-5 border-b border-dark-800 flex items-center justify-between">
            <Link
              to="/"
              className={`flex items-center gap-3 group overflow-hidden ${
                isCollapsed ? 'justify-center w-full' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full border border-gold-400/60 p-1 bg-dark-950 flex items-center justify-center shadow-gold-glow shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src="/bnn-monogram.png"
                  alt="BNB"
                  className="w-full h-full object-contain filter drop-shadow-[0_1px_4px_rgba(212,175,55,0.5)]"
                />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col whitespace-nowrap overflow-hidden">
                  <h2 className="font-cinzel text-xs font-black text-cream-50 uppercase tracking-[0.18em] group-hover:text-gold-300 transition-colors">
                    ATELIER ADMIN
                  </h2>
                  <p className="text-[9px] text-gold-400 uppercase tracking-widest font-semibold truncate">
                    Boss N Buzz
                  </p>
                </div>
              )}
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="py-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  title={isCollapsed ? item.name : undefined}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-cinzel tracking-wider uppercase transition-all ${
                    isCollapsed ? 'justify-center px-2' : ''
                  } ${
                    active
                      ? 'bg-gold-gradient text-dark-950 font-bold shadow-gold-glow'
                      : 'text-cream-200 hover:bg-dark-800 hover:text-gold-300'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop Sidebar Footer */}
        <div className="pt-4 border-t border-dark-800 space-y-3">
          {!isCollapsed ? (
            <>
              <div className="text-xs px-1">
                <span className="text-[9px] text-cream-300 uppercase tracking-widest block font-cinzel">Logged In</span>
                <span className="font-bold text-cream-50 truncate block">{admin?.name || 'Administrator'}</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between text-xs text-cream-300 hover:text-gold-400 py-1 px-1 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5" />
                    Public Store
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 py-1 px-1 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-1">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                title="View Public Store"
                className="p-2 rounded-lg text-cream-300 hover:text-gold-400 hover:bg-dark-800 transition-colors"
              >
                <Store className="w-4 h-4" />
              </a>

              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 3. MAIN WORKSPACE WITH TOP TOGGLE BAR */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Sticky Luxury Topbar */}
        <header className="sticky top-0 z-30 bg-dark-950/90 backdrop-blur-md border-b border-gold-500/20 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 shadow-xl">

          {/* Left: Mobile Toggle / Desktop Collapse Toggle & Breadcrumb */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Mobile Toggle Button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-xl bg-dark-900 border border-gold-500/30 text-gold-400 hover:text-gold-300 hover:border-gold-400 shadow-gold-glow transition-all active:scale-95 flex items-center gap-1.5"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
              <span className="text-[10px] font-cinzel font-bold tracking-wider uppercase pr-1">Menu</span>
            </button>

            {/* Desktop Collapse / Expand Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-2 rounded-xl bg-dark-900 hover:bg-dark-800 border border-gold-500/25 text-gold-400 hover:text-gold-300 transition-all shadow-sm active:scale-95 items-center gap-2"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label="Toggle Sidebar"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-gold-400" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-gold-400" />
              )}
              <span className="text-[10px] font-cinzel font-bold uppercase tracking-wider hidden lg:inline">
                {isCollapsed ? 'Expand' : 'Collapse'}
              </span>
            </button>

            {/* Breadcrumb / Current View Name */}
            <div className="flex flex-col">
              <span className="text-[9px] text-gold-400 uppercase font-cinzel tracking-[0.2em] font-semibold hidden sm:block">
                ATELIER CONSOLE
              </span>
              <h1 className="text-xs sm:text-sm font-cinzel font-bold text-cream-50 uppercase tracking-wider">
                {currentRoute.name}
              </h1>
            </div>
          </div>

          {/* Right: Quick Store View & Admin Profile Pill */}
          <div className="flex items-center gap-3">

            {/* Public Store Pill */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-900 border border-gold-500/30 text-gold-300 hover:text-dark-950 hover:bg-gold-gradient text-xs font-cinzel font-semibold uppercase tracking-wider transition-all shadow-sm"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Public Store</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            {/* Admin Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-dark-800">
              <div className="w-8 h-8 rounded-full bg-gold-gradient text-dark-950 font-cinzel font-black flex items-center justify-center text-xs shadow-gold-glow shrink-0">
                {admin?.name ? admin.name[0].toUpperCase() : 'A'}
              </div>

              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-cream-100 leading-tight">
                  {admin?.name || 'Administrator'}
                </span>
                <span className="flex items-center gap-1 text-[9px] text-green-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Live Session
                </span>
              </div>

              <button
                onClick={handleLogout}
                title="Sign Out of Atelier Admin"
                className="p-1.5 rounded-lg text-cream-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                aria-label="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

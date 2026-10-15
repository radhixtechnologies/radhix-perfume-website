import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid atelier credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Background */}
      <div className="absolute w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-dark-900 border border-gold-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-cream-100">
        
        {/* Monogram Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full border-2 border-gold-400 p-1 mx-auto flex items-center justify-center bg-dark-950 shadow-gold-glow mb-4">
            <span className="font-cinzel text-gold-400 font-extrabold text-xl tracking-widest">BNB</span>
          </div>
          <h1 className="font-cinzel text-xl font-bold text-cream-50 uppercase tracking-widest">
            Atelier Staff Portal
          </h1>
          <p className="text-[11px] text-gold-400 tracking-wider uppercase mt-1">
            Boss N Buzz Originals Management
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-900/40 border border-red-500/50 text-red-200 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-cream-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-cream-50 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
              Secret Key / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-cream-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-950 border border-dark-700 focus:border-gold-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-cream-50 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-cream-300 mt-1">Default: admin / admin123</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 font-cinzel font-bold text-xs uppercase tracking-[0.2em] shadow-gold-glow flex items-center justify-center gap-2 mt-6 transition-all hover:scale-[1.01]"
          >
            {loading ? 'Authenticating...' : 'Access Atelier Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-dark-800 text-center">
          <a href="/" className="text-[11px] text-gold-400 hover:text-gold-300 font-cinzel uppercase tracking-widest">
            ← Return to Public Website
          </a>
        </div>

      </div>
    </div>
  );
}

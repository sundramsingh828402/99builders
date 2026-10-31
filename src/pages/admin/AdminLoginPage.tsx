import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAdminAuth();
  const { navigate } = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password reset modal simulation
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('admin');
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickFill = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError('');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.includes('@')) return;
    setResetSent(true);
    setTimeout(() => {
      setShowResetModal(false);
      setResetSent(false);
      setResetEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#12161A] text-white flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Back to Site Button */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center text-xs text-gray-400">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-1.5 hover:text-[#C5A880] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Portal</span>
        </button>
        <span className="font-mono text-[10px] text-gray-500">ISO 14001:2015 AUTH</span>
      </div>

      <div className="w-full max-w-md bg-[#1A202C] rounded-lg border border-[#2D3748] shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-white/5 rounded-full mb-1">
            <ShieldCheck className="w-8 h-8 text-[#C5A880]" />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-wide text-white">
            Administrative Portal
          </h1>
          <p className="text-xs text-gray-400">
            Authorized Executive & Content Governance Suite for 99 Builders
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@99builders.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#12161A] border border-[#4A5568] text-white rounded-sm focus:outline-hidden focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-[11px] text-[#C5A880] hover:underline"
              >
                Reset Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#12161A] border border-[#4A5568] text-white rounded-sm focus:outline-hidden focus:border-[#C5A880]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-[#12161A] bg-[#C5A880] hover:bg-[#D4BC98] transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Role Quick-Fill Helpers for testing */}
        <div className="pt-4 border-t border-[#2D3748] space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Quick-Login Role Selector:
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@99builders.com', 'Admin@99Builders2026!')}
              className="p-2 bg-[#12161A] border border-[#2D3748] hover:border-[#C5A880] rounded-xs text-left"
            >
              <div className="font-bold text-[#C5A880]">Super Admin</div>
              <div className="text-[9px] text-gray-400 truncate">All privileges</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('editor@99builders.com', 'Editor@99Builders2026!')}
              className="p-2 bg-[#12161A] border border-[#2D3748] hover:border-[#C5A880] rounded-xs text-left"
            >
              <div className="font-bold text-white">Editor</div>
              <div className="text-[9px] text-gray-400 truncate">Projects & news</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('leads@99builders.com', 'Leads@99Builders2026!')}
              className="p-2 bg-[#12161A] border border-[#2D3748] hover:border-[#C5A880] rounded-xs text-left"
            >
              <div className="font-bold text-white">Lead Mgr</div>
              <div className="text-[9px] text-gray-400 truncate">Leads & visits</div>
            </button>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#1A202C] rounded-lg border border-[#2D3748] p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#C5A880]">
              <KeyRound className="w-5 h-5" />
              <h3 className="font-heading text-base font-bold text-white">Admin Password Reset</h3>
            </div>
            {resetSent ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-700 rounded-sm text-center space-y-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <p>Password reset instructions dispatched to your verified administrator mailbox.</p>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-3">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Enter your registered administrator email to receive a secure single-use recovery token.
                </p>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="admin@99builders.com"
                  className="w-full px-3 py-2 text-xs bg-[#12161A] border border-[#4A5568] text-white rounded-sm focus:outline-hidden focus:border-[#C5A880]"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="px-3 py-1.5 text-xs text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#12161A] bg-[#C5A880] rounded-sm"
                  >
                    Send Token
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

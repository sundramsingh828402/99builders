import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Image as ImageIcon,
  Settings,
  History,
  LogOut,
  ExternalLink,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  X,
  Menu,
} from 'lucide-react';

import { AdminDashboardHome } from './AdminDashboardHome';
import { AdminProjectsManager } from './AdminProjectsManager';
import { AdminLeadsManager } from './AdminLeadsManager';
import { AdminArticlesManager } from './AdminArticlesManager';
import { AdminMediaManager } from './AdminMediaManager';
import { AdminSettingsManager } from './AdminSettingsManager';
import { AdminAuditLogs } from './AdminAuditLogs';

export const AdminLayout: React.FC = () => {
  const { adminUser, logout, changePassword } = useAdminAuth();
  const { navigate } = useNavigation();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Change Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('home');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    if (!currentPass || !newPass || newPass.length < 8) {
      setPassError('New password must be at least 8 characters long.');
      return;
    }
    const res = await changePassword(currentPass, newPass);
    if (res.success) {
      setPassSuccess(true);
      setTimeout(() => {
        setShowPasswordModal(false);
        setPassSuccess(false);
        setCurrentPass('');
        setNewPass('');
      }, 2000);
    } else {
      setPassError(res.error || 'Failed to update password');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, roles: ['super_admin', 'editor', 'lead_manager'] },
    { id: 'projects', label: 'Projects & Properties', icon: Building2, roles: ['super_admin', 'editor'] },
    { id: 'leads', label: 'Enquiries & Site Visits', icon: Users, roles: ['super_admin', 'lead_manager'] },
    { id: 'articles', label: 'News, Press & Blog', icon: FileText, roles: ['super_admin', 'editor'] },
    { id: 'media', label: 'Media Library & Uploads', icon: ImageIcon, roles: ['super_admin', 'editor'] },
    { id: 'settings', label: 'Site Settings & Integrations', icon: Settings, roles: ['super_admin'] },
    { id: 'audit', label: 'Audit Trail Logs', icon: History, roles: ['super_admin'] },
  ];

  const filteredNavItems = navItems.filter((item) => item.roles.includes(adminUser?.role || ''));

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 bg-[#12161A] text-white flex-col justify-between border-r border-[#232B32] shrink-0 min-h-screen">
        <div className="p-6 space-y-6">
          {/* Brand header */}
          <div className="flex items-center gap-3 pb-4 border-b border-[#232B32]">
            <img src="/assets/aistudio/99logo_64777909.png" alt="99 Builders Logo" className="h-9 w-auto" />
            <div>
              <div className="font-heading text-sm font-bold tracking-wider text-white">99 BUILDERS</div>
              <div className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">Admin Suite</div>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="p-3 bg-[#1A202C] rounded-sm border border-[#2D3748] space-y-1 text-xs">
            <div className="font-semibold text-white truncate">{adminUser?.name}</div>
            <div className="text-[10px] text-gray-400 truncate">{adminUser?.email}</div>
            <div className="pt-1">
              <span className="inline-block px-2 py-0.5 rounded-xs text-[9px] uppercase font-mono font-bold bg-[#C5A880]/20 text-[#C5A880]">
                {adminUser?.role.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-sm text-xs font-medium transition-colors flex items-center gap-2.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#C5A880] text-[#12161A] font-semibold shadow-xs'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-6 border-t border-[#232B32] space-y-2 text-xs">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full text-left py-2 px-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Change Password</span>
          </button>
          <button
            onClick={() => navigate('home')}
            className="w-full text-left py-2 px-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 px-2 text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#12161A] text-white p-4 flex items-center justify-between border-b border-[#232B32]">
        <div className="flex items-center gap-2">
          <img src="/assets/aistudio/99logo_64777909.png" alt="99 Builders Logo" className="h-7 w-auto" />
          <span className="font-heading text-sm font-bold">99 BUILDERS ADMIN</span>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-1.5 text-gray-300 hover:text-white"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileSidebarOpen && (
        <div className="md:hidden bg-[#12161A] text-white p-4 space-y-4 border-b border-[#232B32]">
          <div className="space-y-1">
            {filteredNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full text-left p-2 rounded-sm text-xs font-medium ${
                  activeTab === item.id ? 'bg-[#C5A880] text-[#12161A] font-bold' : 'text-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-[#232B32] flex justify-between text-xs">
            <button onClick={() => navigate('home')} className="text-gray-400 hover:text-white">
              Public Portal
            </button>
            <button onClick={handleLogout} className="text-red-400">
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Admin Content Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && <AdminDashboardHome onNavigateTab={setActiveTab} />}
        {activeTab === 'projects' && <AdminProjectsManager />}
        {activeTab === 'leads' && <AdminLeadsManager />}
        {activeTab === 'articles' && <AdminArticlesManager />}
        {activeTab === 'media' && <AdminMediaManager />}
        {activeTab === 'settings' && <AdminSettingsManager />}
        {activeTab === 'audit' && <AdminAuditLogs />}
      </main>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-2xl border border-[#ECE8E1] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECE8E1] pb-3">
              <h3 className="font-heading text-base font-bold text-[#12161A]">Update Administrator Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="p-1 text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            {passSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-sm text-center text-xs space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-semibold">Password Updated</p>
                <p>Your new password has been stored securely.</p>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
                {passError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-sm">
                    {passError}
                  </div>
                )}
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">New Password (min 8 chars)</label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#12161A] text-white rounded-sm font-semibold uppercase tracking-wider"
                  >
                    Save Password
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

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { api } from '../../services/api';
import { Save, CheckCircle2, Phone, MessageSquare, MapPin, Globe, Mail } from 'lucide-react';

export const AdminSettingsManager: React.FC = () => {
  const { token, adminUser } = useAdminAuth();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api
      .getAdminSettings(token)
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  const handleChange = (key: string, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      await api.saveAdminSettings(token, settings);
      setFeedback('Settings updated successfully in database.');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-heading text-xl font-bold text-[#12161A]">Site Settings & Integrations</h2>
        <p className="text-xs text-gray-500">
          Manage corporate phone, WhatsApp direct dispatch, Google Maps location, and SEO metadata.
        </p>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg border border-[#ECE8E1] shadow-xs space-y-6 text-xs">
        {/* Section 1: Integrations (WhatsApp, Click-to-call, Google Maps) */}
        <div className="space-y-4">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#12161A] border-b border-[#ECE8E1] pb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#94713A]" />
            <span>Integrations: WhatsApp, Phone & Google Maps</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                WhatsApp Contact Number (with country code)
              </label>
              <input
                type="text"
                value={settings.whatsapp_number || ''}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                placeholder="+918049999900"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                WhatsApp Default Message
              </label>
              <input
                type="text"
                value={settings.whatsapp_message || ''}
                onChange={(e) => handleChange('whatsapp_message', e.target.value)}
                placeholder="Hello 99 Builders, I wish to schedule an inspection..."
                className="w-full px-3 py-2 border border-gray-300 rounded-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Click-to-Call Phone Number</label>
              <input
                type="text"
                value={settings.company_phone || ''}
                onChange={(e) => handleChange('company_phone', e.target.value)}
                placeholder="+91 (080) 4999-9900"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Google Maps Direct URL</label>
              <input
                type="text"
                value={settings.google_maps_url || ''}
                onChange={(e) => handleChange('google_maps_url', e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-3 py-2 border border-gray-300 rounded-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Corporate Contact & Office */}
        <div className="space-y-4 pt-4">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#12161A] border-b border-[#ECE8E1] pb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#94713A]" />
            <span>Corporate Communications & Office Addresses</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">General Inquiries Email</label>
              <input
                type="email"
                value={settings.company_email || ''}
                onChange={(e) => handleChange('company_email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Sales Desk Email</label>
              <input
                type="email"
                value={settings.sales_email || ''}
                onChange={(e) => handleChange('sales_email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Headquarters Physical Address</label>
            <input
              type="text"
              value={settings.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm"
            />
          </div>
        </div>

        {/* Section 3: SEO Metadata */}
        <div className="space-y-4 pt-4">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#12161A] border-b border-[#ECE8E1] pb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#94713A]" />
            <span>Global SEO & Metadata</span>
          </h3>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Portal Title Tag</label>
            <input
              type="text"
              value={settings.site_title_seo || ''}
              onChange={(e) => handleChange('site_title_seo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Meta Description (Search Snippet)</label>
            <textarea
              rows={2}
              value={settings.meta_description_seo || ''}
              onChange={(e) => handleChange('meta_description_seo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm"
            />
          </div>
        </div>

        {adminUser?.role === 'super_admin' && (
          <div className="pt-4 border-t border-[#ECE8E1] flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#12161A] text-white rounded-sm font-semibold uppercase tracking-wider hover:bg-[#232B32] transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{saving ? 'Saving...' : 'Save Settings to Database'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

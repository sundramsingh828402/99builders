import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { COMPANY_INFO, PROJECTS } from '../data/mockData';
import { MapPin, Phone, Mail, Clock, ShieldCheck, CheckCircle2, Send, Building, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Residential Advisory',
    projectInterest: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please provide your name, valid email address, and telephone number.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await api.submitEnquiry({
        form_type: 'contact_page',
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        project_id: formData.projectInterest || undefined,
        subject: `Contact Request: ${formData.department}`,
        message: formData.message,
        meta: {
          department: formData.department,
        },
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Unable to transmit message. Please try again or call our hotline.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      {/* Header */}
      <section className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
          <span>Institutional Client Desk</span>
          <span aria-hidden="true">·</span>
          <span>Global Relationship Managers</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
          Contact & Experience Centers
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Connect directly with our senior relationship directors, architectural consultants, and corporate leasing
          executives.
        </p>
      </section>

      {/* 2-Column Contact Info & Interactive Form */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Office Details */}
        <div className="lg:col-span-5 space-y-8">
          {/* Main Corporate Headquarters */}
          <div className="p-6 bg-white rounded-lg border border-[#ECE8E1] space-y-4">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-[#94713A]" />
              <h3 className="font-heading text-lg font-bold text-[#12161A]">Corporate Headquarters</h3>
            </div>
            <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#94713A] shrink-0 mt-0.5" />
                <span>
                  {COMPANY_INFO.headquarters.address}, {COMPANY_INFO.headquarters.city} - {COMPANY_INFO.headquarters.pin}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#94713A] shrink-0" />
                <span className="font-mono tabular-nums">{COMPANY_INFO.headquarters.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#94713A] shrink-0" />
                <span>{COMPANY_INFO.headquarters.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#94713A] shrink-0" />
                <span>Monday – Saturday: 9:00 AM – 7:30 PM (Sunday by Appointment)</span>
              </div>
            </div>
          </div>

          {/* Regional Experience Galleries */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#12161A]">
              Regional Sales Experience Centers
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#F9F8F6] rounded-sm border border-[#ECE8E1] space-y-1">
                <strong className="text-[#12161A] block">Skyline Promenade Gallery</strong>
                <p className="text-gray-500">Aurora Sky Residences Site Pavilion</p>
                <div className="font-mono text-[11px] text-[#94713A] pt-1">+91 (080) 4999-9911</div>
              </div>

              <div className="p-4 bg-[#F9F8F6] rounded-sm border border-[#ECE8E1] space-y-1">
                <strong className="text-[#12161A] block">Tech Corridor Campus Desk</strong>
                <p className="text-gray-500">Meridian Nexus Atrium Floor 1</p>
                <div className="font-mono text-[11px] text-[#94713A] pt-1">+91 (080) 4999-9922</div>
              </div>
            </div>
          </div>

          {/* ISO Trust Seal */}
          <div className="p-5 bg-[#12161A] text-white rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C5A880] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Group Quality</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              All client communications and financial transaction processing adhere to audited ISO 14001:2015 governance
              and statutory Real Estate Regulatory Authority mandates.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-lg border border-[#ECE8E1] shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#12161A]">Communication Received</h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Your communication has been dispatched to our{' '}
                <strong>{formData.department}</strong> division. A relationship executive will contact you at{' '}
                <span className="font-mono">{formData.phone}</span> within 2 hours.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] rounded-sm cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-heading text-xl font-bold text-[#12161A]">Direct Inquiry Form</h3>
              <p className="text-xs text-gray-500">
                Please complete the form below and specify your area of interest.
              </p>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-xs text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="eleanor@example.com"
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-sm bg-white focus:outline-hidden focus:border-[#94713A]"
                  >
                    <option value="Residential Advisory">Residential Sales & Penthouses</option>
                    <option value="Commercial Leasing">Commercial Grade-A Leasing</option>
                    <option value="EPC Contracting">Turnkey EPC General Contracting</option>
                    <option value="NRI Desk">NRI & International Buyer Desk</option>
                    <option value="Corporate Media">Media & Press Relations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Project of Interest</label>
                  <select
                    value={formData.projectInterest}
                    onChange={(e) => setFormData({ ...formData, projectInterest: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-sm bg-white focus:outline-hidden focus:border-[#94713A]"
                  >
                    <option value="">General Corporate / Unspecified</option>
                    {PROJECTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share any specific requirements, desired floor level, or site visit timeline..."
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#94713A]" />
                  <span>Strict Confidentiality Guaranteed</span>
                </div>
                <button
                  type="submit"
                  className="px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Message</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { PROJECTS } from '../data/mockData';
import { X, CheckCircle2, ShieldCheck, Send, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export const EnquiryModal: React.FC = () => {
  const { isEnquiryModalOpen, closeEnquiryModal, enquirySubject, currentProjectId } = useNavigation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectId: currentProjectId || PROJECTS[0]?.id || '',
    subject: enquirySubject || 'Property Acquisition Enquiry',
    message: '',
    budget: 'Any Range',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isEnquiryModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please provide your name, valid email address, and phone number.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      await api.submitEnquiry({
        form_type: 'modal_enquiry',
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        project_id: formData.projectId || undefined,
        subject: formData.subject || 'Property Acquisition Enquiry',
        message: formData.message,
        meta: {
          budget: formData.budget,
          submitted_at: new Date().toISOString(),
        },
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Unable to register enquiry. Please verify details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    closeEnquiryModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl border border-[#ECE8E1] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#ECE8E1] flex items-center justify-between bg-[#FBF9F6]">
          <div>
            <h3 className="font-heading text-lg font-bold text-[#12161A]">
              Connect with Senior Sales Advisory
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Direct access to 99 Builders relationship directors & engineering consultants
            </p>
          </div>
          <button
            onClick={closeEnquiryModal}
            className="p-1.5 text-gray-400 hover:text-black rounded-md"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-heading text-xl font-bold text-[#12161A]">
                Enquiry Registered Successfully
              </h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Your enquiry regarding{' '}
                <strong>
                  {PROJECTS.find((p) => p.id === formData.projectId)?.title || formData.subject}
                </strong>{' '}
                has been logged. A senior client director will contact you at{' '}
                <span className="font-mono">{formData.phone}</span> within 2 business hours.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-xs text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. David Vance"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="david@example.com"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Mobile / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Project of Interest
                  </label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A] bg-white"
                  >
                    <option value="">General Corporate / Services</option>
                    {PROJECTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Enquiry Type
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A] bg-white"
                  >
                    <option value="Property Purchase">Property Purchase / Booking</option>
                    <option value="Commercial Leasing">Commercial Corporate Lease</option>
                    <option value="Construction EPC Contract">Construction / EPC Contract</option>
                    <option value="NRI Advisory">NRI Investment Consultation</option>
                    <option value="General Query">General Query</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Message / Special Requirements
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share any preferences regarding configuration (e.g. 4 BHK Sky Villa), move-in timeframe, or schedule..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-gray-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#94713A]" />
                  <span>Strict NDA & Zero Spam Guarantee</span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] disabled:opacity-50 transition-colors rounded-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Enquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { PROJECTS } from '../data/mockData';
import { X, Download, FileText, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export const BrochureModal: React.FC = () => {
  const { isBrochureModalOpen, closeBrochureModal, brochureProjectId } = useNavigation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isBrochureModalOpen) return null;

  const project = PROJECTS.find((p) => p.id === brochureProjectId) || PROJECTS[0];

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please provide your name, valid email address, and phone number.');
      return;
    }
    setError('');
    setIsDownloading(true);

    try {
      // Record lead in database
      await api.submitEnquiry({
        form_type: 'brochure_download',
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        project_id: project.id,
        subject: `Brochure Download: ${project.title}`,
        message: `User downloaded official brochure for ${project.title}`,
      });
    } catch (err) {
      // Non-blocking for client download experience
    }

    // Simulate PDF generation and download
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);

      // Create dummy downloadable text file simulating architectural brochure
      const blob = new Blob(
        [
          `99 BUILDERS & DEVELOPERS — OFFICIAL PROJECT DOSSIER\n` +
            `======================================================\n` +
            `Project: ${project.title}\n` +
            `Tagline: ${project.tagline}\n` +
            `Category: ${project.subCategory}\n` +
            `Status: ${project.status.toUpperCase()}\n` +
            `Location: ${project.location}\n` +
            `Pricing: ${project.priceStarting}\n` +
            `RERA ID: ${project.reraNumber}\n` +
            `Architecture: ${project.architectureFirm}\n` +
            `ISO Certification: ISO 14001:2015 Environmental Management\n\n` +
            `Overview:\n${project.overview}\n\n` +
            `Amenities:\n` +
            project.amenities.map((a) => `- ${a.name}: ${a.description}`).join('\n') +
            `\n\nContact Sales: sales@99builders.com | +91 (080) 4999-9900\n` +
            `Notice: Demo showcase document for architectural evaluation.\n`,
        ],
        { type: 'text/plain' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.id}-official-brochure.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl border border-[#ECE8E1] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#ECE8E1] flex items-center justify-between bg-[#FBF9F6]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F1EFEA] rounded-sm text-[#94713A]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-[#12161A]">
                Download Official Brochure
              </h3>
              <p className="text-xs text-gray-500">{project.title}</p>
            </div>
          </div>
          <button
            onClick={closeBrochureModal}
            className="p-1.5 text-gray-400 hover:text-black rounded-md"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {downloadSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-heading text-lg font-bold text-[#12161A]">
                Brochure Downloaded Successfully
              </h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                The comprehensive architectural dossier for <strong>{project.title}</strong> has been saved to your device. A high-resolution copy and floor plan layout kit has also been dispatched to{' '}
                <strong>{formData.email}</strong>.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={closeBrochureModal}
                  className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] rounded-sm"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDownload} className="space-y-4">
              <div className="p-3 bg-[#F9F8F6] rounded-sm border border-[#ECE8E1] flex gap-3 items-center">
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-16 h-14 object-cover rounded-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-[#12161A] truncate">{project.title}</div>
                  <div className="text-[11px] text-gray-500">{project.subCategory}</div>
                  <div className="text-[10px] text-[#94713A] font-mono mt-0.5">{project.reraNumber}</div>
                </div>
              </div>

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
                  placeholder="e.g. Katherine Shaw"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="katherine@example.com"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Number *</label>
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

              <div className="pt-2 flex items-center justify-between text-[11px] text-gray-500">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#94713A]" />
                  <span>Verified RERA Documentation</span>
                </div>
                <button
                  type="submit"
                  disabled={isDownloading}
                  className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloading ? 'Preparing Dossier...' : 'Download PDF'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

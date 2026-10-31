import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PROJECTS, COMPANY_INFO } from '../data/mockData';
import { Download, FileText, CheckCircle2, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export const DownloadBrochurePage: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROJECTS[0].id);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const [error, setError] = useState('');

  const activeProject = PROJECTS.find((p) => p.id === selectedProjectId) || PROJECTS[0];

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please provide your name, valid email address, and phone number.');
      return;
    }
    setError('');
    setIsDownloading(true);

    try {
      await api.submitEnquiry({
        form_type: 'brochure_request_page',
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        project_id: activeProject.id,
        subject: `Brochure Request: ${activeProject.title}`,
        message: `Client requested full architectural brochure & specifications for ${activeProject.title}`,
      });
    } catch (err) {
      // Continue download even if logging failed
    }

    setTimeout(() => {
      setIsDownloading(false);
      setDownloadDone(true);

      const blob = new Blob(
        [
          `99 BUILDERS & DEVELOPERS — APPROVED PROJECT DOSSIER\n` +
            `======================================================\n` +
            `Project: ${activeProject.title}\n` +
            `Tagline: ${activeProject.tagline}\n` +
            `Category: ${activeProject.subCategory}\n` +
            `Status: ${activeProject.status.toUpperCase()}\n` +
            `Location: ${activeProject.location}\n` +
            `Pricing: ${activeProject.priceStarting}\n` +
            `RERA ID: ${activeProject.reraNumber}\n` +
            `Architecture: ${activeProject.architectureFirm}\n` +
            `Possession: ${activeProject.possessionDate}\n\n` +
            `Overview:\n${activeProject.overview}\n\n` +
            `Amenities:\n` +
            activeProject.amenities.map((a) => `- ${a.name}: ${a.description}`).join('\n') +
            `\n\nCorporate Office: ${COMPANY_INFO.headquarters.phone} | ${COMPANY_INFO.headquarters.email}\n` +
            `Certification: ISO 14001:2015 Certified Environmental Management\n`,
        ],
        { type: 'text/plain' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeProject.id}-brochure-dossier.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs items={[{ label: 'Download Brochure' }]} />

      {/* Header */}
      <section className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
          <span>Architectural Monographs & Dossiers</span>
          <span aria-hidden="true">·</span>
          <span>Approved Collateral</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
          Download Official Project Brochures
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Access high-resolution architectural monographs, floor plans, structural engineering disclosures, and
          verified RERA statutory dossiers.
        </p>
      </section>

      {/* Main Download Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Project Selector & Preview */}
        <div className="lg:col-span-5 space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#12161A]">
            Select Project Dossier
          </label>
          <div className="space-y-2">
            {PROJECTS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProjectId(p.id);
                  setDownloadDone(false);
                }}
                className={`w-full p-3 rounded-lg border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  selectedProjectId === p.id
                    ? 'border-[#94713A] bg-[#FBF9F6] shadow-xs'
                    : 'border-[#ECE8E1] bg-white hover:bg-gray-50'
                }`}
              >
                <img src={p.heroImage} alt={p.title} className="w-14 h-12 object-cover rounded-xs shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#12161A] truncate">{p.title}</div>
                  <div className="text-[11px] text-gray-500">{p.subCategory}</div>
                  <div className="text-[10px] text-[#94713A] font-mono">{p.reraNumber.split('DEMO-99/')[1]?.replace(']', '') || 'VERIFIED'}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Gated Download Form & Confirmation */}
        <div className="lg:col-span-7 bg-white p-8 rounded-lg border border-[#ECE8E1] shadow-xs space-y-6">
          <div className="border-b border-[#ECE8E1] pb-4">
            <span className="text-[10px] uppercase font-semibold text-[#94713A] tracking-wider">
              Selected Document
            </span>
            <h3 className="font-heading text-xl font-bold text-[#12161A] mt-1">
              {activeProject.title} Monograph
            </h3>
            <p className="text-xs text-gray-500">{activeProject.location} · {activeProject.unitsOrArea}</p>
          </div>

          {downloadDone ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-heading text-2xl font-bold text-[#12161A]">Dossier Downloaded</h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                The comprehensive architectural kit for <strong>{activeProject.title}</strong> has been downloaded to your
                system and emailed to <strong>{email}</strong>.
              </p>
              <button
                onClick={() => setDownloadDone(false)}
                className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] rounded-sm"
              >
                Download Another Brochure
              </button>
            </div>
          ) : (
            <form onSubmit={handleDownload} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-xs text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Christine Adams"
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="christine@example.com"
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#94713A]" />
                  <span>Approved RERA & ISO Standards</span>
                </div>
                <button
                  type="submit"
                  disabled={isDownloading}
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Download className="w-4 h-4 text-[#C5A880]" />
                  <span>{isDownloading ? 'Generating Dossier...' : 'Download Official PDF'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

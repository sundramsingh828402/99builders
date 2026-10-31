import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useData } from '../context/DataContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Download, Mail, Phone, ExternalLink, ArrowRight, FileText } from 'lucide-react';

export const PressPage: React.FC = () => {
  const { navigate } = useNavigation();
  const { pressReleases: PRESS_RELEASES, companyInfo: COMPANY_INFO } = useData();
  const [downloadingKit, setDownloadingKit] = useState(false);
  const [kitDownloaded, setKitDownloaded] = useState(false);

  const handleDownloadKit = () => {
    setDownloadingKit(true);
    setTimeout(() => {
      setDownloadingKit(false);
      setKitDownloaded(true);

      const blob = new Blob(
        [
          `99 BUILDERS & DEVELOPERS — OFFICIAL MEDIA KIT & FACT SHEET\n` +
            `============================================================\n` +
            `Corporate Name: ${COMPANY_INFO.name}\n` +
            `ISO Certification: ${COMPANY_INFO.certification}\n` +
            `Founded: ${COMPANY_INFO.foundedYear}\n` +
            `Delivered Footprint: ${COMPANY_INFO.completedSqFt}\n` +
            `Media Contact: media@99builders.com | ${COMPANY_INFO.headquarters.phone}\n` +
            `Brand Guidelines: Primary Colors: Charcoal (#12161A), Warm Sand (#F9F8F6), Gold (#C5A880)\n` +
            `Logo Asset: /assets/aistudio/99logo_64777909.png\n`,
        ],
        { type: 'text/plain' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `99-builders-official-media-kit.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <Breadcrumbs items={[{ label: 'Media & Insights' }, { label: 'Press Releases' }]} />

      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#ECE8E1] pb-10">
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
            <span>Press Office & Media Relations</span>
            <span aria-hidden="true">·</span>
            <span>Official Dispatches</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
            Press Releases & Corporate Statements
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            Official media statements, financial disclosures, and verified corporate announcements issued for accredited
            journalists, industry analysts, and publishing partners.
          </p>
        </div>

        <div>
          <button
            onClick={handleDownloadKit}
            disabled={downloadingKit}
            className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#C5A880]" />
            <span>{downloadingKit ? 'Downloading Kit...' : 'Download Official Media Kit'}</span>
          </button>
          {kitDownloaded && (
            <p className="text-[11px] text-emerald-600 mt-2 text-right">Media kit downloaded successfully.</p>
          )}
        </div>
      </section>

      {/* Press Releases List */}
      <section className="space-y-6">
        <h2 className="font-heading text-2xl font-bold text-[#12161A]">Official Media Statements</h2>
        <div className="space-y-6">
          {PRESS_RELEASES.map((pr) => (
            <div
              key={pr.id}
              className="p-6 bg-white rounded-lg border border-[#ECE8E1] flex flex-col md:flex-row gap-6 items-start justify-between hover:border-[#94713A] transition-colors"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 text-xs text-[#94713A] font-semibold uppercase tracking-wider">
                  <span>Official Release</span>
                  <span aria-hidden="true">·</span>
                  <span>{pr.date}</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-[#12161A] leading-snug">{pr.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{pr.summary}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {pr.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-[#F4EFEA] px-2 py-0.5 rounded-xs text-gray-700">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => navigate('news-article', { articleId: pr.id })}
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm text-center"
                >
                  Read Release
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Media Contact Information */}
      <section className="bg-[#F9F8F6] p-8 lg:p-10 rounded-lg border border-[#ECE8E1] space-y-4">
        <div className="max-w-2xl space-y-2">
          <h3 className="font-heading text-xl font-bold text-[#12161A]">Press Enquiries & Executive Interviews</h3>
          <p className="text-xs text-gray-600">
            For journalist queries, high-resolution photography requests, or executive interview scheduling with Chairman
            Rajesh Malhotra or Chief Architect Ananya Sen:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-gray-700">
          <div className="p-4 bg-white rounded-sm border border-[#ECE8E1] flex items-center gap-3">
            <Mail className="w-4 h-4 text-[#94713A]" />
            <div>
              <div className="text-gray-400 text-[11px]">Media Desk Email</div>
              <strong className="text-[#12161A]">media@99builders.com</strong>
            </div>
          </div>
          <div className="p-4 bg-white rounded-sm border border-[#ECE8E1] flex items-center gap-3">
            <Phone className="w-4 h-4 text-[#94713A]" />
            <div>
              <div className="text-gray-400 text-[11px]">Press Hotline</div>
              <strong className="text-[#12161A] font-mono">{COMPANY_INFO.headquarters.phone} (Ext. 402)</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SERVICES } from '../data/mockData';
import { ArrowRight, CheckCircle2, ShieldCheck, HardHat } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { navigate, openEnquiryModal } = useNavigation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <Breadcrumbs items={[{ label: 'Construction Services' }]} />

      {/* Hero Header */}
      <section className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
          <span>Full-Spectrum Capabilities</span>
          <span aria-hidden="true">·</span>
          <span>From Groundbreaking to Fit-Out</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
          Civil Engineering & EPC Contracting
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Integrated turnkey construction, architectural masterplanning, seismic structural engineering, and ISO 14001:2015
          green building certification. We deliver large-scale commercial and luxury residential projects with guaranteed
          timelines.
        </p>
      </section>

      {/* Services Listing */}
      <section className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((s, index) => (
            <div
              key={s.id}
              className="bg-white rounded-lg border border-[#ECE8E1] overflow-hidden flex flex-col justify-between group hover:border-[#94713A] transition-colors"
            >
              <div className="aspect-16/10 overflow-hidden relative">
                <img
                  src={s.heroImage}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#12161A]/85 text-white text-[10px] uppercase font-semibold px-2 py-0.5 rounded-xs">
                  Service 0{index + 1}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-bold text-[#12161A] group-hover:text-[#94713A] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{s.shortDesc}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#ECE8E1]">
                  <div className="text-[11px] font-semibold text-[#94713A] uppercase tracking-wider mb-1">
                    Key Deliverables:
                  </div>
                  {s.deliverables.slice(0, 2).map((d, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#94713A] shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{d}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#ECE8E1] flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#12161A]">
                    {s.stats[0]?.value}
                  </span>
                  <button
                    onClick={() => navigate('service-detail', { serviceId: s.id })}
                    className="text-xs font-semibold uppercase tracking-wider text-[#12161A] hover:text-[#94713A] transition-colors flex items-center gap-1"
                  >
                    <span>View Methodology</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EPC Turnkey Contract Banner */}
      <section className="bg-[#12161A] text-white p-8 lg:p-12 rounded-lg border border-[#232B32] space-y-6">
        <div className="max-w-2xl space-y-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
            Institutional Contracting Opportunities
          </div>
          <h2 className="font-heading text-3xl font-bold text-white">
            Partner With 99 Builders for Your Next Capital Project
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            We partner with sovereign wealth funds, multinational corporations, and institutional landowners to execute
            end-to-end turnkey EPC contracts with guaranteed maximum price (GMP) structures and ISO-certified QA/QC.
          </p>
          <div className="pt-2">
            <button
              onClick={() => openEnquiryModal('Institutional EPC Turnkey Tendering')}
              className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#12161A] bg-[#C5A880] hover:bg-[#D4BC98] transition-colors rounded-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Submit RFP / Tender Inquiry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

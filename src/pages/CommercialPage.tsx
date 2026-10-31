import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useData } from '../context/DataContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { MapPin, Download, ArrowRight, ShieldCheck, Zap, Building2 } from 'lucide-react';

export const CommercialPage: React.FC = () => {
  const { navigate, openBrochureModal, openEnquiryModal } = useNavigation();
  const { projects } = useData();

  const commercialProjects = projects.filter((p) => p.category === 'commercial');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <Breadcrumbs items={[{ label: 'Our Projects', page: 'projects' }, { label: 'Commercial Properties' }]} />

      {/* Hero Header */}
      <section className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
          <span>Corporate Infrastructure</span>
          <span aria-hidden="true">·</span>
          <span>Grade-A Tech Parks & Financial Monoliths</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
          LEED Platinum Commercial Destinations
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Engineered for global technology enterprises, Fortune 500 headquarters, and luxury retail flagships.
          Featuring column-free floor plates, integrated 100% renewable power offsets, and destination-dispatch elevators.
        </p>
      </section>

      {/* Institutional Highlights Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg border border-[#ECE8E1] space-y-2">
          <div className="text-2xl font-bold font-mono text-[#12161A]">55,000 sq.ft</div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94713A]">Expansive Floor Plates</h3>
          <p className="text-xs text-gray-500">
            Column-free core layouts with efficiency ratios exceeding 82% for maximum desk density.
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg border border-[#ECE8E1] space-y-2">
          <div className="text-2xl font-bold font-mono text-[#12161A]">100% Green Power</div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94713A]">Solar & Wind Wheeling</h3>
          <p className="text-xs text-gray-500">
            Rooftop solar arrays paired with off-site wind farms enabling zero carbon operational offsets.
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg border border-[#ECE8E1] space-y-2">
          <div className="text-2xl font-bold font-mono text-[#12161A]">MERV-14 IAQ</div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94713A]">Indoor Air Purity</h3>
          <p className="text-xs text-gray-500">
            Automated demand-controlled ventilation with real-time PM2.5 and CO2 sensor networks.
          </p>
        </div>
      </section>

      {/* Commercial Projects Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-[#12161A]">Commercial Portfolios</h2>
          <button
            onClick={() => openEnquiryModal('Corporate Commercial Leasing')}
            className="text-xs font-semibold text-[#94713A] hover:underline"
          >
            Request Institutional Leasing Term Sheet →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {commercialProjects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg border border-[#ECE8E1] overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
                <img
                  src={p.heroImage}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#12161A]/85 text-white text-[10px] uppercase font-semibold px-2.5 py-1 rounded-xs tracking-wider">
                  {p.status}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#C5A880] block drop-shadow-sm">
                    {p.subCategory}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-[#94713A] shrink-0" />
                    <span>{p.location}</span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-[#12161A] leading-snug group-hover:text-[#94713A] transition-colors">
                    {p.title}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{p.tagline}</p>
                </div>

                <div className="pt-3 border-t border-[#ECE8E1] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Available Leasable Space:</span>
                    <span className="text-gray-800 font-semibold">{p.unitsOrArea.split('|')[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Terms:</span>
                    <span className="text-[#94713A] font-semibold">{p.priceStarting}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => navigate('project-detail', { projectId: p.id })}
                    className="flex-1 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm text-center"
                  >
                    View Campus Details
                  </button>
                  <button
                    onClick={() => openBrochureModal(p.id)}
                    className="px-3 py-2 text-xs text-[#12161A] border border-[#ECE8E1] hover:bg-[#F9F8F6] rounded-sm transition-colors"
                    title="Download Commercial Kit"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

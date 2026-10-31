import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useData } from '../context/DataContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { MapPin, Download, Calendar, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const ResidentialPage: React.FC = () => {
  const { navigate, openBrochureModal } = useNavigation();
  const { projects } = useData();

  const residentialProjects = projects.filter((p) => p.category === 'residential');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <Breadcrumbs items={[{ label: 'Our Projects', page: 'projects' }, { label: 'Residential Properties' }]} />

      {/* Hero Header */}
      <section className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
          <span>Residential Sanctuary</span>
          <span aria-hidden="true">·</span>
          <span>Sky Mansions, Penthouses & Sovereign Estates</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
          Ultra-Luxury Residential Landmarks
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Crafted with Italian Statuario marble, 270-degree panoramic glass curtain walls, private cantilevered plunge
          pools, and 24/7 white-glove resident concierges.
        </p>
      </section>

      {/* Featured Marquee Residential Banner */}
      <section className="relative rounded-lg overflow-hidden bg-[#12161A] text-white p-8 lg:p-12 shadow-xl">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"
            alt="Residential Luxury"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
            Biophilic Sky Living
          </div>
          <h2 className="font-heading text-3xl font-bold text-white">
            Aurora Sky Residences & Penthouses
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            52 storeys of sublime architectural grandeur overlooking the central skyline. Heated infinity pools,
            private high-speed lifts, and seismic-damped engineering.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => navigate('project-detail', { projectId: 'aurora-sky-villas' })}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#12161A] bg-[#C5A880] hover:bg-[#D4BC98] transition-colors rounded-sm flex items-center gap-2"
            >
              <span>Explore Aurora Residences</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('site-visit')}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white border border-white/30 hover:bg-white/10 transition-colors rounded-sm"
            >
              Book Private Walkthrough
            </button>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-[#12161A]">Available Residential Collections</h2>
          <span className="text-xs text-gray-500 font-mono">{residentialProjects.length} Verified Addresses</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {residentialProjects.map((p) => (
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
                    <span className="text-gray-500 font-medium">Layouts:</span>
                    <span className="text-gray-800 font-semibold">{p.unitsOrArea.split('|')[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Pricing:</span>
                    <span className="text-[#94713A] font-semibold">{p.priceStarting}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => navigate('project-detail', { projectId: p.id })}
                    className="flex-1 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm text-center"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => openBrochureModal(p.id)}
                    className="px-3 py-2 text-xs text-[#12161A] border border-[#ECE8E1] hover:bg-[#F9F8F6] rounded-sm transition-colors"
                    title="Download Brochure"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigate('site-visit')}
                    className="px-3 py-2 text-xs text-[#94713A] border border-[#ECE8E1] hover:bg-[#F9F8F6] rounded-sm transition-colors"
                    title="Book Site Visit"
                  >
                    <Calendar className="w-3.5 h-3.5" />
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

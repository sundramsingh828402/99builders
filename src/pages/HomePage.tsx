import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useData } from '../context/DataContext';
import { LEADERSHIP } from '../data/mockData';
import {
  ArrowRight,
  ShieldCheck,
  Building,
  HardHat,
  Compass,
  CheckCircle2,
  Calendar,
  MapPin,
  Download,
  Play,
  Quote,
  ChevronRight,
  Sparkles,
  Award,
  Layers,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate, openEnquiryModal, openBrochureModal } = useNavigation();
  const { projects, services: SERVICES, companyInfo: COMPANY_INFO, newsArticles: NEWS_ARTICLES, pressReleases: PRESS_RELEASES } = useData();
  const [projectCategoryFilter, setProjectCategoryFilter] = useState<'all' | 'residential' | 'commercial'>('all');

  const filteredProjects = projects.filter((p) => {
    if (projectCategoryFilter === 'all') return true;
    return p.category === projectCategoryFilter;
  });

  const featuredAurora = projects.find((p) => p.id === 'aurora-sky-villas') || projects[0];

  return (
    <div className="space-y-24 pb-16">
      {/* 1. Hero Section - International Real Estate Developer Aesthetic */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-[#12161A] text-white overflow-hidden">
        {/* Background Architectural Image with Measured Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=85"
            alt="99 Builders Luxury Architecture"
            className="w-full h-full object-cover object-center brightness-75 scale-105 transition-transform duration-1000 ease-out"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12161A] via-[#12161A]/60 to-black/40" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-3xl space-y-6">
            {/* Unboxed Brand Subtitle / ISO Trust Tag */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#C5A880]">
              <span>ISO 14001:2015 Certified Developers</span>
              <span aria-hidden="true">·</span>
              <span>18+ Years of Civil Mastery</span>
            </div>

            {/* Headline with balance */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] text-balance">
              Engineering Legacies. Sculpting Metropolitan Horizons.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-2xl">
              We design and construct iconic ultra-luxury residences, biophilic sky mansions, and sustainable Grade-A
              corporate campuses engineered to endure for generations.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => openEnquiryModal('Homepage Hero Consultation')}
                className="px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#12161A] bg-[#C5A880] hover:bg-[#D4BC98] transition-colors rounded-sm flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('projects')}
                className="px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-white border border-white/30 hover:bg-white/10 transition-colors rounded-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Projects</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Quick Indicator Strip */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/40 backdrop-blur-md border-t border-white/10 py-4 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-gray-300">
            <div className="flex items-center gap-6">
              <span className="text-[#C5A880] font-semibold uppercase tracking-wider text-[11px]">
                Flagship Landmark:
              </span>
              <span>Aurora Sky Residences & Penthouses</span>
              <span className="text-gray-500">|</span>
              <span>Possession: Q4 2027</span>
            </div>
            <button
              onClick={() => navigate('project-detail', { projectId: 'aurora-sky-villas' })}
              className="text-[#C5A880] hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <span>View Architectural Dossier</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Business Highlights Strip (KPIs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-white rounded-lg shadow-sm border border-[#ECE8E1]">
          <div className="space-y-1">
            <div className="text-3xl lg:text-4xl font-heading font-bold text-[#12161A] font-mono tabular-nums">
              {COMPANY_INFO.completedSqFt}
            </div>
            <div className="text-xs uppercase tracking-wider font-semibold text-[#94713A]">
              Delivered Built Space
            </div>
            <p className="text-xs text-gray-500">Across residential & commercial sectors</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl lg:text-4xl font-heading font-bold text-[#12161A] font-mono tabular-nums">
              {COMPANY_INFO.completedProjectsCount}
            </div>
            <div className="text-xs uppercase tracking-wider font-semibold text-[#94713A]">
              Landmark Completions
            </div>
            <p className="text-xs text-gray-500">Executed with 98.2% on-time record</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl lg:text-4xl font-heading font-bold text-[#12161A] font-mono tabular-nums">
              {COMPANY_INFO.happyFamilies}
            </div>
            <div className="text-xs uppercase tracking-wider font-semibold text-[#94713A]">
              Resident Families
            </div>
            <p className="text-xs text-gray-500">Living in sovereign 99 communities</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl lg:text-4xl font-heading font-bold text-[#12161A]">
              ISO 14001
            </div>
            <div className="text-xs uppercase tracking-wider font-semibold text-[#94713A]">
              Certified Environmental
            </div>
            <p className="text-xs text-gray-500">2015 Standard with 92% waste diversion</p>
          </div>
        </div>
      </section>

      {/* 3. Company Introduction & Heritage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
              <span>Heritage & Vision</span>
              <span aria-hidden="true">·</span>
              <span>Founded in {COMPANY_INFO.foundedYear}</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#12161A] text-balance">
              Building Beyond Ordinary Horizons
            </h2>

            <p className="text-sm text-gray-600 leading-relaxed">
              Founded on unyielding civil engineering principles, <strong>99 Builders & Developers</strong> has evolved
              from a specialized structural contractor into one of the country&apos;s foremost integrated real estate
              conglomerates.
            </p>

            <p className="text-sm text-gray-600 leading-relaxed">
              We manage the entire lifecycle of real estate creation — from speculative site acquisitions and bioclimatic
              architectural planning through turnkey EPC general contracting and lifetime concierge property maintenance.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#F9F8F6] rounded-sm border border-[#ECE8E1]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#12161A] mb-1">
                  Seismic Zone IV Integrity
                </h4>
                <p className="text-xs text-gray-500">
                  Engineered with self-compacting M60 concrete matrix and post-tensioned shear cores.
                </p>
              </div>
              <div className="p-4 bg-[#F9F8F6] rounded-sm border border-[#ECE8E1]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#12161A] mb-1">
                  Statutory RERA Transparency
                </h4>
                <p className="text-xs text-gray-500">
                  Dedicated 70% ring-fenced escrow accounts with public quarterly disclosures.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => navigate('about')}
                className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm flex items-center gap-2"
              >
                <span>Read Full Heritage</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
              </button>
              <button
                onClick={() => navigate('profile')}
                className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#12161A] border border-[#12161A] hover:bg-gray-50 transition-colors rounded-sm"
              >
                <span>Quality Standards</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-lg overflow-hidden shadow-xl aspect-4/3">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="99 Builders Interior Living"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#C5A880] block mb-1">
                  Craftsmanship & Noblesse
                </span>
                <p className="text-sm font-medium text-white/90">
                  Book-matched Italian Statuario marble & bespoke floor-to-ceiling glass envelopes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Project Spotlight - Aurora Sky Residences */}
      <section className="bg-[#171D22] text-white py-20 border-y border-[#232B32]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#C5A880] mb-2">
                <span>Featured Landmark Showcase</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{featuredAurora.reraNumber}</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
                {featuredAurora.title}
              </h2>
            </div>
            <button
              onClick={() => navigate('project-detail', { projectId: featuredAurora.id })}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#12161A] bg-[#C5A880] hover:bg-[#D4BC98] transition-colors rounded-sm whitespace-nowrap self-start md:self-auto flex items-center gap-2"
            >
              <span>Explore Landmark</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Image Showcase */}
            <div className="lg:col-span-7 relative rounded-lg overflow-hidden min-h-[380px]">
              <img
                src={featuredAurora.heroImage}
                alt={featuredAurora.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-sm text-xs font-mono text-[#C5A880]">
                Construction Progress: {featuredAurora.overallProgress}% Complete
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md p-4 rounded-sm flex items-center justify-between text-xs">
                <div>
                  <div className="text-gray-400">Location</div>
                  <div className="text-white font-medium">{featuredAurora.location}</div>
                </div>
                <div>
                  <div className="text-gray-400">Pricing</div>
                  <div className="text-white font-medium">{featuredAurora.priceStarting}</div>
                </div>
                <div>
                  <div className="text-gray-400">Handover</div>
                  <div className="text-white font-medium">{featuredAurora.possessionDate}</div>
                </div>
              </div>
            </div>

            {/* Right Details & Milestones */}
            <div className="lg:col-span-5 bg-[#1F2630] p-6 lg:p-8 rounded-lg border border-[#2D3748] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="font-heading text-xl font-bold text-white">
                  Biophilic Sky Mansions Above the City
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">{featuredAurora.overview}</p>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
                    Key Specifications & Amenities
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                    {featuredAurora.amenities.slice(0, 4).map((a, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                        <span className="truncate">{a.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress Milestones Strip */}
              <div className="pt-4 border-t border-[#2D3748] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Superstructure & Facade</span>
                  <span className="font-mono text-[#C5A880]">{featuredAurora.overallProgress}%</span>
                </div>
                <div className="w-full bg-[#12161A] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#94713A] to-[#C5A880] h-full"
                    style={{ width: `${featuredAurora.overallProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-400">
                  Core topped out at Level 52. Glazing underway on Floors 33–52.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => navigate('site-visit')}
                  className="flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#C5A880] hover:bg-[#D4BC98] transition-colors rounded-sm text-center"
                >
                  Book Site Visit
                </button>
                <button
                  onClick={() => openBrochureModal(featuredAurora.id)}
                  className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white border border-[#4A5568] hover:bg-white/5 transition-colors rounded-sm flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Brochure</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Master Projects Filterable Catalogue */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A] mb-1">
              <span>Portfolios & Developments</span>
              <span aria-hidden="true">·</span>
              <span>Filter by Category</span>
            </div>
            <h2 className="font-heading text-3xl font-bold text-[#12161A]">
              Explore Ongoing, Completed & Upcoming Projects
            </h2>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#F1EFEA] rounded-md self-start md:self-auto">
            <button
              onClick={() => setProjectCategoryFilter('all')}
              className={`px-4 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
                projectCategoryFilter === 'all'
                  ? 'bg-white text-[#12161A] shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-[#12161A]'
              }`}
            >
              All Projects ({projects.length})
            </button>
            <button
              onClick={() => setProjectCategoryFilter('residential')}
              className={`px-4 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
                projectCategoryFilter === 'residential'
                  ? 'bg-white text-[#12161A] shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-[#12161A]'
              }`}
            >
              Residential
            </button>
            <button
              onClick={() => setProjectCategoryFilter('commercial')}
              className={`px-4 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
                projectCategoryFilter === 'commercial'
                  ? 'bg-white text-[#12161A] shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-[#12161A]'
              }`}
            >
              Commercial
            </button>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg border border-[#ECE8E1] overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
            >
              {/* Image & Status */}
              <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
                <img
                  src={p.heroImage}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#12161A]/85 backdrop-blur-xs text-white text-[10px] uppercase font-semibold px-2.5 py-1 rounded-xs tracking-wider">
                  {p.status}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-[11px] font-semibold text-[#C5A880] uppercase tracking-wider drop-shadow-sm">
                    {p.subCategory}
                  </div>
                </div>
              </div>

              {/* Card Body */}
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

                <div className="pt-3 border-t border-[#ECE8E1] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Configurations:</span>
                    <span className="text-gray-800 font-semibold">{p.unitsOrArea.split('|')[0]}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Pricing:</span>
                    <span className="text-[#94713A] font-semibold">{p.priceStarting}</span>
                  </div>
                </div>

                {/* Actions */}
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

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('projects')}
            className="px-8 py-3 text-xs font-semibold uppercase tracking-wider text-[#12161A] border border-[#12161A] hover:bg-[#12161A] hover:text-white transition-colors rounded-sm inline-flex items-center gap-2 cursor-pointer"
          >
            <span>View All Master Project Listings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 6. Construction Services Preview */}
      <section className="bg-[#F9F8F6] py-20 border-y border-[#ECE8E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
              <span>Integrated Construction Capabilities</span>
              <span aria-hidden="true">·</span>
              <span>Turnkey EPC</span>
            </div>
            <h2 className="font-heading text-3xl font-bold text-[#12161A]">
              Institutional Engineering & Contracting Services
            </h2>
            <p className="text-xs text-gray-600">
              From geotechnical ground improvement to seismic high-rise superstructure casting and LEED Platinum green
              building lifecycle audits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <div
                key={s.id}
                className="bg-white p-6 rounded-lg border border-[#ECE8E1] flex flex-col justify-between space-y-4 hover:border-[#94713A] transition-colors"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-sm bg-[#F4EFEA] text-[#94713A] flex items-center justify-center font-semibold text-xs">
                    {s.title.substring(0, 2).toUpperCase()}
                  </div>
                  <h3 className="font-heading text-base font-bold text-[#12161A]">{s.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{s.shortDesc}</p>
                </div>

                <div className="pt-4 border-t border-[#ECE8E1] flex items-center justify-between">
                  <span className="text-[11px] text-[#94713A] font-semibold uppercase tracking-wider">
                    {s.stats[0]?.value} {s.stats[0]?.label}
                  </span>
                  <button
                    onClick={() => navigate('service-detail', { serviceId: s.id })}
                    className="text-xs font-semibold text-[#12161A] hover:text-[#94713A] transition-colors flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => navigate('services')}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm inline-flex items-center gap-2"
            >
              <span>Explore All Engineering Services</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. Construction Progress & Quality Rigor */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
              <span>Continuous Verification</span>
              <span aria-hidden="true">·</span>
              <span>4.5M Safe Man-Hours</span>
            </div>
            <h2 className="font-heading text-3xl font-bold text-[#12161A]">
              Pioneering Quality Standards & ISO 14001:2015
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every cubic meter of concrete poured on our sites undergoes computerized slump retention, cube crushing
              trials, and ultrasonic crack detection. We believe institutional engineering rigor is non-negotiable.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#94713A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#12161A]">Seismic Zone IV Testing</h4>
                  <p className="text-xs text-gray-500">
                    Dual structural dampers and elastomeric bearings calibrated for wind and tremor loads.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#94713A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#12161A]">100% On-Site Water Neutrality</h4>
                  <p className="text-xs text-gray-500">
                    Subterranean rainwater percolation wells recharging aquifers across all 12 projects.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigate('profile')}
                className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#12161A] border border-[#12161A] hover:bg-gray-50 transition-colors rounded-sm inline-flex items-center gap-2"
              >
                <span>Read Quality Dossier</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-white rounded-lg border border-[#ECE8E1] space-y-2">
              <span className="text-xs font-semibold text-[#94713A] uppercase tracking-wider">
                Concrete Mix Formulation
              </span>
              <div className="text-2xl font-bold font-mono text-[#12161A]">M60 Grade</div>
              <p className="text-xs text-gray-500">
                Self-compacting micro-silica matrix delivering compressive strength of 60 N/mm².
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-[#ECE8E1] space-y-2">
              <span className="text-xs font-semibold text-[#94713A] uppercase tracking-wider">
                Structural Steel Standard
              </span>
              <div className="text-2xl font-bold font-mono text-[#12161A]">Fe-550D TMT</div>
              <p className="text-xs text-gray-500">
                High elongation thermo-mechanically treated rebars resistant to corrosion.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-[#ECE8E1] space-y-2">
              <span className="text-xs font-semibold text-[#94713A] uppercase tracking-wider">
                Digital Permit to Work
              </span>
              <div className="text-2xl font-bold font-mono text-[#12161A]">100% Logged</div>
              <p className="text-xs text-gray-500">
                Cloud-based contractor permit validation prior to high-elevation or hot work.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-[#ECE8E1] space-y-2">
              <span className="text-xs font-semibold text-[#94713A] uppercase tracking-wider">
                Weekly Drone LIDAR
              </span>
              <div className="text-2xl font-bold font-mono text-[#12161A]">Sub-5mm Delta</div>
              <p className="text-xs text-gray-500">
                Photogrammetry scans overlaid against BIM model to prevent site variances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Attributable Testimonials (Resident & Corporate) */}
      <section className="bg-[#F4EFEA] py-20 border-y border-[#E5DFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
              <span>Verified Patron Experiences</span>
              <span aria-hidden="true">·</span>
              <span>Resident & Tenant Accounts</span>
            </div>
            <h2 className="font-heading text-3xl font-bold text-[#12161A]">
              Testimonials from Sovereign Residents
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border border-[#ECE8E1] space-y-4 flex flex-col justify-between">
              <Quote className="w-8 h-8 text-[#C5A880]/60" />
              <p className="text-xs text-gray-700 leading-relaxed italic">
                &ldquo;Relocating our family to Grand Verona Estates was the most effortless property purchase of my life.
                From private elevator integration to the 40-acre botanical reserve, the attention to detail is truly
                international class.&rdquo;
              </p>
              <div className="pt-4 border-t border-gray-100">
                <div className="text-xs font-bold text-[#12161A]">Vikram & Sunita Singhal</div>
                <div className="text-[11px] text-gray-500">Villa Owners, Grand Verona Estates</div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg border border-[#ECE8E1] space-y-4 flex flex-col justify-between">
              <Quote className="w-8 h-8 text-[#C5A880]/60" />
              <p className="text-xs text-gray-700 leading-relaxed italic">
                &ldquo;We consolidated 3,200 software engineers into Meridian Nexus Tech Park. The building automation,
                sub-25-second elevator dispatch, and 100% solar power offset allowed us to attain our corporate carbon
                neutrality milestones 2 years ahead of schedule.&rdquo;
              </p>
              <div className="pt-4 border-t border-gray-100">
                <div className="text-xs font-bold text-[#12161A]">Marcus Sterling</div>
                <div className="text-[11px] text-gray-500">VP Corporate Real Estate, Global Tech Group</div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg border border-[#ECE8E1] space-y-4 flex flex-col justify-between">
              <Quote className="w-8 h-8 text-[#C5A880]/60" />
              <p className="text-xs text-gray-700 leading-relaxed italic">
                &ldquo;As a non-resident buyer based in London, having absolute clarity on statutory RERA compliance and
                monthly drone video progress updates gave me complete peace of mind. 99 Builders sets the gold standard
                for developer transparency.&rdquo;
              </p>
              <div className="pt-4 border-t border-gray-100">
                <div className="text-xs font-bold text-[#12161A]">Priya Nambiar</div>
                <div className="text-[11px] text-gray-500">Duplex Penthouse Buyer, Aurora Sky Residences</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Latest News, Media Coverage & Press */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A] mb-1">
              <span>Corporate Dispatches</span>
              <span aria-hidden="true">·</span>
              <span>Announcements & Insights</span>
            </div>
            <h2 className="font-heading text-3xl font-bold text-[#12161A]">
              Latest News & Industry Perspectives
            </h2>
          </div>
          <button
            onClick={() => navigate('news')}
            className="text-xs font-semibold text-[#12161A] hover:text-[#94713A] transition-colors flex items-center gap-1.5"
          >
            <span>View All News & Press</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEWS_ARTICLES.slice(0, 3).map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-lg border border-[#ECE8E1] overflow-hidden flex flex-col hover:border-[#94713A] transition-colors group cursor-pointer"
              onClick={() => navigate('news-article', { articleId: item.id })}
            >
              <div className="aspect-16/9 bg-gray-100 overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#12161A]/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-xs uppercase">
                  {item.category}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <span>{item.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.readTime}</span>
                  </div>
                  <h3 className="font-heading text-sm font-bold text-[#12161A] group-hover:text-[#94713A] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2">{item.summary}</p>
                </div>
                <div className="pt-2 text-xs font-semibold text-[#94713A] flex items-center gap-1">
                  <span>Read Article</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 10. Call to Action / Site Visit Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#12161A] text-white rounded-xl p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
              Personalized VIP Site Experience
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold leading-tight text-white">
              Step Inside the Future of Metropolitan Living
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Schedule a private walkthrough at our Experience Centers. Enjoy a complimentary chauffeur pickup, curated
              architectural walkthrough, and personal briefing with our Senior Relationship Directors.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('site-visit')}
                className="px-7 py-3 text-xs font-semibold uppercase tracking-wider text-[#12161A] bg-[#C5A880] hover:bg-[#D4BC98] transition-colors rounded-sm flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Book a Site Visit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('download-brochure')}
                className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white border border-white/20 hover:bg-white/10 transition-colors rounded-sm flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Master Brochure</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

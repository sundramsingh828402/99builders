import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useData } from '../context/DataContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Search, MapPin, Download, Calendar, Filter, ArrowRight } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { navigate, openBrochureModal } = useNavigation();
  const { projects } = useData();

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'residential' | 'commercial'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'completed' | 'upcoming'>('all');
  const [hubFilter, setHubFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const hubs = ['all', 'Waterfront Promenade', 'Tech Corridor', 'Financial District', 'Aero City Enclave'];

  const filteredProjects = projects.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (hubFilter !== 'all' && p.cityHub !== hubFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchLoc = p.location.toLowerCase().includes(q);
      const matchTag = p.tagline.toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchTag) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs items={[{ label: 'Our Projects' }]} />

      {/* Header */}
      <section className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
          <span>Landmark Master Portfolio</span>
          <span aria-hidden="true">·</span>
          <span>Residential & Commercial</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
          Architectural Masterpieces & Campuses
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Search and explore our ongoing developments, delivered residences, and upcoming masterplanned communities.
          Each project is engineered to Seismic Zone IV standards and verified under statutory RERA guidelines.
        </p>
      </section>

      {/* Search and Filters Bar */}
      <section className="bg-white p-6 rounded-lg border border-[#ECE8E1] shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project name or neighborhood..."
              className="w-full pl-10 pr-4 py-2.5 text-xs text-[#12161A] border border-[#ECE8E1] rounded-sm focus:outline-hidden focus:border-[#94713A]"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 text-xs border border-[#ECE8E1] rounded-sm focus:outline-hidden focus:border-[#94713A] bg-white text-gray-700 font-medium"
            >
              <option value="all">All Portfolios (Residential & Commercial)</option>
              <option value="residential">Residential Residences & Villas</option>
              <option value="commercial">Commercial Tech Parks & Towers</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 text-xs border border-[#ECE8E1] rounded-sm focus:outline-hidden focus:border-[#94713A] bg-white text-gray-700 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="ongoing">Under Construction</option>
              <option value="completed">Ready for Possession</option>
              <option value="upcoming">Upcoming Launch</option>
            </select>
          </div>

          {/* Location Hub Filter */}
          <div className="md:col-span-2">
            <select
              value={hubFilter}
              onChange={(e) => setHubFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-[#ECE8E1] rounded-sm focus:outline-hidden focus:border-[#94713A] bg-white text-gray-700 font-medium"
            >
              <option value="all">All City Hubs</option>
              {hubs.filter((h) => h !== 'all').map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Counter & Active Tag Indicator */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-[#ECE8E1]">
          <div>
            Showing <strong className="text-[#12161A] font-mono">{filteredProjects.length}</strong> matching projects
          </div>
          {(categoryFilter !== 'all' || statusFilter !== 'all' || hubFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setCategoryFilter('all');
                setStatusFilter('all');
                setHubFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-[#94713A] hover:underline font-medium"
            >
              Reset all filters
            </button>
          )}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.length === 0 ? (
          <div className="col-span-3 py-16 text-center space-y-3 bg-white rounded-lg border border-[#ECE8E1]">
            <p className="text-sm font-semibold text-[#12161A]">No developments match your current filter parameters.</p>
            <p className="text-xs text-gray-500">Try adjusting your location or status filters.</p>
            <button
              onClick={() => {
                setCategoryFilter('all');
                setStatusFilter('all');
                setHubFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold text-[#12161A] border border-[#12161A] rounded-sm hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredProjects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg border border-[#ECE8E1] overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
            >
              {/* Image & Status Tag */}
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
                {p.overallProgress !== undefined && p.overallProgress < 100 && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#12161A] text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs">
                    {p.overallProgress}% Complete
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#C5A880] block drop-shadow-sm">
                    {p.subCategory}
                  </span>
                </div>
              </div>

              {/* Body */}
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
                    <span className="text-gray-500 font-medium">Configurations:</span>
                    <span className="text-gray-800 font-semibold">{p.unitsOrArea.split('|')[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Pricing:</span>
                    <span className="text-[#94713A] font-semibold">{p.priceStarting}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono pt-1">
                    <span>RERA ID:</span>
                    <span>{p.reraNumber.replace('[Demo RERA No: ', '').replace(']', '')}</span>
                  </div>
                </div>

                {/* Buttons */}
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
          ))
        )}
      </section>
    </div>
  );
};

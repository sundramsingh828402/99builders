import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Search, Home, ArrowRight, Building, Compass, Phone } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigate, openSearchModal } = useNavigation();
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openSearchModal();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
      {/* Visual Indicator */}
      <div className="space-y-2">
        <span className="font-mono text-5xl sm:text-6xl font-bold text-[#94713A] tracking-widest block">
          404
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#12161A]">
          Page Not Located
        </h1>
        <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
          The architectural link or resource you requested may have been relocated, archived, or is temporarily
          undergoing maintenance.
        </p>
      </div>

      {/* Quick Search */}
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all 27 sections..."
            className="flex-1 px-3.5 py-2.5 text-xs border border-[#ECE8E1] rounded-sm focus:outline-hidden focus:border-[#94713A] bg-white"
          />
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Quick Links Directory */}
      <div className="pt-6 border-t border-[#ECE8E1] space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">
          Recommended Destinations
        </span>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="px-4 py-2 text-xs font-medium text-[#12161A] bg-[#F9F8F6] hover:bg-[#F3EFEA] rounded-sm transition-colors flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5 text-[#94713A]" />
            <span>Return to Home</span>
          </button>
          <button
            onClick={() => navigate('projects')}
            className="px-4 py-2 text-xs font-medium text-[#12161A] bg-[#F9F8F6] hover:bg-[#F3EFEA] rounded-sm transition-colors flex items-center gap-1.5"
          >
            <Building className="w-3.5 h-3.5 text-[#94713A]" />
            <span>All Projects Directory</span>
          </button>
          <button
            onClick={() => navigate('services')}
            className="px-4 py-2 text-xs font-medium text-[#12161A] bg-[#F9F8F6] hover:bg-[#F3EFEA] rounded-sm transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#94713A]" />
            <span>Construction Services</span>
          </button>
          <button
            onClick={() => navigate('contact')}
            className="px-4 py-2 text-xs font-medium text-[#12161A] bg-[#F9F8F6] hover:bg-[#F3EFEA] rounded-sm transition-colors flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-[#94713A]" />
            <span>Contact Headquarters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

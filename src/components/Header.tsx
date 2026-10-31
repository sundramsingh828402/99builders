import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { PageId } from '../types';
import { Search, Menu, X, ChevronDown, ArrowRight, Phone } from 'lucide-react';
import { COMPANY_INFO, PROJECTS } from '../data/mockData';

export const Header: React.FC = () => {
  const { currentPage, navigate, openSearchModal } = useNavigation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (page: PageId, options?: { projectId?: string; serviceId?: string; articleId?: string }) => {
    navigate(page, options);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <>
      {/* Top Bar following Top Bar Contract: Brand - 4-5 single-line links - 1 primary CTA */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs border-[#E5E2DC]'
            : 'bg-white border-[#ECE8E1]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single line, no clutter) */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B8935A] rounded-sm group shrink-0"
            aria-label="99 Builders Home"
          >
            <img
              src="/assets/aistudio/99logo_64777909.png"
              alt="99 Builders Logo"
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-wider text-[#12161A] whitespace-nowrap leading-tight">
                99 BUILDERS
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#94713A] font-semibold whitespace-nowrap">
                & Developers
              </span>
            </div>
          </button>

          {/* Zone 2: 4–5 Single-Line Nav Links with Subtle Hover */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#4A5568]">
            {/* Projects Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveDropdown('projects')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleNav('projects')}
                className={`flex items-center gap-1.5 transition-colors whitespace-nowrap hover:text-[#12161A] ${
                  ['projects', 'project-detail', 'residential', 'commercial'].includes(currentPage)
                    ? 'text-[#B8935A] font-semibold'
                    : ''
                }`}
              >
                <span>Projects</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {activeDropdown === 'projects' && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-lg shadow-xl border border-[#ECE8E1] p-3 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#94713A] px-3 py-1.5 border-b border-[#F0ECE6] mb-1">
                    Portfolios & Collections
                  </div>
                  <button
                    onClick={() => handleNav('projects')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#191F28] hover:bg-[#F9F8F6] rounded-md flex items-center justify-between"
                  >
                    <span>All Master Projects</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#94713A]" />
                  </button>
                  <button
                    onClick={() => handleNav('residential')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#191F28] hover:bg-[#F9F8F6] rounded-md flex items-center justify-between"
                  >
                    <span>Residential Residences</span>
                    <span className="text-[10px] text-gray-500">Sky Villas & Penthouses</span>
                  </button>
                  <button
                    onClick={() => handleNav('commercial')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#191F28] hover:bg-[#F9F8F6] rounded-md flex items-center justify-between"
                  >
                    <span>Commercial Parks & Towers</span>
                    <span className="text-[10px] text-gray-500">Grade-A Corporate</span>
                  </button>
                  <button
                    onClick={() => handleNav('locations')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#191F28] hover:bg-[#F9F8F6] rounded-md flex items-center justify-between"
                  >
                    <span>Project Locations</span>
                    <span className="text-[10px] text-gray-500">City Hubs & Map</span>
                  </button>
                </div>
              )}
            </div>

            {/* Services Link */}
            <button
              onClick={() => handleNav('services')}
              className={`transition-colors whitespace-nowrap hover:text-[#12161A] ${
                ['services', 'service-detail'].includes(currentPage) ? 'text-[#B8935A] font-semibold' : ''
              }`}
            >
              Services
            </button>

            {/* About Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleNav('about')}
                className={`flex items-center gap-1.5 transition-colors whitespace-nowrap hover:text-[#12161A] ${
                  ['about', 'profile', 'team', 'careers'].includes(currentPage)
                    ? 'text-[#B8935A] font-semibold'
                    : ''
                }`}
              >
                <span>About Us</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {activeDropdown === 'about' && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-xl border border-[#ECE8E1] p-3 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    onClick={() => handleNav('about')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#191F28] hover:bg-[#F9F8F6] rounded-md"
                  >
                    Overview & Heritage
                  </button>
                  <button
                    onClick={() => handleNav('profile')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#191F28] hover:bg-[#F9F8F6] rounded-md"
                  >
                    Company Profile & ISO 14001
                  </button>
                  <button
                    onClick={() => handleNav('team')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#191F28] hover:bg-[#F9F8F6] rounded-md"
                  >
                    Leadership & Architects
                  </button>
                  <button
                    onClick={() => handleNav('careers')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#191F28] hover:bg-[#F9F8F6] rounded-md"
                  >
                    Careers & Culture
                  </button>
                </div>
              )}
            </div>

            {/* Media Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveDropdown('media')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleNav('media-gallery')}
                className={`flex items-center gap-1.5 transition-colors whitespace-nowrap hover:text-[#12161A] ${
                  ['media-gallery', 'video-gallery', 'news', 'news-article', 'press', 'blog', 'events'].includes(
                    currentPage
                  )
                    ? 'text-[#B8935A] font-semibold'
                    : ''
                }`}
              >
                <span>Media & Insights</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {activeDropdown === 'media' && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-xl border border-[#ECE8E1] p-3 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    onClick={() => handleNav('media-gallery')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#191F28] hover:bg-[#F9F8F6] rounded-md"
                  >
                    Photo Gallery
                  </button>
                  <button
                    onClick={() => handleNav('video-gallery')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#191F28] hover:bg-[#F9F8F6] rounded-md"
                  >
                    Video Walkthroughs
                  </button>
                  <button
                    onClick={() => handleNav('news')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#191F28] hover:bg-[#F9F8F6] rounded-md"
                  >
                    News & Announcements
                  </button>
                  <button
                    onClick={() => handleNav('press')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#191F28] hover:bg-[#F9F8F6] rounded-md"
                  >
                    Press Releases
                  </button>
                  <button
                    onClick={() => handleNav('blog')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#191F28] hover:bg-[#F9F8F6] rounded-md"
                  >
                    Real Estate Insights
                  </button>
                  <button
                    onClick={() => handleNav('events')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#191F28] hover:bg-[#F9F8F6] rounded-md"
                  >
                    Events & Galas
                  </button>
                </div>
              )}
            </div>

            {/* Contact Nav */}
            <button
              onClick={() => handleNav('contact')}
              className={`transition-colors whitespace-nowrap hover:text-[#12161A] ${
                currentPage === 'contact' ? 'text-[#B8935A] font-semibold' : ''
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Quick Utilities */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search trigger */}
            <button
              onClick={openSearchModal}
              className="p-2 text-[#4A5568] hover:text-[#12161A] hover:bg-[#F7F5F0] rounded-lg transition-colors"
              title="Search website (Ctrl + K)"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNav('site-visit')}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm whitespace-nowrap shrink-0 shadow-xs flex items-center gap-2"
            >
              <span>Book Site Visit</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#12161A] hover:bg-[#F7F5F0] rounded-md"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#ECE8E1]">
              <div className="flex items-center gap-2">
                <img src="/assets/aistudio/99logo_64777909.png" alt="99 Builders Logo" className="h-9 w-auto" />
                <span className="font-heading text-base font-bold text-[#12161A]">99 BUILDERS</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-black rounded-md"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-1">
              <button
                onClick={() => handleNav('home')}
                className={`w-full text-left py-2.5 px-3 text-sm font-medium rounded-md ${
                  currentPage === 'home' ? 'bg-[#F4EFEA] text-[#94713A]' : 'text-gray-800'
                }`}
              >
                Home
              </button>

              <div className="pt-2 pb-1 text-[11px] font-semibold text-[#94713A] uppercase tracking-wider px-3">
                Properties & Portfolios
              </div>
              <button
                onClick={() => handleNav('projects')}
                className="w-full text-left py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                All Projects Master Directory
              </button>
              <button
                onClick={() => handleNav('residential')}
                className="w-full text-left py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Residential Sky Residences
              </button>
              <button
                onClick={() => handleNav('commercial')}
                className="w-full text-left py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Commercial Tech Parks
              </button>
              <button
                onClick={() => handleNav('locations')}
                className="w-full text-left py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Project Locations & Maps
              </button>

              <div className="pt-3 pb-1 text-[11px] font-semibold text-[#94713A] uppercase tracking-wider px-3">
                Engineering & Services
              </div>
              <button
                onClick={() => handleNav('services')}
                className="w-full text-left py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                All Construction Services
              </button>
              <button
                onClick={() => handleNav('service-detail', { serviceId: 'architecture-masterplanning' })}
                className="w-full text-left py-2 px-3 text-sm text-gray-600 hover:bg-gray-50 rounded-md pl-6"
              >
                Architectural Masterplanning
              </button>
              <button
                onClick={() => handleNav('service-detail', { serviceId: 'epc-general-contracting' })}
                className="w-full text-left py-2 px-3 text-sm text-gray-600 hover:bg-gray-50 rounded-md pl-6"
              >
                EPC General Contracting
              </button>

              <div className="pt-3 pb-1 text-[11px] font-semibold text-[#94713A] uppercase tracking-wider px-3">
                Corporate & Media
              </div>
              <button
                onClick={() => handleNav('about')}
                className="w-full text-left py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                About Us
              </button>
              <button
                onClick={() => handleNav('profile')}
                className="w-full text-left py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Company Profile & ISO 14001
              </button>
              <button
                onClick={() => handleNav('team')}
                className="w-full text-left py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Leadership & Architects
              </button>
              <button
                onClick={() => handleNav('media-gallery')}
                className="w-full text-left py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Photo Gallery
              </button>
              <button
                onClick={() => handleNav('video-gallery')}
                className="w-full text-left py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Video Gallery
              </button>
              <button
                onClick={() => handleNav('news')}
                className="w-full text-left py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                News & Press Releases
              </button>
              <button
                onClick={() => handleNav('blog')}
                className="w-full text-left py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Real Estate Insights
              </button>
              <button
                onClick={() => handleNav('events')}
                className="w-full text-left py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Events & Galas
              </button>
              <button
                onClick={() => handleNav('careers')}
                className="w-full text-left py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Careers
              </button>
              <button
                onClick={() => handleNav('faq')}
                className="w-full text-left py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                FAQ & Legal Info
              </button>
              <button
                onClick={() => handleNav('contact')}
                className="w-full text-left py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Contact Us
              </button>
            </div>

            <div className="mt-auto pt-6 border-t border-[#ECE8E1] space-y-3">
              <button
                onClick={() => handleNav('site-visit')}
                className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] rounded-sm text-center block"
              >
                Book a Site Visit
              </button>
              <button
                onClick={() => handleNav('download-brochure')}
                className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-[#12161A] border border-[#12161A] rounded-sm text-center block"
              >
                Download Master Brochure
              </button>
              <div className="text-center text-xs text-gray-500 pt-2 flex items-center justify-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#94713A]" />
                <span>{COMPANY_INFO.headquarters.phone}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

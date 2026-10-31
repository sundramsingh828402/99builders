import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useData } from '../context/DataContext';
import { LEADERSHIP } from '../data/mockData';
import { Search, X, ArrowRight, Building2, Briefcase, FileText, User, ExternalLink } from 'lucide-react';
import { PageId } from '../types';

interface SearchResult {
  title: string;
  category: 'Project' | 'Service' | 'Article' | 'Page' | 'Leadership';
  description: string;
  page: PageId;
  options?: { projectId?: string; serviceId?: string; articleId?: string };
}

const STATIC_PAGES: { title: string; desc: string; page: PageId }[] = [
  { title: 'Home', desc: 'Main corporate showcase, featured developments and hero preview', page: 'home' },
  { title: 'About Us', desc: 'Heritage, core principles, engineering legacy and achievements', page: 'about' },
  { title: 'Company Profile & ISO 14001', desc: 'Detailed environmental management, vision, and mission', page: 'profile' },
  { title: 'Leadership & Team', desc: 'Board of directors, executive committee, and lead architects', page: 'team' },
  { title: 'Our Projects Master Catalogue', desc: 'Explore all ongoing, completed, and upcoming landmarks', page: 'projects' },
  { title: 'Residential Sky Residences', desc: 'Ultra-luxury sky penthouses, villas, and apartments', page: 'residential' },
  { title: 'Commercial Tech Parks', desc: 'Grade-A corporate campuses and executive high-rise towers', page: 'commercial' },
  { title: 'Construction Services', desc: 'EPC turnkey contracting, architectural design, seismic engineering', page: 'services' },
  { title: 'Project Locations & Connectivity', desc: 'Interactive geographic maps and metropolitan hubs', page: 'locations' },
  { title: 'Media Gallery', desc: 'High-resolution architectural photography', page: 'media-gallery' },
  { title: 'Video Gallery', desc: 'Cinematic project tours, drone scans, and timelapses', page: 'video-gallery' },
  { title: 'News & Updates', desc: 'Corporate announcements, groundbreakings, awards', page: 'news' },
  { title: 'Press Releases', desc: 'Official corporate media statements and press coverage', page: 'press' },
  { title: 'Real Estate Insights Blog', desc: 'Market analysis, buyer guides, and green building tech', page: 'blog' },
  { title: 'Events & Galas', desc: 'Exclusive preview galas, open houses, and expos', page: 'events' },
  { title: 'Careers at 99 Builders', desc: 'Join our civil engineering and architectural teams', page: 'careers' },
  { title: 'Contact Us', desc: 'Corporate headquarters, sales galleries, and direct enquiry', page: 'contact' },
  { title: 'Book a Site Visit', desc: 'Schedule private on-site inspection with chauffeur pickup', page: 'site-visit' },
  { title: 'Download Project Brochure', desc: 'Official digital architectural monographs and floor plans', page: 'download-brochure' },
  { title: 'Frequently Asked Questions (FAQ)', desc: 'Answers for buyers, tenants, NRI investors, and RERA', page: 'faq' },
  { title: 'Privacy Policy', desc: 'Corporate privacy and GDPR compliance documentation', page: 'privacy' },
  { title: 'Terms & Conditions', desc: 'Statutory booking terms and digital conditions', page: 'terms' },
  { title: 'Disclaimer', desc: 'RERA legal notices and architectural rendering disclaimer', page: 'disclaimer' },
];

export const GlobalSearchModal: React.FC = () => {
  const { isSearchModalOpen, closeSearchModal, navigate } = useNavigation();
  const { projects, services, articles } = useData();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isSearchModalOpen ? closeSearchModal() : (window as any)._openSearchModal?.();
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        closeSearchModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, closeSearchModal]);

  if (!isSearchModalOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Aggregate search results
  const results: SearchResult[] = [];

  if (cleanQuery.length > 0) {
    // Projects
    projects.forEach((p) => {
      if (
        p.title.toLowerCase().includes(cleanQuery) ||
        p.location.toLowerCase().includes(cleanQuery) ||
        p.subCategory.toLowerCase().includes(cleanQuery)
      ) {
        results.push({
          title: p.title,
          category: 'Project',
          description: `${p.subCategory} · ${p.location}`,
          page: 'project-detail',
          options: { projectId: p.id },
        });
      }
    });

    // Services
    services.forEach((s) => {
      if (s.title.toLowerCase().includes(cleanQuery) || s.shortDesc.toLowerCase().includes(cleanQuery)) {
        results.push({
          title: s.title,
          category: 'Service',
          description: s.shortDesc,
          page: 'service-detail',
          options: { serviceId: s.id },
        });
      }
    });

    // Static pages
    STATIC_PAGES.forEach((sp) => {
      if (sp.title.toLowerCase().includes(cleanQuery) || sp.desc.toLowerCase().includes(cleanQuery)) {
        results.push({
          title: sp.title,
          category: 'Page',
          description: sp.desc,
          page: sp.page,
        });
      }
    });

    // Articles & Blog
    articles.forEach((a) => {
      if (a.title.toLowerCase().includes(cleanQuery) || a.summary.toLowerCase().includes(cleanQuery)) {
        results.push({
          title: a.title,
          category: 'Article',
          description: a.summary,
          page: 'news-article',
          options: { articleId: a.id },
        });
      }
    });

    // Leadership
    LEADERSHIP.forEach((l) => {
      if (l.name.toLowerCase().includes(cleanQuery) || l.role.toLowerCase().includes(cleanQuery)) {
        results.push({
          title: `${l.name} — ${l.role}`,
          category: 'Leadership',
          description: l.bio,
          page: 'team',
        });
      }
    });
  }

  const handleSelect = (r: SearchResult) => {
    navigate(r.page, r.options);
    closeSearchModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 md:p-12 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-[#ECE8E1] overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#ECE8E1] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#94713A] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, services, articles, or any of the 27 pages..."
            className="w-full text-sm text-[#12161A] placeholder-gray-400 bg-transparent focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-gray-400 hover:text-black px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={closeSearchModal}
            className="p-1.5 text-gray-400 hover:text-black rounded-sm"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-[#F1EFEA]">
          {cleanQuery.length === 0 ? (
            <div className="py-8 text-center space-y-4">
              <p className="text-xs text-gray-400 font-medium">
                Quickly discover any section of the 99 Builders portal
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
                <button
                  onClick={() => {
                    navigate('projects');
                    closeSearchModal();
                  }}
                  className="px-3 py-1.5 text-xs bg-[#F9F8F6] hover:bg-[#F3EFEA] text-[#191F28] rounded-md transition-colors"
                >
                  Featured Projects
                </button>
                <button
                  onClick={() => {
                    navigate('services');
                    closeSearchModal();
                  }}
                  className="px-3 py-1.5 text-xs bg-[#F9F8F6] hover:bg-[#F3EFEA] text-[#191F28] rounded-md transition-colors"
                >
                  EPC Contracting
                </button>
                <button
                  onClick={() => {
                    navigate('site-visit');
                    closeSearchModal();
                  }}
                  className="px-3 py-1.5 text-xs bg-[#F9F8F6] hover:bg-[#F3EFEA] text-[#191F28] rounded-md transition-colors"
                >
                  Book Site Visit
                </button>
                <button
                  onClick={() => {
                    navigate('profile');
                    closeSearchModal();
                  }}
                  className="px-3 py-1.5 text-xs bg-[#F9F8F6] hover:bg-[#F3EFEA] text-[#191F28] rounded-md transition-colors"
                >
                  ISO 14001 Standards
                </button>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-500">
              No results found for &ldquo;{query}&rdquo;. Try searching for &ldquo;Aurora&rdquo;, &ldquo;EPC&rdquo;, &ldquo;Brochure&rdquo;, or &ldquo;Careers&rdquo;.
            </div>
          ) : (
            results.map((r, i) => (
              <button
                key={i}
                onClick={() => handleSelect(r)}
                className="w-full text-left py-3 px-3 hover:bg-[#F9F8F6] rounded-md transition-colors flex items-center justify-between group"
              >
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-semibold text-[#94713A]">
                      {r.category}
                    </span>
                    <span className="text-xs font-semibold text-[#12161A] group-hover:text-[#94713A] transition-colors">
                      {r.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{r.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#94713A] transition-colors shrink-0" />
              </button>
            ))
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-[#F9F8F6] border-t border-[#ECE8E1] text-[11px] text-gray-500 flex items-center justify-between">
          <span>Tip: Press ESC to exit or click any item to jump instantly</span>
          <span className="font-mono tabular-nums">27 Corporate Pages Indexed</span>
        </div>
      </div>
    </div>
  );
};

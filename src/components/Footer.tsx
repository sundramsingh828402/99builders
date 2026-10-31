import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { COMPANY_INFO } from '../data/mockData';
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PageId } from '../types';

export const Footer: React.FC = () => {
  const { navigate } = useNavigation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid corporate or personal email address.');
      return;
    }
    setError('');
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  const nav = (page: PageId, options?: { projectId?: string; serviceId?: string; articleId?: string }) => {
    navigate(page, options);
  };

  return (
    <footer className="bg-[#12161A] text-[#A0AEC0] border-t border-[#232B32] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Corporate Summary & Newsletter Bar */}
        <div className="pb-12 border-b border-[#232B32] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/99logo_64777909.png"
                alt="99 Builders Logo"
                className="h-14 w-auto object-contain bg-white/10 p-1 rounded-sm"
              />
              <div>
                <h3 className="font-heading text-xl font-bold tracking-wider text-white">
                  99 BUILDERS & DEVELOPERS
                </h3>
                <p className="text-xs text-[#C5A880] font-medium tracking-wide">
                  An ISO 14001:2015 Certified Construction & Real Estate Group
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
              Engineering world-class residential towers, masterplanned luxury communities, and Grade-A sustainable
              commercial campuses with institutional precision, environmental stewardship, and architectural elegance.
            </p>
          </div>

          <div className="lg:col-span-6 bg-[#1A202C] p-6 rounded-lg border border-[#2D3748]">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
              Privileged Investor & Buyer Journal
            </h4>
            <p className="text-xs text-gray-400 mb-4">
              Receive quarterly construction progress reports, off-market penthouse releases, and real estate market insights.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-950/40 border border-emerald-700/50 rounded-sm text-emerald-300 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thank you. You have been enrolled in our privileged investor communications.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-2.5 text-xs text-white bg-[#12161A] border border-[#4A5568] rounded-sm focus:outline-hidden focus:border-[#C5A880]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#12161A] bg-[#C5A880] hover:bg-[#D4BC98] transition-colors rounded-sm whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {error && <p className="text-[11px] text-red-400">{error}</p>}
              </form>
            )}
          </div>
        </div>

        {/* Directory Grid - Covering all 27 pages */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-xs">
          {/* Column 1: Properties */}
          <div className="space-y-3">
            <h5 className="font-semibold text-white tracking-wider uppercase text-[11px] border-b border-[#232B32] pb-2">
              Properties
            </h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => nav('projects')} className="hover:text-white transition-colors text-left">
                  All Master Projects
                </button>
              </li>
              <li>
                <button onClick={() => nav('residential')} className="hover:text-white transition-colors text-left">
                  Residential Residences
                </button>
              </li>
              <li>
                <button onClick={() => nav('commercial')} className="hover:text-white transition-colors text-left">
                  Commercial Tech Parks
                </button>
              </li>
              <li>
                <button onClick={() => nav('locations')} className="hover:text-white transition-colors text-left">
                  Project Locations & Maps
                </button>
              </li>
              <li>
                <button onClick={() => nav('site-visit')} className="hover:text-[#C5A880] font-medium transition-colors text-left">
                  Book a Site Visit
                </button>
              </li>
              <li>
                <button onClick={() => nav('download-brochure')} className="hover:text-white transition-colors text-left">
                  Download Project Brochure
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Construction Services */}
          <div className="space-y-3">
            <h5 className="font-semibold text-white tracking-wider uppercase text-[11px] border-b border-[#232B32] pb-2">
              Construction Services
            </h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => nav('services')} className="hover:text-white transition-colors text-left">
                  Services Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav('service-detail', { serviceId: 'architecture-masterplanning' })}
                  className="hover:text-white transition-colors text-left"
                >
                  Architecture & Masterplanning
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav('service-detail', { serviceId: 'epc-general-contracting' })}
                  className="hover:text-white transition-colors text-left"
                >
                  EPC General Contracting
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav('service-detail', { serviceId: 'structural-engineering' })}
                  className="hover:text-white transition-colors text-left"
                >
                  Structural & Seismic Engineering
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav('service-detail', { serviceId: 'green-building-sustainability' })}
                  className="hover:text-white transition-colors text-left"
                >
                  Sustainable Green Building
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav('service-detail', { serviceId: 'interior-design-fitouts' })}
                  className="hover:text-white transition-colors text-left"
                >
                  Interior Architecture & Fit-Outs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Corporate */}
          <div className="space-y-3">
            <h5 className="font-semibold text-white tracking-wider uppercase text-[11px] border-b border-[#232B32] pb-2">
              Company
            </h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => nav('about')} className="hover:text-white transition-colors text-left">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => nav('profile')} className="hover:text-white transition-colors text-left">
                  Company Profile & Quality
                </button>
              </li>
              <li>
                <button onClick={() => nav('team')} className="hover:text-white transition-colors text-left">
                  Leadership & Architects
                </button>
              </li>
              <li>
                <button onClick={() => nav('careers')} className="hover:text-white transition-colors text-left">
                  Careers & Open Positions
                </button>
              </li>
              <li>
                <button onClick={() => nav('faq')} className="hover:text-white transition-colors text-left">
                  FAQ & Homebuyer Guide
                </button>
              </li>
              <li>
                <button onClick={() => nav('contact')} className="hover:text-white transition-colors text-left">
                  Contact & Sales Galleries
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Media & Insights */}
          <div className="space-y-3">
            <h5 className="font-semibold text-white tracking-wider uppercase text-[11px] border-b border-[#232B32] pb-2">
              Media & Insights
            </h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => nav('media-gallery')} className="hover:text-white transition-colors text-left">
                  Photo Gallery
                </button>
              </li>
              <li>
                <button onClick={() => nav('video-gallery')} className="hover:text-white transition-colors text-left">
                  Video Gallery & Drone Tours
                </button>
              </li>
              <li>
                <button onClick={() => nav('news')} className="hover:text-white transition-colors text-left">
                  News & Corporate Updates
                </button>
              </li>
              <li>
                <button onClick={() => nav('press')} className="hover:text-white transition-colors text-left">
                  Press Releases & Kits
                </button>
              </li>
              <li>
                <button onClick={() => nav('blog')} className="hover:text-white transition-colors text-left">
                  Real Estate Insights Blog
                </button>
              </li>
              <li>
                <button onClick={() => nav('events')} className="hover:text-white transition-colors text-left">
                  Events, Expos & Galas
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Headquarters & Contact */}
          <div className="space-y-3 col-span-2 md:col-span-1">
            <h5 className="font-semibold text-white tracking-wider uppercase text-[11px] border-b border-[#232B32] pb-2">
              Headquarters
            </h5>
            <div className="space-y-2.5 text-gray-400 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.headquarters.address}, {COMPANY_INFO.headquarters.city} - {COMPANY_INFO.headquarters.pin}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span className="font-mono tabular-nums">{COMPANY_INFO.headquarters.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>{COMPANY_INFO.headquarters.email}</span>
              </div>
              <div className="pt-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1A202C] rounded-sm text-[11px] text-[#C5A880] border border-[#2D3748]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>ISO 14001:2015 Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Notice & Statutory RERA Advisory */}
        <div className="py-6 border-t border-[#232B32] text-[11px] text-gray-500 leading-relaxed space-y-2">
          <p>
            <strong className="text-gray-400">Notice for Evaluation:</strong> All projects, photographs, videos, floor plans,
            specifications, and RERA registration markers listed on this portal represent demo architectural showcases
            prepared for website evaluation. In actual commercial deployment, statutory approvals, sanctioned building plans,
            and verified RERA registration certificates are published in accordance with local municipal real estate laws.
          </p>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-6 border-t border-[#1F2630] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} 99 Builders & Developers. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => nav('privacy')} className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => nav('terms')} className="hover:text-gray-300 transition-colors">
              Terms & Conditions
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => nav('disclaimer')} className="hover:text-gray-300 transition-colors">
              Disclaimer
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => nav('not-found')} className="hover:text-gray-300 transition-colors">
              404 Page
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => nav('admin-login')} className="hover:text-[#C5A880] transition-colors font-medium">
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

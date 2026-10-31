import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useData } from '../context/DataContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { COMPANY_INFO } from '../data/mockData';
import { api } from '../services/api';
import {
  MapPin,
  Calendar,
  Download,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Building,
  Layers,
  Sparkles,
  Play,
  ArrowRight,
  ExternalLink,
  Clock,
  Compass,
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { currentProjectId, navigate, openEnquiryModal, openBrochureModal } = useNavigation();
  const { getProject, projects } = useData();

  // Find project
  const project = getProject(currentProjectId || 'aurora-sky-villas') || projects[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'specifications' | 'amenities' | 'location' | 'rera'>('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Quick enquiry in-page form state
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquirySent, setEnquirySent] = useState(false);

  const relatedProjects = projects.filter((p) => p.id !== project.id).slice(0, 3);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleQuickEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryName || !enquiryPhone) return;
    try {
      await api.submitEnquiry({
        form_type: 'project_quick_enquiry',
        name: enquiryName.trim(),
        email: 'quick-lead@99builders-client.com',
        phone: enquiryPhone.trim(),
        project_id: project.id,
        subject: `Quick Project Enquiry: ${project.title}`,
        message: `Quick enquiry submitted directly from ${project.title} detail page.`,
      });
      setEnquirySent(true);
      setTimeout(() => setEnquirySent(false), 5000);
    } catch (err) {
      setEnquirySent(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs
        items={[
          { label: 'Projects', page: 'projects' },
          { label: project.category === 'residential' ? 'Residential' : 'Commercial', page: project.category === 'residential' ? 'residential' : 'commercial' },
          { label: project.title },
        ]}
      />

      {/* Hero Banner Header */}
      <section className="bg-white rounded-lg border border-[#ECE8E1] p-6 lg:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#ECE8E1] pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#94713A]">
              <span>{project.subCategory}</span>
              <span aria-hidden="true">·</span>
              <span className="text-gray-500">{project.cityHub}</span>
              <span aria-hidden="true">·</span>
              <span className="px-2 py-0.5 bg-[#F4EFEA] text-[#12161A] rounded-xs font-mono">
                {project.status.toUpperCase()}
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12161A]">
              {project.title}
            </h1>
            <p className="text-sm text-gray-600 max-w-2xl">{project.tagline}</p>
          </div>

          <div className="space-y-2 text-left lg:text-right">
            <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">Investment Guidance</div>
            <div className="text-2xl sm:text-3xl font-heading font-bold text-[#12161A]">
              {project.priceStarting}
            </div>
            <div className="text-xs text-gray-500">{project.unitsOrArea}</div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('site-visit')}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#C5A880]" />
              <span>Book Site Visit</span>
            </button>
            <button
              onClick={() => openBrochureModal(project.id)}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#12161A] border border-[#12161A] hover:bg-gray-50 transition-colors rounded-sm flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Approved Brochure</span>
            </button>
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#94713A] border border-[#ECE8E1] hover:bg-[#F9F8F6] transition-colors rounded-sm flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Virtual Tour</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3.5 py-2.5 text-xs text-gray-600 border border-[#ECE8E1] hover:bg-gray-50 rounded-sm transition-colors flex items-center gap-1.5"
              title="Share Project Link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={() => openEnquiryModal(`Enquiry: ${project.title}`)}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#12161A] bg-[#C5A880] hover:bg-[#D4BC98] transition-colors rounded-sm cursor-pointer"
            >
              Enquire
            </button>
          </div>
        </div>
      </section>

      {/* Main Image Gallery Showcase */}
      <section className="space-y-4">
        {/* Main selected image */}
        <div className="relative aspect-16/9 rounded-lg overflow-hidden bg-gray-100 shadow-md">
          <img
            src={project.gallery[selectedImageIndex] || project.heroImage}
            alt={`${project.title} - View ${selectedImageIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-sm text-xs text-white">
            Photo {selectedImageIndex + 1} of {project.gallery.length} · {project.architectureFirm}
          </div>
          {project.overallProgress !== undefined && (
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-sm text-xs font-mono text-[#C5A880]">
              Overall Progress: {project.overallProgress}%
            </div>
          )}
        </div>

        {/* Thumbnails row */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {project.gallery.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`relative w-24 h-16 rounded-sm overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                selectedImageIndex === idx ? 'border-[#94713A] scale-102 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </button>
          ))}
        </div>
      </section>

      {/* Main Details & Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Tabbed Information */}
        <div className="lg:col-span-8 space-y-8">
          {/* Tabs navigation */}
          <div className="flex items-center gap-2 border-b border-[#ECE8E1] overflow-x-auto pb-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2.5 px-4 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-b-2 border-[#94713A] text-[#94713A]'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Overview & Architecture
            </button>
            <button
              onClick={() => setActiveTab('milestones')}
              className={`py-2.5 px-4 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'milestones'
                  ? 'border-b-2 border-[#94713A] text-[#94713A]'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Construction Milestones ({project.milestones.length})
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`py-2.5 px-4 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'specifications'
                  ? 'border-b-2 border-[#94713A] text-[#94713A]'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Specifications & Materials
            </button>
            <button
              onClick={() => setActiveTab('amenities')}
              className={`py-2.5 px-4 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'amenities'
                  ? 'border-b-2 border-[#94713A] text-[#94713A]'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Luxury Amenities ({project.amenities.length})
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`py-2.5 px-4 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'location'
                  ? 'border-b-2 border-[#94713A] text-[#94713A]'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Location & Connectivity
            </button>
            <button
              onClick={() => setActiveTab('rera')}
              className={`py-2.5 px-4 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'rera'
                  ? 'border-b-2 border-[#94713A] text-[#94713A]'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              RERA & Statutory Dossier
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6 text-sm text-gray-700 leading-relaxed animate-in fade-in duration-150">
              <h2 className="font-heading text-2xl font-bold text-[#12161A]">Architectural Narrative</h2>
              <p>{project.overview}</p>

              <div className="p-6 bg-[#F9F8F6] rounded-lg border border-[#ECE8E1] space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94713A]">
                  Collaborative Architectural Masterplanning
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Conceived by <strong>{project.architectureFirm}</strong> in partnership with 99 Builders Civil
                  Engineering Atelier. Designed with thermal mass calculations, wind tunnel aerodynamics, and biophilic
                  terrace micro-climates.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-[#12161A]">
                  <div>Target Handover: {project.possessionDate}</div>
                  <span>·</span>
                  <div>Environmental Standard: ISO 14001:2015</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Construction Milestones */}
          {activeTab === 'milestones' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-[#12161A]">Construction Progress Tracker</h2>
                  <p className="text-xs text-gray-500">Live verified milestones updated monthly via drone photogrammetry</p>
                </div>
                {project.overallProgress !== undefined && (
                  <div className="text-right">
                    <span className="text-2xl font-mono font-bold text-[#94713A]">{project.overallProgress}%</span>
                    <span className="text-[11px] text-gray-500 block">Overall Completion</span>
                  </div>
                )}
              </div>

              <div className="border-l-2 border-[#ECE8E1] pl-6 ml-3 space-y-6">
                {project.milestones.map((m, idx) => (
                  <div key={idx} className="relative space-y-2">
                    <div
                      className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        m.status === 'completed'
                          ? 'bg-emerald-600'
                          : m.status === 'in-progress'
                          ? 'bg-[#94713A]'
                          : 'bg-gray-300'
                      }`}
                    />
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#12161A] text-sm">{m.stage}</span>
                      <span
                        className={`font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-xs ${
                          m.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : m.status === 'in-progress'
                            ? 'bg-[#F4EFEA] text-[#94713A]'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Timeline: {m.date}</span>
                      <span className="font-mono">{m.progressPercent}% Completed</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          m.status === 'completed' ? 'bg-emerald-600' : 'bg-[#94713A]'
                        }`}
                        style={{ width: `${m.progressPercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Specifications */}
          {activeTab === 'specifications' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <h2 className="font-heading text-2xl font-bold text-[#12161A]">Engineering & Material Specifications</h2>
              <div className="space-y-6">
                {project.specifications.map((spec, i) => (
                  <div key={i} className="p-6 bg-white rounded-lg border border-[#ECE8E1] space-y-3">
                    <h3 className="font-heading text-base font-bold text-[#94713A] uppercase tracking-wide">
                      {spec.category}
                    </h3>
                    <ul className="space-y-2 text-xs text-gray-700">
                      {spec.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#94713A] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Amenities */}
          {activeTab === 'amenities' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <h2 className="font-heading text-2xl font-bold text-[#12161A]">Curated Lifestyle Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.amenities.map((amenity, i) => (
                  <div key={i} className="p-5 bg-white rounded-lg border border-[#ECE8E1] space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#94713A]" />
                      <h4 className="text-xs font-bold text-[#12161A] uppercase tracking-wide">{amenity.name}</h4>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{amenity.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Location & Connectivity */}
          {activeTab === 'location' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <h2 className="font-heading text-2xl font-bold text-[#12161A]">Location & Connectivity Matrix</h2>
              <div className="p-6 bg-white rounded-lg border border-[#ECE8E1] space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#94713A] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#12161A]">{project.location}</h4>
                    <p className="text-xs text-gray-500">Zoned within the prestigious {project.cityHub}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#ECE8E1] text-xs">
                  <div>
                    <span className="text-gray-400 block text-[11px]">International Airport</span>
                    <strong className="text-[#12161A] font-mono">22 Mins</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Central Business District</span>
                    <strong className="text-[#12161A] font-mono">10 Mins</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Metro Station</span>
                    <strong className="text-[#12161A] font-mono">350 Meters</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Super-Specialty Hospital</span>
                    <strong className="text-[#12161A] font-mono">8 Mins</strong>
                  </div>
                </div>
              </div>

              {/* Styled Map Container Representation */}
              <div className="relative aspect-21/9 bg-[#E5DFD5] rounded-lg overflow-hidden border border-[#ECE8E1] flex items-center justify-center p-6 text-center">
                <div className="space-y-2">
                  <Compass className="w-8 h-8 text-[#94713A] mx-auto" />
                  <div className="text-xs font-bold text-[#12161A]">Geographic Map View · {project.location}</div>
                  <p className="text-[11px] text-gray-600 max-w-sm mx-auto">
                    Direct expressway access via 8-lane arterial corridors with dedicated VIP entry portals.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: RERA & Legal Dossier */}
          {activeTab === 'rera' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <h2 className="font-heading text-2xl font-bold text-[#12161A]">Verified Statutory RERA Information</h2>
              <div className="p-6 bg-white rounded-lg border border-[#ECE8E1] space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#94713A] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Statutory Registration Identifier</span>
                </div>
                <div className="text-base font-mono font-bold text-[#12161A] bg-[#F9F8F6] p-3 rounded-sm border border-[#ECE8E1]">
                  {project.reraNumber}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  In accordance with statutory real estate regulatory requirements, 70% of all funds collected from
                  buyers are deposited into an exclusive escrow bank account dedicated to civil construction. Sanctioned
                  building permits, environmental clearances, and title ownership deeds are open for inspection at our
                  experience center.
                </p>
                <div className="pt-2 text-[11px] text-gray-400">
                  *Notice: The above RERA number is a demo identifier for architectural evaluation.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Direct Lead & Consultation Sidebar */}
        <div className="lg:col-span-4 space-y-6 sticky top-28">
          <div className="p-6 bg-white rounded-lg border border-[#ECE8E1] shadow-xs space-y-4">
            <h3 className="font-heading text-base font-bold text-[#12161A]">
              Connect with Senior Sales Director
            </h3>
            <p className="text-xs text-gray-500">
              Receive the complete floor plan dossier, price breakdown, and unit availability matrix for {project.title}.
            </p>

            {enquirySent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-sm text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <h4 className="text-xs font-bold text-emerald-800">Enquiry Dispatched</h4>
                <p className="text-[11px] text-emerald-700">
                  A relationship director will reach out to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuickEnquiry} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={enquiryName}
                    onChange={(e) => setEnquiryName(e.target.value)}
                    placeholder="e.g. Robert Hastings"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">Mobile / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={enquiryPhone}
                    onChange={(e) => setEnquiryPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm cursor-pointer"
                >
                  Request Detailed Pricing
                </button>
              </form>
            )}

            <div className="pt-3 border-t border-[#ECE8E1] text-[11px] text-gray-500 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#94713A]" />
                <span>Zero Spam Guarantee</span>
              </div>
              <div>Sales Desk: {COMPANY_INFO.headquarters.phone}</div>
            </div>
          </div>

          {/* Quick Brochure Card */}
          <div className="p-5 bg-[#F9F8F6] rounded-lg border border-[#ECE8E1] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#12161A]">
              Official Project Monograph
            </h4>
            <p className="text-xs text-gray-600">
              Download high-resolution architectural elevations, penthouse plans, and landscape schematics.
            </p>
            <button
              onClick={() => openBrochureModal(project.id)}
              className="w-full py-2 text-xs font-semibold uppercase tracking-wider text-[#12161A] border border-[#12161A] hover:bg-white rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Monograph (PDF)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Related Projects Showcase */}
      <section className="pt-8 border-t border-[#ECE8E1] space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-[#12161A]">Related Landmark Developments</h2>
          <button
            onClick={() => navigate('projects')}
            className="text-xs font-semibold text-[#94713A] hover:underline flex items-center gap-1"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedProjects.map((rp) => (
            <div
              key={rp.id}
              onClick={() => navigate('project-detail', { projectId: rp.id })}
              className="bg-white rounded-lg border border-[#ECE8E1] overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="aspect-16/10 overflow-hidden relative">
                <img
                  src={rp.heroImage}
                  alt={rp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-[#12161A]/80 text-white text-[9px] uppercase px-2 py-0.5 rounded-xs font-semibold">
                  {rp.subCategory}
                </div>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-heading text-sm font-bold text-[#12161A] group-hover:text-[#94713A] transition-colors truncate">
                  {rp.title}
                </h3>
                <div className="text-xs text-gray-500">{rp.location}</div>
                <div className="text-xs font-semibold text-[#94713A] pt-1">{rp.priceStarting}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Virtual Tour Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 text-white bg-black/60 hover:bg-white hover:text-black p-2 rounded-full transition-colors"
              aria-label="Close Tour"
            >
              ✕
            </button>
            <div className="aspect-16/9 w-full">
              <iframe
                src={project.videoTourUrl}
                title={`${project.title} Tour`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 bg-[#12161A] text-white flex items-center justify-between text-xs">
              <div>
                <span className="font-bold">{project.title}</span> — Official Architectural Walkthrough
              </div>
              <button
                onClick={() => {
                  setIsVideoModalOpen(false);
                  navigate('site-visit');
                }}
                className="text-[#C5A880] hover:underline font-semibold"
              >
                Book Physical On-Site Visit →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

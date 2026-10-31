import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { COMPANY_INFO, LEADERSHIP } from '../data/mockData';
import { ShieldCheck, Award, Target, HeartHandshake, Eye, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      {/* Hero Header */}
      <section className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
          <span>Institutional Legacy</span>
          <span aria-hidden="true">·</span>
          <span>Since {COMPANY_INFO.foundedYear}</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A] text-balance">
          Pioneering Civil Engineering & Sustainable Real Estate
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          For nearly two decades, 99 Builders & Developers has shaped metropolitan skylines with iconic residential
          landmarks, modern corporate hubs, and uncompromising structural integrity.
        </p>
      </section>

      {/* Heritage Story Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-4 text-sm text-gray-600 leading-relaxed">
          <h2 className="font-heading text-2xl font-bold text-[#12161A]">
            From Specialized Structural Contractor to Integrated Real Estate Group
          </h2>
          <p>
            Established in 2008 by civil engineering visionaries, 99 Builders began with an obsession for high-strength
            structural concrete, seismic endurance, and institutional safety. While others relied on fragmented
            subcontractors, we built our own batching plants, fleet of tower cranes, and in-house testing laboratories.
          </p>
          <p>
            This integrated mastery allowed us to transition seamlessly into premier real estate development. Today, we
            conceive, engineer, construct, and manage some of the country&apos;s most sought-after addresses — each
            backed by our audited ISO 14001:2015 environmental certification.
          </p>
          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={() => navigate('profile')}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm inline-flex items-center gap-2"
            >
              <span>View Full Company Profile</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
            </button>
            <button
              onClick={() => navigate('team')}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#12161A] border border-[#12161A] hover:bg-gray-50 transition-colors rounded-sm"
            >
              <span>Meet Leadership</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 relative aspect-4/3 rounded-lg overflow-hidden shadow-lg border border-[#ECE8E1]">
          <img
            src="/assets/aistudio/99_builder_1_54aea51f.jpeg"
            alt="99 Builders Leadership & Engineering Team Receiving Corporate Excellence Trophy"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white text-xs space-y-1">
            <span className="text-[#C5A880] uppercase tracking-wider font-semibold block">
              Verified Corporate Milestone
            </span>
            <p className="font-medium text-white/95">
              99 Builders & Developers leadership and project directors receiving the Corporate Excellence Trophy.
            </p>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="bg-[#F9F8F6] p-8 lg:p-12 rounded-lg border border-[#ECE8E1] space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#94713A]">Guiding Principles</span>
          <h2 className="font-heading text-3xl font-bold text-[#12161A]">Our Vision, Mission & Values</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg border border-[#ECE8E1] space-y-3">
            <div className="w-10 h-10 rounded-sm bg-[#F4EFEA] text-[#94713A] flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-base font-bold text-[#12161A]">Our Vision</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              To be the premier benchmark of architectural elegance, structural resilience, and environmental
              stewardship in international real estate development.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-[#ECE8E1] space-y-3">
            <div className="w-10 h-10 rounded-sm bg-[#F4EFEA] text-[#94713A] flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-base font-bold text-[#12161A]">Our Mission</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              To engineer sustainable sanctuaries and vibrant corporate districts that elevate human well-being, protect
              natural ecosystems, and deliver lasting capital appreciation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-[#ECE8E1] space-y-3">
            <div className="w-10 h-10 rounded-sm bg-[#F4EFEA] text-[#94713A] flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-base font-bold text-[#12161A]">Our Core Values</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Integrity in statutory compliance, unyielding civil precision, circular green construction, and
              unconditional transparency with our homeowners and partners.
            </p>
          </div>
        </div>
      </section>

      {/* Historical Milestones Timeline */}
      <section className="space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#94713A]">The Journey</span>
          <h2 className="font-heading text-3xl font-bold text-[#12161A]">Key Milestones of Excellence</h2>
        </div>

        <div className="border-l-2 border-[#ECE8E1] pl-6 ml-3 space-y-8">
          <div className="relative space-y-1">
            <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#94713A] border-2 border-white" />
            <span className="text-xs font-bold font-mono text-[#94713A]">2008</span>
            <h4 className="font-heading text-base font-bold text-[#12161A]">Incorporation & First Infrastructure Contract</h4>
            <p className="text-xs text-gray-600 max-w-xl">
              Founded as a specialized civil contracting firm, executing heavy deep foundation piling and post-tensioned
              structures.
            </p>
          </div>

          <div className="relative space-y-1">
            <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#94713A] border-2 border-white" />
            <span className="text-xs font-bold font-mono text-[#94713A]">2014</span>
            <h4 className="font-heading text-base font-bold text-[#12161A]">Launch of Sovereign Luxury Residences Division</h4>
            <p className="text-xs text-gray-600 max-w-xl">
              Transitioned into end-to-end masterplanned residential developments, introducing double-height balconies and
              imported marble living spaces.
            </p>
          </div>

          <div className="relative space-y-1">
            <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#94713A] border-2 border-white" />
            <span className="text-xs font-bold font-mono text-[#94713A]">2017</span>
            <h4 className="font-heading text-base font-bold text-[#12161A]">Accredited with ISO 14001:2015 Certification</h4>
            <p className="text-xs text-gray-600 max-w-xl">
              Formalized our group environmental management systems, achieving 100% on-site rainwater recycling and zero
              hazardous construction landfill waste.
            </p>
          </div>

          <div className="relative space-y-1">
            <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#94713A] border-2 border-white" />
            <span className="text-xs font-bold font-mono text-[#94713A]">2022</span>
            <h4 className="font-heading text-base font-bold text-[#12161A]">Commercial Grade-A Expansion</h4>
            <p className="text-xs text-gray-600 max-w-xl">
              Groundbreaking of Meridian Nexus Tech Park, delivering 1.8M sq.ft of LEED Platinum institutional workplace
              for multinational technology leaders.
            </p>
          </div>

          <div className="relative space-y-1">
            <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#94713A] border-2 border-white" />
            <span className="text-xs font-bold font-mono text-[#94713A]">2026</span>
            <h4 className="font-heading text-base font-bold text-[#12161A]">Summit of Aurora Sky Residences (52 Storeys)</h4>
            <p className="text-xs text-gray-600 max-w-xl">
              Completed structural top-out of our flagship 210-meter skyscraper along the Skyline Promenade, marking over
              14.8M sq.ft of total delivered space.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

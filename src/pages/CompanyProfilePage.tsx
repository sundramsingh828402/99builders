import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { COMPANY_INFO } from '../data/mockData';
import { ShieldCheck, Download, CheckCircle2, Leaf, HardHat, FileCheck, Award, Factory } from 'lucide-react';

export const CompanyProfilePage: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadProfile = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);

      const blob = new Blob(
        [
          `99 BUILDERS & DEVELOPERS — CORPORATE PROFILE & QUALITY DOSSIER\n` +
            `=================================================================\n` +
            `Company Name: ${COMPANY_INFO.name}\n` +
            `Tagline: ${COMPANY_INFO.tagline}\n` +
            `ISO Accreditation: ${COMPANY_INFO.certification}\n` +
            `Delivered Space: ${COMPANY_INFO.completedSqFt}\n` +
            `Happy Families: ${COMPANY_INFO.happyFamilies}\n` +
            `Safe Man-Hours: 4,500,000+ Zero Incident Hours\n\n` +
            `Corporate Governance:\n` +
            `- Seismic Zone IV Compliant Structural Engineering\n` +
            `- Automated On-Site Concrete Quality Laboratory Testing\n` +
            `- 100% Water Harvesting and Groundwater Recharge\n` +
            `- Statutory RERA Ring-Fenced Escrow Compliance\n\n` +
            `Headquarters:\n${COMPANY_INFO.headquarters.address}, ${COMPANY_INFO.headquarters.city}\n` +
            `Contact: ${COMPANY_INFO.headquarters.phone} | ${COMPANY_INFO.headquarters.email}\n`,
        ],
        { type: 'text/plain' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `99-builders-corporate-profile.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <Breadcrumbs items={[{ label: 'About Us', page: 'about' }, { label: 'Company Profile' }]} />

      {/* Hero Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#ECE8E1] pb-10">
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
            <span>Corporate Governance & ISO 14001:2015</span>
            <span aria-hidden="true">·</span>
            <span>Accredited Systems</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
            Company Profile & Engineering Standards
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            Institutional quality control, zero-compromise structural safety, and circular environmental sustainability
            benchmarks across all real estate developments.
          </p>
        </div>

        <div>
          <button
            onClick={handleDownloadProfile}
            disabled={downloading}
            className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#C5A880]" />
            <span>{downloading ? 'Compiling Dossier...' : 'Download Company Profile'}</span>
          </button>
          {downloaded && (
            <p className="text-[11px] text-emerald-600 mt-2 text-right">
              Corporate profile downloaded successfully.
            </p>
          )}
        </div>
      </section>

      {/* ISO 14001:2015 Environmental Management Focus */}
      <section className="bg-[#171D22] text-white p-8 lg:p-12 rounded-lg border border-[#2D3748] space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-xs text-xs text-[#C5A880] font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Certificate No: ISO-14001:2015-EMS-99B</span>
            </div>
            <h2 className="font-heading text-3xl font-bold text-white">
              An Audited ISO 14001:2015 Environmental Developer
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Our ISO 14001:2015 certification is not merely a plaque on the wall — it governs every phase of project
              execution. From environmental impact assessments prior to soil breaking to continuous dust suppression,
              on-site concrete slurry recycling, and LEED Platinum building lifecycle management.
            </p>
          </div>

          <div className="lg:col-span-4 bg-[#1F2630] p-6 rounded-lg border border-[#2D3748] space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Audit Highlights (2026)</h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span>92% Construction Debris Diverted from Landfills</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span>Zero Hazardous Wastewater Discharge</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span>120 Million Liters Annual Rainwater Recharge</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span>100% Low-VOC Paints, Sealants & Adhesives</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Quality Control Framework (3 Pillars) */}
      <section className="space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#94713A]">Quality Assurance</span>
          <h2 className="font-heading text-3xl font-bold text-[#12161A]">Institutional Multi-Tier Quality Protocol</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg border border-[#ECE8E1] space-y-3">
            <div className="w-10 h-10 rounded-sm bg-[#F4EFEA] text-[#94713A] flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-heading text-base font-bold text-[#12161A]">Batching & Material Validation</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every shipment of cement, sand aggregate, and Fe-550D rebar undergoes laboratory tensile testing, sieve
              analysis, and chemical testing before site unloading.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-[#ECE8E1] space-y-3">
            <div className="w-10 h-10 rounded-sm bg-[#F4EFEA] text-[#94713A] flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-heading text-base font-bold text-[#12161A]">Structural Pour & Ultrasonic Probing</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Continuous core probing, electronic slump logging, and non-destructive ultrasonic pulse velocity checks
              ensure zero honeycombing or structural cold joints in high-rise columns.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-[#ECE8E1] space-y-3">
            <div className="w-10 h-10 rounded-sm bg-[#F4EFEA] text-[#94713A] flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-heading text-base font-bold text-[#12161A]">Envelope & MEP Load Balancing</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              High-pressure water jet facade testing at 150 kPa to verify zero water ingress, combined with dynamic
              harmonic distortion electrical audits on all building substations.
            </p>
          </div>
        </div>
      </section>

      {/* HSE & Safety Record with Authentic Award Photo */}
      <section className="bg-[#F9F8F6] p-8 lg:p-10 rounded-lg border border-[#ECE8E1] space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-3">
            <div className="text-4xl font-heading font-bold text-[#12161A] font-mono tabular-nums">
              4.5M+ Hours
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94713A]">
              Accident-Free Contractor Man-Hours
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              National Safety Council Golden Helmet recipient for rigorous high-rise fall protection, digital permit-to-work protocols, and site welfare.
            </p>
            <div className="relative rounded-md overflow-hidden aspect-16/10 border border-[#ECE8E1] shadow-xs mt-3">
              <img
                src="/assets/aistudio/99_builder_1_54aea51f.jpeg"
                alt="99 Builders Team Receiving Safety & Corporate Excellence Trophy"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3 text-white text-[11px] font-medium">
                99 Builders executive leadership receiving the Corporate Excellence Trophy.
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-sm border border-[#ECE8E1]">
              <HardHat className="w-5 h-5 text-[#94713A] mb-2" />
              <div className="text-xs font-bold text-[#12161A]">Daily Dawn Toolbox</div>
              <p className="text-[11px] text-gray-500 mt-1">
                Mandatory hazard briefing for all workforce trades before scaffolding access.
              </p>
            </div>
            <div className="p-4 bg-white rounded-sm border border-[#ECE8E1]">
              <Factory className="w-5 h-5 text-[#94713A] mb-2" />
              <div className="text-xs font-bold text-[#12161A]">Edge Safety Netting</div>
              <p className="text-[11px] text-gray-500 mt-1">
                Triple-layer vertical safety containment envelopes covering upper working storeys.
              </p>
            </div>
            <div className="p-4 bg-white rounded-sm border border-[#ECE8E1]">
              <FileCheck className="w-5 h-5 text-[#94713A] mb-2" />
              <div className="text-xs font-bold text-[#12161A]">100% Medical Checkups</div>
              <p className="text-[11px] text-gray-500 mt-1">
                Quarterly on-site health screening and clean filtered drinking water amenities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

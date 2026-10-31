import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { COMPANY_INFO } from '../data/mockData';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs items={[{ label: 'Disclaimer' }]} />

      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
          <span>Statutory Real Estate Notice</span>
          <span aria-hidden="true">·</span>
          <span>Legal Transparency</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
          Legal Disclaimer & Statutory RERA Notice
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Important disclosures regarding architectural visualizations, specifications, and regulatory frameworks.
        </p>
      </header>

      {/* Prominent Demo Notice Box */}
      <div className="p-6 bg-amber-50/70 rounded-lg border border-amber-200/80 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          <span>Evaluation Showcase Notice</span>
        </div>
        <p className="text-xs text-amber-900 leading-relaxed">
          The projects, architectural renderings, photographs, milestones, testimonials, awards, and RERA registration
          numbers displayed across this website represent demo content crafted for website design and user experience
          evaluation. In commercial production, every active development published displays verifiable state RERA
          registration credentials and municipal building approval numbers.
        </p>
      </div>

      <div className="space-y-8 text-xs text-gray-700 leading-relaxed divide-y divide-[#ECE8E1]">
        <section className="pt-6 space-y-3">
          <h2 className="font-heading text-base font-bold text-[#12161A]">1. Artistic Impressions & Visual Renders</h2>
          <p>
            Computer-generated 3D architectural perspectives, landscape walk-throughs, virtual show-flat staging, and
            sample fit-out imagery are artistic impressions intended solely to convey general design intent. Actual
            textures, color tints, vegetation maturity, and fixture brands may vary upon physical execution.
          </p>
        </section>

        <section className="pt-6 space-y-3">
          <h2 className="font-heading text-base font-bold text-[#12161A]">2. Plans, Dimensions & Specifications</h2>
          <p>
            All carpet areas, usable deck dimensions, and column placements are subject to minor structural adjustments
            as required by civil engineering codes and municipal statutory sanction authorities. The final binding carpet
            area is certified by accredited chartered surveyors and recorded in the formal registered Agreement for Sale.
          </p>
        </section>

        <section className="pt-6 space-y-3">
          <h2 className="font-heading text-base font-bold text-[#12161A]">3. Pricing & Availability</h2>
          <p>
            Prices quoted across promotional pages represent base indicative guidance and are subject to revision without
            prior notification based on market dynamics, floor rise premiums, view premiums, and statutory government
            stamp duties/registration taxes.
          </p>
        </section>

        <section className="pt-6 space-y-3">
          <h2 className="font-heading text-base font-bold text-[#12161A]">4. Statutory RERA Compliance</h2>
          <p>
            {COMPANY_INFO.name} operates in strict compliance with the Real Estate (Regulation and Development) Act.
            Potential purchasers are encouraged to independently verify registered project dossiers on the official
            state RERA regulatory web portal before entering into financial commitments.
          </p>
        </section>
      </div>
    </div>
  );
};

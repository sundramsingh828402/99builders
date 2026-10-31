import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { COMPANY_INFO } from '../data/mockData';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
          <span>Statutory Compliance & Data Governance</span>
          <span aria-hidden="true">·</span>
          <span>Updated October 2026</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          At <strong>{COMPANY_INFO.name}</strong>, we are committed to safeguarding personal, financial, and contact
          data collected through our digital portals, on-site experience centers, and corporate communications.
        </p>
      </header>

      <div className="space-y-8 text-xs text-gray-700 leading-relaxed divide-y divide-[#ECE8E1]">
        <section className="pt-6 space-y-3">
          <h2 className="font-heading text-base font-bold text-[#12161A]">1. Information We Collect</h2>
          <p>
            When you interact with our website to schedule a site visit, download architectural monographs, or request
            commercial leasing terms, we may collect:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Contact Information: Full name, personal/corporate email address, telephone number, and residence city.</li>
            <li>Property Preferences: Desired apartment layout, budget parameters, move-in horizon, and financing requirements.</li>
            <li>Technical Data: Browser user-agent strings, referral sources, and IP telemetry utilized exclusively for website security and traffic analytics.</li>
          </ul>
        </section>

        <section className="pt-6 space-y-3">
          <h2 className="font-heading text-base font-bold text-[#12161A]">2. Utilization of Collected Data</h2>
          <p>
            We process your information strictly for legitimate commercial and statutory compliance obligations:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Facilitating scheduled on-site inspections, chauffeur transfers, and unit walkthroughs.</li>
            <li>Providing audited RERA disclosures, quarterly progress reports, and payment schedules.</li>
            <li>Fulfilling anti-money laundering (AML) and know-your-customer (KYC) mandates for executed reservation agreements.</li>
            <li>We do not sell, license, or monetize your contact information to external third-party telemarketers.</li>
          </ul>
        </section>

        <section className="pt-6 space-y-3">
          <h2 className="font-heading text-base font-bold text-[#12161A]">3. Data Security & Storage</h2>
          <p>
            All submitted lead data is encrypted in transit using Transport Layer Security (TLS 1.3) and stored in
            hardened cloud databases with restricted role-based administrative access. Physical registers maintained at
            our sales experience centers are held under continuous CCTV custody.
          </p>
        </section>

        <section className="pt-6 space-y-3">
          <h2 className="font-heading text-base font-bold text-[#12161A]">4. Contact Our Data Protection Officer</h2>
          <p>
            For inquiries regarding personal data access, correction, or deletion requests, please contact:
          </p>
          <div className="p-4 bg-[#F9F8F6] rounded-sm border border-[#ECE8E1] space-y-1">
            <div className="font-bold text-[#12161A]">{COMPANY_INFO.name} — Data Protection Office</div>
            <div>Address: {COMPANY_INFO.headquarters.address}, {COMPANY_INFO.headquarters.city}</div>
            <div>Email: privacy@99builders.com | Telephone: {COMPANY_INFO.headquarters.phone}</div>
          </div>
        </section>
      </div>
    </div>
  );
};

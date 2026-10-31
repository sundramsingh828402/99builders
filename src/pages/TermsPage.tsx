import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { COMPANY_INFO } from '../data/mockData';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs items={[{ label: 'Terms and Conditions' }]} />

      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
          <span>Legal Agreement & Site Governance</span>
          <span aria-hidden="true">·</span>
          <span>Effective October 2026</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
          Terms & Conditions of Service
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Please read these terms and conditions carefully before utilizing this portal or booking appointments with{' '}
          <strong>{COMPANY_INFO.name}</strong>.
        </p>
      </header>

      <div className="space-y-8 text-xs text-gray-700 leading-relaxed divide-y divide-[#ECE8E1]">
        <section className="pt-6 space-y-3">
          <h2 className="font-heading text-base font-bold text-[#12161A]">1. Scope of Digital Portal</h2>
          <p>
            This website provides architectural overviews, construction updates, and marketing collateral regarding real
            estate developments undertaken by {COMPANY_INFO.name}. Contents on this website do not constitute an
            irrevocable legal offer of sale or mortgage guarantee.
          </p>
        </section>

        <section className="pt-6 space-y-3">
          <h2 className="font-heading text-base font-bold text-[#12161A]">2. Property Reservations & Formal Agreements</h2>
          <p>
            Any formal allotment or sale of residential sky residences, villas, or commercial leasable floors is strictly
            contingent upon:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Execution of a formal Agreement for Sale registered under local municipal Real Estate Regulatory laws.</li>
            <li>Receipt of requisite statutory booking earnest deposits into the designated project escrow account.</li>
            <li>Verification of buyer identity credentials (KYC/AML documentation).</li>
          </ul>
        </section>

        <section className="pt-6 space-y-3">
          <h2 className="font-heading text-base font-bold text-[#12161A]">3. Intellectual Property Rights</h2>
          <p>
            All architectural elevations, 3D renderings, floor plans, video walkthroughs, and copy are proprietary
            intellectual property of {COMPANY_INFO.name}. Unauthorized reproduction, web scraping, or commercial
            re-distribution without prior written consent from our Board of Directors is strictly prohibited.
          </p>
        </section>

        <section className="pt-6 space-y-3">
          <h2 className="font-heading text-base font-bold text-[#12161A]">4. Governing Law & Jurisdiction</h2>
          <p>
            These terms and all transactions arising from the use of this portal shall be governed by and construed in
            accordance with the applicable laws of the jurisdiction where the respective real estate property is situated.
          </p>
        </section>
      </div>
    </div>
  );
};

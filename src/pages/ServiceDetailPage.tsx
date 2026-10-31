import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SERVICES } from '../data/mockData';
import { CheckCircle2, ShieldCheck, ArrowRight, Download, Send, ChevronRight } from 'lucide-react';

export const ServiceDetailPage: React.FC = () => {
  const { currentServiceId, navigate, openEnquiryModal } = useNavigation();

  const service = SERVICES.find((s) => s.id === currentServiceId) || SERVICES[0];

  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    scope: 'Turnkey EPC Construction',
    area: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteForm.name || !quoteForm.email || !quoteForm.phone) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <Breadcrumbs
        items={[
          { label: 'Services', page: 'services' },
          { label: service.title },
        ]}
      />

      {/* Hero Header */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
            <span>Construction Capability Dossier</span>
            <span aria-hidden="true">·</span>
            <span>ISO 14001:2015 Standards</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12161A]">
            {service.title}
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">{service.shortDesc}</p>
          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={() => openEnquiryModal(`Service Inquiry: ${service.title}`)}
              className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm flex items-center gap-2"
            >
              <span>Request Engineering Proposal</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 aspect-4/3 rounded-lg overflow-hidden shadow-lg">
          <img
            src={service.heroImage}
            alt={service.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 bg-white rounded-lg border border-[#ECE8E1]">
        {service.stats.map((st, i) => (
          <div key={i} className="space-y-1">
            <div className="text-3xl font-heading font-bold text-[#12161A] font-mono">{st.value}</div>
            <div className="text-xs uppercase tracking-wider font-semibold text-[#94713A]">{st.label}</div>
          </div>
        ))}
      </section>

      {/* Narrative & Deliverables */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6 text-sm text-gray-700 leading-relaxed">
          <h2 className="font-heading text-2xl font-bold text-[#12161A]">Engineering Methodology</h2>
          <p>{service.fullDesc}</p>

          <div className="space-y-6 pt-4">
            <h3 className="font-heading text-lg font-bold text-[#12161A]">4-Stage Execution Lifecycle</h3>
            <div className="space-y-4">
              {service.methodology.map((m, idx) => (
                <div key={idx} className="p-4 bg-white rounded-lg border border-[#ECE8E1] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#94713A]">{m.step}.</span>
                    <h4 className="text-xs font-bold text-[#12161A] uppercase tracking-wider">{m.title}</h4>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed pl-6">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deliverables & Quote Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-[#F9F8F6] rounded-lg border border-[#ECE8E1] space-y-4">
            <h3 className="font-heading text-base font-bold text-[#12161A]">Contract Deliverables</h3>
            <ul className="space-y-2.5 text-xs text-gray-700">
              {service.deliverables.map((deliv, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#94713A] shrink-0 mt-0.5" />
                  <span>{deliv}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick RFP Form */}
          <div className="p-6 bg-white rounded-lg border border-[#ECE8E1] shadow-xs space-y-4">
            <h3 className="font-heading text-base font-bold text-[#12161A]">Request Technical Proposal</h3>
            {submitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-sm text-center text-xs text-emerald-800 space-y-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="font-semibold">Request Received</p>
                <p>Our Chief Estimator will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">Company / Developer Name</label>
                  <input
                    type="text"
                    required
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                    placeholder="e.g. Apex Industrial Corp"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={quoteForm.email}
                      onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                      placeholder="tender@apex.com"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      value={quoteForm.phone}
                      onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">Estimated Built-Up Area</label>
                  <input
                    type="text"
                    value={quoteForm.area}
                    onChange={(e) => setQuoteForm({ ...quoteForm, area: e.target.value })}
                    placeholder="e.g. 500,000 sq.ft"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm cursor-pointer"
                >
                  Submit for Cost Estimate
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Other Services Navigation */}
      <section className="pt-8 border-t border-[#ECE8E1] space-y-4">
        <h3 className="font-heading text-xl font-bold text-[#12161A]">Explore Other Capabilities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SERVICES.filter((s) => s.id !== service.id).slice(0, 3).map((os) => (
            <button
              key={os.id}
              onClick={() => navigate('service-detail', { serviceId: os.id })}
              className="p-4 bg-white rounded-lg border border-[#ECE8E1] text-left hover:border-[#94713A] transition-colors group"
            >
              <div className="text-xs font-bold text-[#12161A] group-hover:text-[#94713A] transition-colors">
                {os.title}
              </div>
              <p className="text-[11px] text-gray-500 line-clamp-1 mt-1">{os.shortDesc}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

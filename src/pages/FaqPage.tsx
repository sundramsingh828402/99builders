import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useData } from '../context/DataContext';
import { ChevronDown, ChevronUp, Search, HelpCircle, Phone, MessageSquare } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export const FaqPage: React.FC = () => {
  const { navigate, openEnquiryModal } = useNavigation();
  const { faqs: FAQS } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIndexes, setOpenIndexes] = useState<number[]>([0, 1]);

  const categories = ['all', 'Homebuyers', 'Commercial Tenants', 'NRI Investors', 'Construction & Quality', 'RERA & Legal'];

  const toggleAccordion = (index: number) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  const filteredFaqs = FAQS.filter((faq) => {
    if (selectedCategory !== 'all' && faq.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs items={[{ label: 'Frequently Asked Questions' }]} />

      {/* Header */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
          <span>Institutional Knowledge Base</span>
          <span aria-hidden="true">·</span>
          <span>Clear Guidance</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
          Frequently Asked Questions
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Comprehensive answers covering construction quality, statutory RERA protections, NRI acquisition protocols,
          and commercial lease structures.
        </p>
      </section>

      {/* Search and Category Filter */}
      <section className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., RERA, concrete quality, NRI process, possession)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-[#ECE8E1] rounded-sm focus:outline-hidden focus:border-[#94713A] bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#ECE8E1]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#12161A] text-white font-semibold'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}
            >
              {cat === 'all' ? 'All Questions' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Accordion FAQ Items */}
      <section className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 bg-white rounded-lg border border-[#ECE8E1] text-center text-xs text-gray-500">
            No matching questions found for &ldquo;{searchQuery}&rdquo;. Try another search term.
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndexes.includes(idx);
            return (
              <div
                key={idx}
                className="bg-white rounded-lg border border-[#ECE8E1] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F9F8F6] transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-[#94713A] tracking-wider">
                      {faq.category}
                    </span>
                    <h3 className="font-heading text-sm font-bold text-[#12161A]">{faq.question}</h3>
                  </div>
                  <div className="p-1 rounded-full text-gray-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-gray-700 leading-relaxed border-t border-[#F1EFEA] animate-in fade-in duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Still Have Questions Box */}
      <section className="p-8 bg-[#F4EFEA] rounded-lg border border-[#E5DFD5] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-heading text-lg font-bold text-[#12161A]">Have a specific query not covered here?</h3>
          <p className="text-xs text-gray-600">
            Our Senior Relationship Team is on hand to answer technical or legal questions.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => openEnquiryModal('FAQ Specific Consultation')}
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm cursor-pointer"
          >
            Ask Our Team
          </button>
        </div>
      </section>
    </div>
  );
};

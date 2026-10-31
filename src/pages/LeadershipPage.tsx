import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LEADERSHIP } from '../data/mockData';
import { GraduationCap, Briefcase, Mail } from 'lucide-react';

export const LeadershipPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const departments = ['all', 'Board of Directors', 'Executive Leadership', 'Operations & Engineering', 'Environmental Governance'];

  const filteredMembers = LEADERSHIP.filter((m) => {
    if (selectedDept === 'all') return true;
    return m.department === selectedDept;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <Breadcrumbs items={[{ label: 'About Us', page: 'about' }, { label: 'Leadership and Team' }]} />

      {/* Header */}
      <section className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
          <span>Executive Governance</span>
          <span aria-hidden="true">·</span>
          <span>Architects of Legacy</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
          Leadership & Architectural Guild
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Led by seasoned civil engineers, RIBA-fellow architects, and institutional project managers with over a century
          of combined expertise in urban real estate development.
        </p>
      </section>

      {/* Filter by Department */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#ECE8E1]">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-4 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap cursor-pointer ${
              selectedDept === dept
                ? 'bg-[#12161A] text-white font-semibold'
                : 'text-gray-600 hover:text-black hover:bg-gray-100'
            }`}
          >
            {dept === 'all' ? 'All Executive Leadership' : dept}
          </button>
        ))}
      </div>

      {/* Leadership Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-lg border border-[#ECE8E1] overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
          >
            {/* Image */}
            <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-[#12161A]/80 backdrop-blur-xs text-white text-[10px] uppercase font-semibold px-2.5 py-1 rounded-xs tracking-wider">
                {member.department}
              </div>
            </div>

            {/* Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-heading text-lg font-bold text-[#12161A]">{member.name}</h3>
                <div className="text-xs font-semibold text-[#94713A] uppercase tracking-wide">{member.role}</div>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">{member.bio}</p>
              </div>

              <div className="pt-4 border-t border-[#ECE8E1] space-y-1 text-xs text-gray-500">
                <div className="flex items-start gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#94713A] shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-tight text-gray-600">{member.credentials}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useData } from '../context/DataContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { MapPin, Navigation, Compass, Building, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CityHubInfo {
  name: string;
  tagline: string;
  description: string;
  connectivity: { label: string; time: string }[];
  highlights: string[];
}

const CITY_HUBS: CityHubInfo[] = [
  {
    name: 'Waterfront Promenade',
    tagline: 'Scenic Marine Living & Marina Lifestyle',
    description: 'A serene coastal urban enclave commanding uninterrupted horizon views, yacht docking berths, and coastal dining boulevards.',
    connectivity: [
      { label: 'Marina Boardwalk', time: 'Direct Access' },
      { label: 'International Airport', time: '22 Mins' },
      { label: 'Financial District', time: '14 Mins' },
    ],
    highlights: ['Deep water yacht berths', 'Coastal biodiversity parks', 'Zero industrial zones'],
  },
  {
    name: 'Tech Corridor',
    tagline: 'Global Silicon Innovation Hub',
    description: 'The epicenter of modern technology enterprises, multinational corporate campuses, and research institutes with high-speed metro lines.',
    connectivity: [
      { label: 'Outer Ring Expressway', time: '1 Min' },
      { label: 'Metro Station', time: '400 Meters' },
      { label: 'Commercial Atrium', time: 'Walking Distance' },
    ],
    highlights: ['100% renewable power grid', 'Fiber optic underground ducting', 'Extensive cycling lanes'],
  },
  {
    name: 'Financial District',
    tagline: 'High-Density Sovereign Capital Center',
    description: 'The metropolitan core for multinational investment banks, sovereign funds, luxury hotels, and Michelin-starred culinary dining.',
    connectivity: [
      { label: 'Central Subway Interchange', time: '2 Mins' },
      { label: 'Stock Exchange', time: '5 Mins' },
      { label: 'Helipad Access', time: 'On-site Rooftop' },
    ],
    highlights: ['24/7 security surveillance', 'Grade-A institutional infrastructure', 'High-street luxury retail'],
  },
  {
    name: 'Aero City Enclave',
    tagline: 'Low-Density Sovereign Villa Sanctuaries',
    description: '40 acres of preserved botanical sanctuaries, zero-emission pedestrian green corridors, and tranquil country living.',
    connectivity: [
      { label: 'Aero Terminal VIP Gate', time: '12 Mins' },
      { label: 'Championship Golf Course', time: '6 Mins' },
      { label: 'International Baccalaureate School', time: '8 Mins' },
    ],
    highlights: ['Zero-vehicle ground pathways', 'Private equestrian clubs', 'Organic farm-to-table cooperatives'],
  },
];

export const LocationsPage: React.FC = () => {
  const { navigate } = useNavigation();
  const { projects } = useData();
  const [selectedHub, setSelectedHub] = useState<string>('Waterfront Promenade');

  const currentHubData = CITY_HUBS.find((h) => h.name === selectedHub) || CITY_HUBS[0];
  const hubProjects = projects.filter((p) => p.cityHub === selectedHub);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <Breadcrumbs items={[{ label: 'Our Projects', page: 'projects' }, { label: 'Project Locations' }]} />

      {/* Header */}
      <section className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
          <span>Strategic Metropolitan Footprint</span>
          <span aria-hidden="true">·</span>
          <span>Prime Urban Corridors</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
          Project Locations & Strategic Connectivity
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Every 99 Builders development is positioned in premier, high-appreciation urban growth corridors with
          immediate connectivity to international airports, mass transit systems, and commercial epicenters.
        </p>
      </section>

      {/* Hub Selector Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#ECE8E1]">
        {CITY_HUBS.map((hub) => (
          <button
            key={hub.name}
            onClick={() => setSelectedHub(hub.name)}
            className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap cursor-pointer ${
              selectedHub === hub.name
                ? 'bg-[#12161A] text-white shadow-xs'
                : 'text-gray-600 hover:text-black hover:bg-gray-100'
            }`}
          >
            {hub.name}
          </button>
        ))}
      </div>

      {/* Selected Hub Deep-Dive */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Hub Overview & Proximity */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-semibold text-[#94713A] tracking-wider font-mono">
              Hub Focus: {currentHubData.name}
            </span>
            <h2 className="font-heading text-3xl font-bold text-[#12161A]">
              {currentHubData.tagline}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">{currentHubData.description}</p>
          </div>

          {/* Connectivity Matrix */}
          <div className="p-6 bg-white rounded-lg border border-[#ECE8E1] space-y-4">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#12161A]">
              Connectivity & Transit Times
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {currentHubData.connectivity.map((c, i) => (
                <div key={i} className="p-3 bg-[#F9F8F6] rounded-sm border border-[#ECE8E1]">
                  <span className="text-[11px] text-gray-500 block truncate">{c.label}</span>
                  <strong className="text-sm font-mono text-[#94713A]">{c.time}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* District Highlights */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#12161A]">
              Zoning & Environmental Distinctions
            </h4>
            <div className="space-y-2">
              {currentHubData.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#94713A] shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Situated in this Zone */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-[#12161A]">
              Developments in {currentHubData.name} ({hubProjects.length})
            </h3>
          </div>

          <div className="space-y-4">
            {hubProjects.length === 0 ? (
              <div className="p-8 bg-white rounded-lg border border-[#ECE8E1] text-center text-xs text-gray-500">
                New masterplanned launches in this corridor are currently in statutory approval stages.
              </div>
            ) : (
              hubProjects.map((p) => (
                <div
                  key={p.id}
                  className="p-4 bg-white rounded-lg border border-[#ECE8E1] flex flex-col sm:flex-row gap-4 items-center justify-between hover:border-[#94713A] transition-colors"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={p.heroImage}
                      alt={p.title}
                      className="w-20 h-16 object-cover rounded-sm shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-[#94713A]">{p.subCategory}</div>
                      <h4 className="font-heading text-sm font-bold text-[#12161A]">{p.title}</h4>
                      <p className="text-xs text-gray-500">{p.location}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('project-detail', { projectId: p.id })}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#12161A] border border-[#12161A] hover:bg-[#12161A] hover:text-white transition-colors rounded-sm flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <span>View Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Interactive Site Visit Callout */}
          <div className="p-6 bg-[#F4EFEA] rounded-lg border border-[#E5DFD5] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#12161A]">
              Experience This Corridor in Person
            </h4>
            <p className="text-xs text-gray-600">
              Our chauffeur fleet provides private door-to-door transit to tour available inventory across{' '}
              {currentHubData.name}.
            </p>
            <button
              onClick={() => navigate('site-visit')}
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm cursor-pointer"
            >
              Book Chauffeur Site Inspection
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

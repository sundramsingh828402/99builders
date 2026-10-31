import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { MEDIA_GALLERY } from '../data/mockData';
import { MediaItem } from '../types';
import { X, ChevronLeft, ChevronRight, Maximize2, ExternalLink } from 'lucide-react';

export const MediaGalleryPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['all', 'Exterior', 'Interior', 'Amenities', 'Drone & Site', 'Awards & Milestones'];

  const filteredItems = MEDIA_GALLERY.filter((item) => {
    if (categoryFilter === 'all') return true;
    return item.category === categoryFilter;
  });

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const activeLightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs items={[{ label: 'Media & Insights' }, { label: 'Photo Gallery' }]} />

      {/* Header */}
      <section className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
          <span>Architectural Visual Archive</span>
          <span aria-hidden="true">·</span>
          <span>High-Resolution Photography</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
          Media & Architectural Photography
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          High-definition visual monograph documenting our cantilevered sky mansions, noble marble interiors, structural
          topping-out milestones, and certified green campuses.
        </p>
      </section>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#ECE8E1]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap cursor-pointer ${
              categoryFilter === cat
                ? 'bg-[#12161A] text-white font-semibold'
                : 'text-gray-600 hover:text-black hover:bg-gray-100'
            }`}
          >
            {cat === 'all' ? 'All Photographs' : cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => openLightbox(index)}
            className="group relative aspect-4/3 rounded-lg overflow-hidden bg-gray-100 border border-[#ECE8E1] cursor-pointer shadow-xs hover:shadow-lg transition-all"
          >
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
              <div className="flex justify-end">
                <span className="p-1.5 bg-black/60 rounded-full">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#C5A880] tracking-wider">
                  {item.category}
                </span>
                <h4 className="font-heading text-sm font-bold leading-snug">{item.title}</h4>
                <p className="text-[11px] text-gray-300 line-clamp-1">{item.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 text-white bg-white/10 hover:bg-white hover:text-black p-2 rounded-full transition-colors"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white bg-white/10 hover:bg-white hover:text-black p-3 rounded-full transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-white/10 hover:bg-white hover:text-black p-3 rounded-full transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-5xl w-full max-h-[85vh] flex flex-col items-center">
            <img
              src={activeLightboxItem.url}
              alt={activeLightboxItem.title}
              className="max-h-[70vh] w-auto max-w-full object-contain rounded-md shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="mt-4 text-center text-white space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold">
                {activeLightboxItem.category} · Photo {(lightboxIndex || 0) + 1} of {filteredItems.length}
              </span>
              <h3 className="font-heading text-lg font-bold">{activeLightboxItem.title}</h3>
              <p className="text-xs text-gray-400 max-w-lg mx-auto">{activeLightboxItem.caption}</p>
              {activeLightboxItem.projectRef && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      closeLightbox();
                      navigate('project-detail', { projectId: activeLightboxItem.projectRef });
                    }}
                    className="text-xs text-[#C5A880] hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    <span>View Related Project Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

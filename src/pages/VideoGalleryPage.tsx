import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { VIDEO_GALLERY } from '../data/mockData';
import { MediaItem } from '../types';
import { Play, X, Clock, ExternalLink } from 'lucide-react';

export const VideoGalleryPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [activeVideo, setActiveVideo] = useState<MediaItem | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs items={[{ label: 'Media & Insights' }, { label: 'Video Gallery' }]} />

      {/* Header */}
      <section className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
          <span>Cinematic Walkthroughs & Drone Scans</span>
          <span aria-hidden="true">·</span>
          <span>Ultra-HD Video Production</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
          Video Gallery & Construction Timelapses
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Step into our high-rise penthouses, examine continuous drone photogrammetry scans, and experience the journey
          from foundational bedrock excavation to homeowner handover.
        </p>
      </section>

      {/* Video Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {VIDEO_GALLERY.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-lg border border-[#ECE8E1] overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
          >
            {/* Thumbnail with Play Overlay */}
            <div
              onClick={() => setActiveVideo(video)}
              className="relative aspect-16/9 bg-black overflow-hidden cursor-pointer group"
            >
              <img
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
                alt={video.title}
                className="w-full h-full object-cover opacity-75 group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/90 text-[#12161A] rounded-full flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 group-hover:bg-[#C5A880] transition-all">
                  <Play className="w-6 h-6 fill-current" />
                </div>
              </div>
              {video.duration && (
                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{video.duration}</span>
                </div>
              )}
            </div>

            {/* Video Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="text-[10px] font-semibold uppercase text-[#94713A] tracking-wider">
                  {video.category}
                </div>
                <h3 className="font-heading text-base font-bold text-[#12161A] line-clamp-2 leading-snug">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2">{video.caption}</p>
              </div>

              <div className="pt-3 border-t border-[#ECE8E1] flex items-center justify-between">
                <button
                  onClick={() => setActiveVideo(video)}
                  className="text-xs font-semibold text-[#12161A] hover:text-[#94713A] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Walkthrough</span>
                </button>
                {video.projectRef && (
                  <button
                    onClick={() => navigate('project-detail', { projectId: video.projectRef })}
                    className="text-xs text-[#94713A] hover:underline"
                  >
                    View Project
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 text-white bg-black/60 hover:bg-white hover:text-black p-2 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-16/9 w-full">
              <iframe
                src={activeVideo.url}
                title={activeVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 bg-[#12161A] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <h4 className="font-bold text-sm">{activeVideo.title}</h4>
                <p className="text-gray-400">{activeVideo.caption}</p>
              </div>
              {activeVideo.projectRef && (
                <button
                  onClick={() => {
                    const pRef = activeVideo.projectRef;
                    setActiveVideo(null);
                    navigate('project-detail', { projectId: pRef });
                  }}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#12161A] bg-[#C5A880] rounded-sm whitespace-nowrap self-start sm:self-auto"
                >
                  View Project Profile
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

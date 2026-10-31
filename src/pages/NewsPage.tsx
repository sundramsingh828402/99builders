import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useData } from '../context/DataContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ArrowRight, ChevronRight, Search, Calendar, Tag } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const { navigate } = useNavigation();
  const { articles } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const allNews = articles;
  const categories = ['all', 'Corporate', 'Groundbreaking', 'Sustainability', 'Award', 'Press', 'Insight'];

  const filteredNews = allNews.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs items={[{ label: 'Media & Insights' }, { label: 'News & Updates' }]} />

      {/* Header */}
      <section className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
          <span>Corporate Communications</span>
          <span aria-hidden="true">·</span>
          <span>Official Announcements</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
          News, Milestones & Press Updates
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Stay informed on topping-out milestones, quarterly construction disclosures, institutional leasing agreements,
          and group sustainability honors.
        </p>
      </section>

      {/* Filter and Search Bar */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#ECE8E1] pb-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
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
              {cat === 'all' ? 'All Updates' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search news & milestones..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#ECE8E1] rounded-sm focus:outline-hidden focus:border-[#94713A]"
          />
        </div>
      </section>

      {/* News Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNews.map((item) => (
          <article
            key={item.id}
            onClick={() => navigate('news-article', { articleId: item.id })}
            className="bg-white rounded-lg border border-[#ECE8E1] overflow-hidden flex flex-col group hover:shadow-md hover:border-[#94713A] transition-all cursor-pointer"
          >
            <div className="aspect-16/9 bg-gray-100 overflow-hidden relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-[#12161A]/85 text-white text-[10px] font-semibold px-2 py-0.5 rounded-xs uppercase">
                {item.category}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <span>{item.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.readTime}</span>
                </div>
                <h3 className="font-heading text-base font-bold text-[#12161A] group-hover:text-[#94713A] transition-colors leading-snug line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{item.summary}</p>
              </div>

              <div className="pt-3 border-t border-[#ECE8E1] flex items-center justify-between">
                <span className="text-[11px] text-gray-400">By {item.author}</span>
                <span className="text-xs font-semibold text-[#94713A] flex items-center gap-1">
                  <span>Read Article</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

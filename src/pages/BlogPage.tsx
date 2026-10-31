import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useData } from '../context/DataContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ArrowRight, ChevronRight, BookOpen, Clock, User } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const { navigate } = useNavigation();
  const { blogPosts: BLOG_POSTS } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      <Breadcrumbs items={[{ label: 'Media & Insights' }, { label: 'Real Estate Insights' }]} />

      {/* Header */}
      <section className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#94713A]">
          <span>Industry Intelligence & Analysis</span>
          <span aria-hidden="true">·</span>
          <span>Thought Leadership</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#12161A]">
          Real Estate Insights & Architectural Perspectives
        </h1>
        <p className="text-base text-gray-600 leading-relaxed">
          Deep-dives into biophilic high-rise engineering, statutory RERA due diligence, commercial workplace evolution,
          and sustainable urban development.
        </p>
      </section>

      {/* Blog Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.id}
            onClick={() => navigate('news-article', { articleId: post.id })}
            className="bg-white rounded-lg border border-[#ECE8E1] overflow-hidden flex flex-col group hover:shadow-md hover:border-[#94713A] transition-all cursor-pointer"
          >
            <div className="aspect-16/10 bg-gray-100 overflow-hidden relative">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-[#12161A]/85 text-white text-[10px] font-semibold px-2 py-0.5 rounded-xs uppercase">
                {post.category}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <span>{post.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-heading text-base font-bold text-[#12161A] group-hover:text-[#94713A] transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{post.summary}</p>
              </div>

              <div className="pt-3 border-t border-[#ECE8E1] flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-medium truncate max-w-[150px]">{post.author}</span>
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

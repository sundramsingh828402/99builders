import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useData } from '../context/DataContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ArrowLeft, Share2, Calendar, Clock, User, Tag, ArrowRight } from 'lucide-react';

export const NewsArticlePage: React.FC = () => {
  const { currentArticleId, navigate } = useNavigation();
  const { getArticle, articles } = useData();
  const [copied, setCopied] = useState(false);

  const article = getArticle(currentArticleId || '') || articles[0];
  const related = articles.filter((a) => a.id !== article.id).slice(0, 3);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs
        items={[
          { label: 'News & Media', page: 'news' },
          { label: article.title },
        ]}
      />

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#94713A]">
          <span>{article.category}</span>
          <span aria-hidden="true">·</span>
          <span>{article.date}</span>
          <span aria-hidden="true">·</span>
          <span>{article.readTime}</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12161A] leading-tight text-balance">
          {article.title}
        </h1>

        <p className="text-base text-gray-600 font-medium leading-relaxed">{article.summary}</p>

        <div className="pt-4 border-t border-[#ECE8E1] flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-[#94713A]" />
            <span>Published by: {article.author}</span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#ECE8E1] hover:bg-gray-50 rounded-sm text-gray-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
          </button>
        </div>
      </header>

      {/* Hero Image */}
      <div className="aspect-16/9 rounded-lg overflow-hidden shadow-md">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Main Prose Content */}
      <div className="space-y-6 text-base text-gray-800 leading-relaxed max-w-none">
        {article.content.map((paragraph, idx) => (
          <p key={idx} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Tags */}
      <div className="pt-6 border-t border-[#ECE8E1] flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2">Topics:</span>
        {article.tags.map((tag, i) => (
          <span
            key={i}
            className="px-2.5 py-1 text-xs bg-[#F4EFEA] text-[#12161A] rounded-xs font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Related News Strip */}
      <section className="pt-12 border-t border-[#ECE8E1] space-y-6">
        <h3 className="font-heading text-xl font-bold text-[#12161A]">Related Corporate Dispatches</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {related.map((ra) => (
            <div
              key={ra.id}
              onClick={() => navigate('news-article', { articleId: ra.id })}
              className="bg-white rounded-lg border border-[#ECE8E1] overflow-hidden group hover:border-[#94713A] transition-colors cursor-pointer"
            >
              <div className="aspect-16/9 overflow-hidden">
                <img
                  src={ra.image}
                  alt={ra.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#94713A]">{ra.category}</span>
                <h4 className="font-heading text-xs font-bold text-[#12161A] group-hover:text-[#94713A] transition-colors line-clamp-2">
                  {ra.title}
                </h4>
                <div className="text-[11px] text-gray-400">{ra.date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, CheckCircle2, X, Save, Search, FileText } from 'lucide-react';

export const AdminArticlesManager: React.FC = () => {
  const { token, adminUser } = useAdminAuth();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeArticle, setActiveArticle] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  const loadArticles = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getAdminArticles(token);
      setArticles(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [token]);

  const handleCreate = () => {
    setActiveArticle({
      id: `art_${Date.now()}`,
      title: '',
      slug: '',
      type: 'news',
      category: 'Corporate',
      read_time: '4 min read',
      summary: '',
      content: [''],
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      author: adminUser?.name || 'Corporate Communications',
      tags: ['Construction', 'Landmark'],
      is_published: true,
    });
    setIsEditing(false);
  };

  const handleEdit = (a: any) => {
    setActiveArticle({ ...a });
    setIsEditing(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!token) return;
    if (!window.confirm(`Delete article: "${title}"?`)) return;
    try {
      await api.deleteAdminArticle(token, id);
      setFeedback('Article deleted.');
      setTimeout(() => setFeedback(''), 3000);
      loadArticles();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !activeArticle) return;
    setSaving(true);
    try {
      await api.saveAdminArticle(token, activeArticle, isEditing);
      setFeedback('Article saved successfully.');
      setTimeout(() => setFeedback(''), 3000);
      setActiveArticle(null);
      loadArticles();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-[#12161A]">News, Press & Blog Publications</h2>
          <p className="text-xs text-gray-500">
            Publish official announcements, corporate press statements, and real estate market insight articles.
          </p>
        </div>

        {['super_admin', 'editor'].includes(adminUser?.role || '') && (
          <button
            onClick={handleCreate}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C5A880]" />
            <span>Publish New Article</span>
          </button>
        )}
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Articles Table */}
      <div className="bg-white rounded-lg border border-[#ECE8E1] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-[#F9F8F6] text-gray-700 font-semibold uppercase text-[10px] tracking-wider border-b border-[#ECE8E1]">
            <tr>
              <th className="py-3 px-4">Article</th>
              <th className="py-3 px-4">Publication Type</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Author</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECE8E1]">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">Loading publications...</td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">No articles found.</td>
              </tr>
            ) : (
              articles.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#12161A] text-xs">{a.title}</div>
                    <div className="text-[11px] text-gray-400 truncate max-w-sm">{a.summary}</div>
                  </td>
                  <td className="py-3 px-4 uppercase font-semibold text-[10px] text-[#94713A]">{a.type}</td>
                  <td className="py-3 px-4">{a.category}</td>
                  <td className="py-3 px-4 text-gray-500">{a.author}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-xs text-[10px] font-semibold ${
                        a.is_published ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {a.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {['super_admin', 'editor'].includes(adminUser?.role || '') && (
                      <button
                        onClick={() => handleEdit(a)}
                        className="p-1 text-gray-600 hover:text-[#94713A]"
                        title="Edit Article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {adminUser?.role === 'super_admin' && (
                      <button
                        onClick={() => handleDelete(a.id, a.title)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Article Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-[#ECE8E1] max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-[#ECE8E1] flex items-center justify-between bg-[#FBF9F6]">
              <h3 className="font-heading text-lg font-bold text-[#12161A]">
                {isEditing ? `Edit: ${activeArticle.title}` : 'Compose Article'}
              </h3>
              <button onClick={() => setActiveArticle(null)} className="p-1 text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Publication Type</label>
                  <select
                    value={activeArticle.type}
                    onChange={(e) => setActiveArticle({ ...activeArticle, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-white"
                  >
                    <option value="news">Corporate News & Milestones</option>
                    <option value="press">Press Release</option>
                    <option value="blog">Real Estate Insights Blog</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={activeArticle.category}
                    onChange={(e) => setActiveArticle({ ...activeArticle, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Article Headline *</label>
                <input
                  type="text"
                  required
                  value={activeArticle.title}
                  onChange={(e) => setActiveArticle({ ...activeArticle, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Executive Summary</label>
                <textarea
                  rows={2}
                  value={activeArticle.summary}
                  onChange={(e) => setActiveArticle({ ...activeArticle, summary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Full Article Narrative (Paragraph)</label>
                <textarea
                  rows={5}
                  value={Array.isArray(activeArticle.content) ? activeArticle.content.join('\n\n') : activeArticle.content}
                  onChange={(e) => setActiveArticle({ ...activeArticle, content: e.target.value.split('\n\n') })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    value={activeArticle.image}
                    onChange={(e) => setActiveArticle({ ...activeArticle, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={activeArticle.author}
                    onChange={(e) => setActiveArticle({ ...activeArticle, author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="art-publish"
                  checked={Boolean(activeArticle.is_published)}
                  onChange={(e) => setActiveArticle({ ...activeArticle, is_published: e.target.checked })}
                  className="w-4 h-4 accent-[#12161A]"
                />
                <label htmlFor="art-publish" className="font-semibold text-gray-800">
                  Publish to Public Portal
                </label>
              </div>

              <div className="pt-3 border-t border-[#ECE8E1] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2 border border-gray-300 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#12161A] text-white rounded-sm font-semibold uppercase tracking-wider"
                >
                  {saving ? 'Saving...' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

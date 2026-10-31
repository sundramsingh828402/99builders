import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { api } from '../../services/api';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  X,
  Save,
  Search,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const AdminProjectsManager: React.FC = () => {
  const { token, adminUser } = useAdminAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeModalProject, setActiveModalProject] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const loadProjects = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getAdminProjects(token);
      setProjects(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [token]);

  const handleOpenCreate = () => {
    setActiveModalProject({
      id: `proj_${Date.now()}`,
      title: '',
      tagline: '',
      category: 'residential',
      sub_category: 'Luxury Sky Residences',
      status: 'ongoing',
      is_published: true,
      location: '',
      city_hub: 'Waterfront Promenade',
      price_starting: 'Starting from $1.2M',
      units_or_area: '3 & 4 BHK | 2,800 sq.ft',
      rera_number: '[Demo RERA No: PRM/KA/RERA/1251/DEMO-99/NEW]',
      hero_image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      video_tour_url: '',
      overview: '',
      architecture_firm: '99 Architectural Atelier',
      overall_progress: 25,
      possession_date: 'Target Q4 2028',
      amenities: [
        { name: 'Infinity Pool', description: 'Heated panoramic pool' },
        { name: 'Private Concierge', description: '24/7 dedicated reception' },
      ],
      specifications: [
        { category: 'Structure', items: ['Seismic Zone IV concrete core', 'M60 grade matrix'] },
      ],
      milestones: [
        { stage: 'Deep Foundation', status: 'completed', date: '2026', progressPercent: 100 },
        { stage: 'Superstructure', status: 'in-progress', date: '2027', progressPercent: 40 },
      ],
      featured: false,
    });
    setIsEditing(false);
  };

  const handleOpenEdit = (p: any) => {
    setActiveModalProject({ ...p });
    setIsEditing(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!token) return;
    if (!window.confirm(`Are you sure you want to permanently delete project: "${title}"?`)) {
      return;
    }
    try {
      await api.deleteAdminProject(token, id);
      setFeedbackMessage(`Project "${title}" deleted.`);
      setTimeout(() => setFeedbackMessage(''), 3000);
      loadProjects();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !activeModalProject) return;
    setSaving(true);
    try {
      await api.saveAdminProject(token, activeModalProject, isEditing);
      setFeedbackMessage(`Project "${activeModalProject.title}" saved successfully to database.`);
      setTimeout(() => setFeedbackMessage(''), 3000);
      setActiveModalProject(null);
      loadProjects();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const filtered = projects.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-[#12161A]">Project Portfolio Management</h2>
          <p className="text-xs text-gray-500">
            Publish, edit descriptions, specifications, milestones, and galleries stored in the database.
          </p>
        </div>

        {['super_admin', 'editor'].includes(adminUser?.role || '') && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#C5A880]" />
            <span>Create New Landmark</span>
          </button>
        )}
      </div>

      {feedbackMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="w-full pl-9 pr-3 py-2 text-xs border border-[#ECE8E1] bg-white rounded-sm focus:outline-hidden focus:border-[#94713A]"
        />
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg border border-[#ECE8E1] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#F9F8F6] text-gray-700 font-semibold uppercase text-[10px] tracking-wider border-b border-[#ECE8E1]">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Pricing</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Visibility</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE8E1]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Loading projects from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No projects found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.hero_image}
                          alt={p.title}
                          className="w-12 h-10 object-cover rounded-xs shrink-0"
                        />
                        <div>
                          <div className="font-bold text-[#12161A] text-xs">{p.title}</div>
                          <div className="text-[11px] text-gray-400 truncate max-w-xs">{p.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize">{p.category}</span>
                      <span className="block text-[10px] text-gray-400">{p.sub_category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-xs text-[10px] uppercase font-semibold bg-[#F4EFEA] text-[#94713A]">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">{p.price_starting}</td>
                    <td className="py-3 px-4 font-mono">{p.overall_progress}%</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-semibold ${
                          p.is_published ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {p.is_published ? 'Published' : 'Draft / Archived'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {['super_admin', 'editor'].includes(adminUser?.role || '') && (
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1 text-gray-600 hover:text-[#94713A] rounded-xs"
                          title="Edit Project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {adminUser?.role === 'super_admin' && (
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded-xs"
                          title="Delete Project"
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
      </div>

      {/* Project Edit / Create Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl border border-[#ECE8E1] max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-[#ECE8E1] flex items-center justify-between bg-[#FBF9F6]">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94713A]">
                  Database Entity Editor
                </span>
                <h3 className="font-heading text-lg font-bold text-[#12161A]">
                  {isEditing ? `Edit: ${activeModalProject.title}` : 'Create New Landmark Development'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalProject(null)}
                className="p-1.5 text-gray-400 hover:text-black rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Project Identifier (ID)</label>
                  <input
                    type="text"
                    required
                    disabled={isEditing}
                    value={activeModalProject.id}
                    onChange={(e) => setActiveModalProject({ ...activeModalProject, id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-50 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={activeModalProject.title}
                    onChange={(e) => setActiveModalProject({ ...activeModalProject, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={activeModalProject.tagline}
                  onChange={(e) => setActiveModalProject({ ...activeModalProject, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-hidden focus:border-[#94713A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={activeModalProject.category}
                    onChange={(e) => setActiveModalProject({ ...activeModalProject, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-white"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={activeModalProject.status}
                    onChange={(e) => setActiveModalProject({ ...activeModalProject, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-white"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">City Hub</label>
                  <select
                    value={activeModalProject.city_hub}
                    onChange={(e) => setActiveModalProject({ ...activeModalProject, city_hub: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-white"
                  >
                    <option value="Waterfront Promenade">Waterfront Promenade</option>
                    <option value="Tech Corridor">Tech Corridor</option>
                    <option value="Financial District">Financial District</option>
                    <option value="Aero City Enclave">Aero City Enclave</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Starting Price</label>
                  <input
                    type="text"
                    value={activeModalProject.price_starting}
                    onChange={(e) => setActiveModalProject({ ...activeModalProject, price_starting: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Units / Area Configurations</label>
                  <input
                    type="text"
                    value={activeModalProject.units_or_area}
                    onChange={(e) => setActiveModalProject({ ...activeModalProject, units_or_area: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">RERA Number</label>
                  <input
                    type="text"
                    value={activeModalProject.rera_number}
                    onChange={(e) => setActiveModalProject({ ...activeModalProject, rera_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Hero Image URL or /uploads/ path</label>
                  <input
                    type="text"
                    value={activeModalProject.hero_image}
                    onChange={(e) => setActiveModalProject({ ...activeModalProject, hero_image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Progress Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={activeModalProject.overall_progress || 0}
                    onChange={(e) =>
                      setActiveModalProject({ ...activeModalProject, overall_progress: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Overview & Architectural Narrative</label>
                <textarea
                  rows={4}
                  value={activeModalProject.overview}
                  onChange={(e) => setActiveModalProject({ ...activeModalProject, overview: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(activeModalProject.is_published)}
                    onChange={(e) => setActiveModalProject({ ...activeModalProject, is_published: e.target.checked })}
                    className="w-4 h-4 accent-[#12161A]"
                  />
                  <span className="font-semibold text-gray-800">Publicly Published</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(activeModalProject.featured)}
                    onChange={(e) => setActiveModalProject({ ...activeModalProject, featured: e.target.checked })}
                    className="w-4 h-4 accent-[#12161A]"
                  />
                  <span className="font-semibold text-gray-800">Featured Landmark Spotlight</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#ECE8E1] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModalProject(null)}
                  className="px-4 py-2 border border-gray-300 rounded-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#12161A] text-white rounded-sm font-semibold uppercase tracking-wider hover:bg-[#232B32] transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{saving ? 'Saving...' : 'Save Record'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

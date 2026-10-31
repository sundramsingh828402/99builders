import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { api } from '../../services/api';
import { EnquiryRecord } from '../../types';
import {
  Users,
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  Save,
  MessageSquare,
  Car,
} from 'lucide-react';

export const AdminLeadsManager: React.FC = () => {
  const { token, adminUser } = useAdminAuth();
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [activeLead, setActiveLead] = useState<EnquiryRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  const loadLeads = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getAdminEnquiries(token, statusFilter, typeFilter);
      setEnquiries(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [token, statusFilter, typeFilter]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !activeLead) return;
    setSaving(true);
    try {
      await api.updateAdminEnquiry(token, activeLead.id, {
        status: activeLead.status,
        assigned_to: activeLead.assigned_to,
        internal_notes: activeLead.internal_notes,
      });
      setFeedback(`Lead updated successfully.`);
      setTimeout(() => setFeedback(''), 3000);
      setActiveLead(null);
      loadLeads();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLead = async (id: string, name: string) => {
    if (!token) return;
    if (!window.confirm(`Permanently delete lead record for: ${name}?`)) return;
    try {
      await api.deleteAdminEnquiry(token, id);
      setFeedback(`Lead deleted.`);
      setTimeout(() => setFeedback(''), 3000);
      loadLeads();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleExportCsv = () => {
    if (!token) return;
    window.open(`/api/admin/enquiries/export?token=${token}`, '_blank');
  };

  const filtered = enquiries.filter((e) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.phone.includes(q) ||
      (e.subject && e.subject.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header and Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-[#12161A]">Client Enquiries & Lead Pipeline</h2>
          <p className="text-xs text-gray-500">
            Real-time lead capture from all public forms, site visits, and brochure downloads.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#12161A] border border-[#12161A] hover:bg-gray-50 transition-colors rounded-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#94713A]" />
          <span>Export Authorized CSV</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-[#ECE8E1] grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#ECE8E1] rounded-sm focus:outline-hidden focus:border-[#94713A]"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-1.5 text-xs border border-[#ECE8E1] rounded-sm bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="new">New / Uncontacted</option>
            <option value="contacted">Contacted</option>
            <option value="site_visit_scheduled">Site Visit Scheduled</option>
            <option value="negotiation">Under Negotiation</option>
            <option value="closed">Closed / Allotted</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-1.5 text-xs border border-[#ECE8E1] rounded-sm bg-white"
          >
            <option value="all">All Form Channels</option>
            <option value="general">General Enquiry</option>
            <option value="project">Project Enquiry</option>
            <option value="site_visit">Site Visit Booking</option>
            <option value="callback">Callback Request</option>
            <option value="requirement">Property Requirement</option>
            <option value="brochure">Brochure Request</option>
            <option value="career">Career Application</option>
            <option value="partnership">Business Partnership</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg border border-[#ECE8E1] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#F9F8F6] text-gray-700 font-semibold uppercase text-[10px] tracking-wider border-b border-[#ECE8E1]">
              <tr>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Project / Subject</th>
                <th className="py-3 px-4">Lead Status</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE8E1]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    Loading records from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    No matching leads found.
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#12161A]">{e.name}</td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <div>{e.phone}</div>
                      <div className="text-gray-400">{e.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-xs text-[10px] uppercase font-semibold bg-[#F4EFEA] text-[#94713A]">
                        {e.form_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="truncate font-medium text-gray-800">{e.project_id || e.subject}</div>
                      {e.message && <div className="text-[10px] text-gray-400 truncate">{e.message}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-semibold ${
                          e.status === 'new'
                            ? 'bg-emerald-50 text-emerald-800'
                            : e.status === 'site_visit_scheduled'
                            ? 'bg-blue-50 text-blue-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {e.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-gray-500">{e.assigned_to || 'Unassigned'}</td>
                    <td className="py-3 px-4 font-mono text-[10px] text-gray-400">
                      {new Date(e.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setActiveLead({ ...e })}
                        className="p-1 text-gray-600 hover:text-[#94713A] rounded-xs"
                        title="Update Follow-up"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {adminUser?.role === 'super_admin' && (
                        <button
                          onClick={() => handleDeleteLead(e.id, e.name)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded-xs"
                          title="Delete Lead"
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

      {/* Edit / Manage Lead Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl border border-[#ECE8E1] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECE8E1] pb-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94713A]">
                  Lead Detail #{activeLead.id}
                </span>
                <h3 className="font-heading text-lg font-bold text-[#12161A]">{activeLead.name}</h3>
              </div>
              <button onClick={() => setActiveLead(null)} className="p-1 text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#F9F8F6] p-3 rounded-sm space-y-1 text-xs">
              <div className="grid grid-cols-2 gap-2 text-gray-600">
                <div>Email: <strong className="text-gray-900">{activeLead.email}</strong></div>
                <div>Phone: <strong className="text-gray-900 font-mono">{activeLead.phone}</strong></div>
              </div>
              {activeLead.message && (
                <div className="pt-2 text-gray-700 italic border-t border-[#ECE8E1]">
                  &ldquo;{activeLead.message}&rdquo;
                </div>
              )}
              {activeLead.preferred_date && (
                <div className="pt-1 text-[11px] text-[#94713A] font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Requested Visit: {activeLead.preferred_date} ({activeLead.preferred_time})</span>
                </div>
              )}
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Follow-up Status</label>
                <select
                  value={activeLead.status}
                  onChange={(e) => setActiveLead({ ...activeLead, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-white"
                >
                  <option value="new">New / Uncontacted</option>
                  <option value="contacted">Contacted via Call/WhatsApp</option>
                  <option value="site_visit_scheduled">Site Visit Scheduled</option>
                  <option value="negotiation">Under Negotiation / Unit Reserved</option>
                  <option value="closed">Closed / Allotted</option>
                  <option value="archived">Archived / Disqualified</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Assign Follow-Up Director</label>
                <input
                  type="text"
                  value={activeLead.assigned_to || ''}
                  onChange={(e) => setActiveLead({ ...activeLead, assigned_to: e.target.value })}
                  placeholder="e.g. Meera Kapoor (Customer Experience)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Internal Notes & Action History</label>
                <textarea
                  rows={3}
                  value={activeLead.internal_notes || ''}
                  onChange={(e) => setActiveLead({ ...activeLead, internal_notes: e.target.value })}
                  placeholder="Add confidential notes on client budget, family requirements, or scheduled visits..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm"
                />
              </div>

              <div className="pt-3 border-t border-[#ECE8E1] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveLead(null)}
                  className="px-4 py-2 border border-gray-300 rounded-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#12161A] text-white rounded-sm font-semibold uppercase tracking-wider hover:bg-[#232B32] transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{saving ? 'Saving...' : 'Update Lead'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

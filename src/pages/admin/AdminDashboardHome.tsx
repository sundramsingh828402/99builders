import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { api } from '../../services/api';
import {
  Building2,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface AdminDashboardHomeProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboardHome: React.FC<AdminDashboardHomeProps> = ({ onNavigateTab }) => {
  const { token, adminUser } = useAdminAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api
      .getDashboardStats(token)
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-gray-500">
        Loading real-time database analytics...
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
        {error || 'Unable to load database metrics'}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-lg border border-[#ECE8E1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#94713A]">
            <ShieldCheck className="w-4 h-4" />
            <span>Role: {adminUser?.role.replace('_', ' ').toUpperCase()}</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#12161A] mt-1">
            Welcome, {adminUser?.name}
          </h1>
          <p className="text-xs text-gray-500">
            Real-time status of 99 Builders portfolio, client inquiries, and statutory disclosures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['super_admin', 'editor'].includes(adminUser?.role || '') && (
            <button
              onClick={() => onNavigateTab('projects')}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#12161A] hover:bg-[#232B32] transition-colors rounded-sm"
            >
              + Add Project
            </button>
          )}
          {['super_admin', 'lead_manager'].includes(adminUser?.role || '') && (
            <button
              onClick={() => onNavigateTab('leads')}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#12161A] border border-[#12161A] hover:bg-gray-50 transition-colors rounded-sm"
            >
              Manage Leads
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Projects */}
        <div className="bg-white p-6 rounded-lg border border-[#ECE8E1] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Landmarks
            </span>
            <div className="p-2 bg-[#F9F8F6] rounded-sm text-[#94713A]">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-[#12161A] font-mono tabular-nums">
            {stats.totalProjects}
          </div>
          <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1 border-t border-[#F1EFEA]">
            <span>{stats.ongoingProjects} Ongoing</span>
            <span>·</span>
            <span>{stats.completedProjects} Completed</span>
            <span>·</span>
            <span>{stats.upcomingProjects} Upcoming</span>
          </div>
        </div>

        {/* Total Inquiries */}
        <div className="bg-white p-6 rounded-lg border border-[#ECE8E1] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Inquiries
            </span>
            <div className="p-2 bg-[#F9F8F6] rounded-sm text-[#94713A]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-[#12161A] font-mono tabular-nums">
            {stats.totalEnquiries}
          </div>
          <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1 border-t border-[#F1EFEA]">
            <span className="text-emerald-700 font-semibold">{stats.newLeads} Actionable Leads</span>
            <span>·</span>
            <span>All Channels</span>
          </div>
        </div>

        {/* Site Visits */}
        <div className="bg-white p-6 rounded-lg border border-[#ECE8E1] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Site Visits
            </span>
            <div className="p-2 bg-[#F9F8F6] rounded-sm text-[#94713A]">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-[#12161A] font-mono tabular-nums">
            {stats.siteVisitsCount}
          </div>
          <div className="text-[11px] text-gray-500 pt-1 border-t border-[#F1EFEA]">
            Physical inspections & chauffeur transfers
          </div>
        </div>

        {/* Security & System */}
        <div className="bg-white p-6 rounded-lg border border-[#ECE8E1] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Database Engine
            </span>
            <div className="p-2 bg-[#F9F8F6] rounded-sm text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-lg font-heading font-bold text-[#12161A]">
            SQLite 3 Relational
          </div>
          <div className="text-[11px] text-gray-500 pt-1 border-t border-[#F1EFEA]">
            WAL Mode · Foreign Keys Active
          </div>
        </div>
      </div>

      {/* 2-Column Split: Recent Enquiries & Recent Administrative Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Inquiries List */}
        <div className="lg:col-span-7 bg-white p-6 rounded-lg border border-[#ECE8E1] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-[#12161A]">
              Recent Client Enquiries
            </h3>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-xs text-[#94713A] hover:underline flex items-center gap-1 font-medium"
            >
              <span>View All Leads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#ECE8E1]">
            {stats.recentEnquiries.length === 0 ? (
              <p className="py-4 text-xs text-gray-400">No client submissions recorded yet.</p>
            ) : (
              stats.recentEnquiries.map((enq: any) => (
                <div key={enq.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#12161A]">{enq.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-xs uppercase font-semibold bg-[#F4EFEA] text-[#94713A]">
                        {enq.form_type}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-xs font-semibold ${
                          enq.status === 'new'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1">{enq.message || enq.subject}</p>
                    <div className="text-[10px] text-gray-400 font-mono">
                      {enq.email} · {enq.phone} · {new Date(enq.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-[#ECE8E1] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-[#12161A]">
              Audit Trail Activity
            </h3>
            {adminUser?.role === 'super_admin' && (
              <button
                onClick={() => onNavigateTab('audit')}
                className="text-xs text-[#94713A] hover:underline"
              >
                Full Trail
              </button>
            )}
          </div>

          <div className="space-y-3">
            {stats.recentAuditLogs.length === 0 ? (
              <p className="text-xs text-gray-400">No events logged.</p>
            ) : (
              stats.recentAuditLogs.map((log: any) => (
                <div key={log.id} className="p-3 bg-[#F9F8F6] rounded-sm border border-[#ECE8E1] space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#12161A]">{log.action}</span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 line-clamp-1">{log.details}</p>
                  <div className="text-[10px] text-gray-400">By {log.user_name}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { api } from '../../services/api';
import { AuditLogRecord } from '../../types';
import { ShieldCheck, Clock, User, FileText } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const { token } = useAdminAuth();
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api
      .getAdminAuditLogs(token)
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-[#12161A]">Administrative Audit Trail</h2>
        <p className="text-xs text-gray-500">
          Immutable event log of administrative modifications, logins, project creations, and lead status updates.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-[#ECE8E1] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-[#F9F8F6] text-gray-700 font-semibold uppercase text-[10px] tracking-wider border-b border-[#ECE8E1]">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Entity Type</th>
              <th className="py-3 px-4">Administrator</th>
              <th className="py-3 px-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECE8E1]">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">Loading audit records...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">No events logged yet.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#12161A]">
                    <span className="px-2 py-0.5 rounded-xs text-[10px] uppercase font-mono bg-[#F4EFEA] text-[#94713A]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 capitalize">{log.entity_type}</td>
                  <td className="py-3 px-4 text-gray-800 font-medium">{log.user_name}</td>
                  <td className="py-3 px-4 text-gray-600 max-w-md truncate">{log.details}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

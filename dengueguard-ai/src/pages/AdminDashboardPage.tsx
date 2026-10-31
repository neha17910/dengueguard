import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Download, 
  Trash2, 
  Edit3, 
  Save, 
  Filter, 
  FileSpreadsheet,
  Lock,
  Layers,
  Building2,
  Users
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { CommunityReport, ReportStatus, Language, ThemeMode, UserSession } from '../types';
import { getReports, updateReportStatus, deleteReport } from '../services/storageService';

interface AdminDashboardPageProps {
  language: Language;
  theme: ThemeMode;
  userSession: UserSession;
  onOpenAuth: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  language,
  theme,
  userSession,
  onOpenAuth,
}) => {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const isOfficerOrAdmin = userSession.role === 'health_officer' || userSession.role === 'admin';

  useEffect(() => {
    setReports(getReports());
  }, []);

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    if (!isOfficerOrAdmin) {
      alert('Authentication Required: Please log in as a Health Officer / Administrator to modify municipal status.');
      onOpenAuth();
      return;
    }
    const updated = await updateReportStatus(reportId, newStatus);
    setReports(updated);
  };

  const handleStartEditNote = (report: CommunityReport) => {
    if (!isOfficerOrAdmin) {
      alert('Authentication Required: Please authenticate as a Health Officer to log municipal mitigation notes.');
      onOpenAuth();
      return;
    }
    setEditingNoteId(report.id);
    setNoteDraft(report.adminNotes || '');
  };

  const handleSaveNote = async (reportId: string) => {
    const updated = await updateReportStatus(reportId, reports.find(r => r.id === reportId)?.status || 'pending', noteDraft);
    setReports(updated);
    setEditingNoteId(null);
  };

  const handleDelete = async (reportId: string) => {
    if (!isOfficerOrAdmin) {
      alert('Permission Denied: Only authenticated Health Officers or Administrators can purge surveillance entries.');
      onOpenAuth();
      return;
    }
    if (window.confirm('Are you sure you want to remove this public report from the surveillance registry?')) {
      const updated = await deleteReport(reportId);
      setReports(updated);
    }
  };

  const handleExportCsv = () => {
    const headers = ['Incident_ID', 'Title', 'Location', 'Severity', 'Operational_Status', 'Reporter', 'Verified_Confirmations', 'Timestamp', 'Mitigation_Notes'];
    const rows = reports.map(r => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.locationName.replace(/"/g, '""')}"`,
      r.severity,
      r.status,
      `"${r.reporterName}"`,
      r.upvotes,
      r.createdAt,
      `"${(r.adminNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DengueGuard_Surveillance_Registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const total = reports.length;
  const pending = reports.filter(r => r.status === 'pending').length;
  const investigating = reports.filter(r => r.status === 'investigating').length;
  const verified = reports.filter(r => r.status === 'verified').length;
  const resolved = reports.filter(r => r.status === 'resolved').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const statusChartData = [
    { name: 'Pending Review', count: pending, color: '#f59e0b' },
    { name: 'Squad Dispatched', count: investigating, color: '#8b5cf6' },
    { name: 'Verified Cluster', count: verified, color: '#06b6d4' },
    { name: 'Treated / Cleared', count: resolved, color: '#10b981' },
  ];

  const filteredReports = reports.filter(r => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    return true;
  });

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white dark:bg-dark-surface p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-neon-amber/10 text-amber-600 dark:text-neon-amber border border-amber-200 dark:border-neon-amber/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {language === 'hi' ? 'वेक्टर नियंत्रण एवं स्वास्थ्य विभाग एडमिन पोर्टल' : 'Vector Surveillance & Rapid Response Portal'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Surveillance registry, rapid response squad dispatch, and municipal resolution analytics
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {!isOfficerOrAdmin && (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Authenticate as Officer</span>
            </button>
          )}

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 dark:bg-neon-teal dark:text-slate-950 text-white shadow-md shadow-teal-600/30 transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Registry (CSV)</span>
          </button>
        </div>
      </div>

      {/* Role Alert if viewing as citizen */}
      {!isOfficerOrAdmin && (
        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-dark-card border border-amber-200 dark:border-dark-border text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>You are viewing this portal in <strong>Citizen Observer Mode</strong>. Authenticate to approve hazard tickets and record remediation notes.</span>
          </div>
          <button
            onClick={onOpenAuth}
            className="text-xs font-bold text-amber-800 dark:text-neon-cyan underline shrink-0 ml-2"
          >
            Enter Passkey
          </button>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm neon-card">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">Total Reported Spots</span>
          <span className="text-3xl font-black text-slate-900 dark:text-white">{total}</span>
        </div>

        <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm neon-card">
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block mb-1">Pending Field Review</span>
          <span className="text-3xl font-black text-amber-600 dark:text-amber-400">{pending}</span>
        </div>

        <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm neon-card">
          <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 block mb-1">Squad Investigating</span>
          <span className="text-3xl font-black text-purple-600 dark:text-purple-400">{investigating}</span>
        </div>

        <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm neon-card">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block mb-1">Treated / Larvicide Sprayed</span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{resolved}</span>
        </div>

        <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm neon-card col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold text-teal-600 dark:text-neon-cyan block mb-1">Municipal Response Rate</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-teal-600 dark:text-neon-cyan">{resolutionRate}%</span>
            <span className="text-xs text-slate-400">cleared</span>
          </div>
        </div>

      </div>

      {/* Analytics Chart */}
      <div className="bg-white dark:bg-dark-surface p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm">
        <h3 className="font-black text-base text-slate-900 dark:text-white mb-1 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-600 dark:text-neon-teal" />
          Field Mitigation Status Breakdown
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Current operational pipeline of reported stagnant water bodies
        </p>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                  borderRadius: '16px', 
                  border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
                  color: isDark ? '#ffffff' : '#0f172a'
                }} 
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Moderation Queue */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm overflow-hidden">
        
        <div className="p-5 border-b border-slate-200 dark:border-dark-border flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-dark-card">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Surveillance Incident Moderation Queue
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verify hazards, update remediation status, and record municipal action notes
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-dark-border text-xs font-bold bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-200 outline-none"
            >
              <option value="all">All Incidents ({reports.length})</option>
              <option value="pending">Pending ({pending})</option>
              <option value="investigating">Squad Dispatched ({investigating})</option>
              <option value="verified">Verified ({verified})</option>
              <option value="resolved">Resolved ({resolved})</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 dark:bg-dark-card text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200 dark:border-dark-border">
              <tr>
                <th className="py-3 px-4">Photo / Title</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Operational Status</th>
                <th className="py-3 px-4">Mitigation Action Note</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/80 dark:hover:bg-dark-card/60 transition-colors">
                  
                  {/* Photo & Title */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="flex items-center space-x-3">
                      {report.imageUrl ? (
                        <img
                          src={report.imageUrl}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-dark-border shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-dark-card border border-slate-200 dark:border-dark-border flex items-center justify-center text-slate-400 shrink-0">
                          <Layers className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{report.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          By {report.reporterName} • {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-[180px]">
                    <div className="truncate">{report.locationName}</div>
                    <div className="text-[10px] text-slate-400">Lat: {report.latitude.toFixed(2)}, Lon: {report.longitude.toFixed(2)}</div>
                  </td>

                  {/* Severity */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      report.severity === 'critical' ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300' :
                      report.severity === 'high' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' :
                      report.severity === 'medium' ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300' :
                      'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    }`}>
                      {report.severity}
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-4">
                    <select
                      value={report.status}
                      disabled={!isOfficerOrAdmin}
                      onChange={(e) => handleStatusChange(report.id, e.target.value as ReportStatus)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border outline-none ${
                        isOfficerOrAdmin
                          ? 'border-slate-300 dark:border-dark-border bg-white dark:bg-dark-surface text-slate-800 dark:text-slate-200 cursor-pointer'
                          : 'border-transparent bg-transparent text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="investigating">Squad Dispatched</option>
                      <option value="verified">Verified Hotspot</option>
                      <option value="resolved">Resolved / Cleared</option>
                    </select>
                  </td>

                  {/* Admin Notes */}
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs">
                    {editingNoteId === report.id ? (
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="text"
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          className="px-2 py-1 text-xs bg-white dark:bg-dark-card border border-teal-500 rounded-lg text-slate-900 dark:text-white outline-none w-full"
                          placeholder="Log action note..."
                        />
                        <button
                          onClick={() => handleSaveNote(report.id)}
                          className="p-1 rounded-lg bg-teal-600 dark:bg-neon-teal text-white dark:text-dark-bg shrink-0"
                          title="Save note"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between group">
                        <span className="text-[11px] text-slate-700 dark:text-slate-300 italic line-clamp-2">
                          {report.adminNotes || 'No notes added'}
                        </span>
                        {isOfficerOrAdmin && (
                          <button
                            onClick={() => handleStartEditNote(report)}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0"
                            title="Edit action note"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Purge record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

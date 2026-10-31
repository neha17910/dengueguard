import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Camera, 
  ThumbsUp, 
  AlertCircle, 
  CheckCircle2, 
  Filter, 
  X, 
  Navigation,
  Sparkles,
  Layers
} from 'lucide-react';
import { CommunityReport, ReportSeverity, ReportStatus, Language, UserSession } from '../types';
import { getReports, saveReport, toggleReportUpvote, getUserSession } from '../services/storageService';

interface CommunityReportsPageProps {
  language: Language;
  userSession: UserSession;
}

const PRESET_SAMPLE_PHOTOS = [
  { label: 'Commercial Tyres with Rainwater', url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Uncovered Stagnant Water Tank', url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80' },
  { label: 'Desert Cooler with Murky Water', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80' },
];

export const CommunityReportsPage: React.FC<CommunityReportsPageProps> = ({ language, userSession }) => {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState(28.6139);
  const [longitude, setLongitude] = useState(77.2090);
  const [severity, setSeverity] = useState<ReportSeverity>('high');
  const [reporterName, setReporterName] = useState(userSession.name);
  const [imageUrl, setImageUrl] = useState('');
  const [formError, setFormError] = useState('');

  // Local user upvoted tracking to update UI instantly
  const [upvotedIds, setUpvotedIds] = useState<string[]>(userSession.upvotedReportIds || []);

  useEffect(() => {
    setReports(getReports());
    const session = getUserSession();
    setUpvotedIds(session.upvotedReportIds || []);
  }, []);

  // FIX INCORRECT COUNTING: Strict toggle per user ID
  const handleToggleUpvote = (id: string) => {
    const { updatedReports, hasVoted } = toggleReportUpvote(id);
    setReports(updatedReports);
    if (hasVoted) {
      setUpvotedIds(prev => [...prev, id]);
    } else {
      setUpvotedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLocationName(`Lat ${pos.coords.latitude.toFixed(4)}, Lon ${pos.coords.longitude.toFixed(4)}`);
        setGpsLoading(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGpsLoading(false);
        alert('Could not access GPS location. Please type your location landmark manually.');
      }
    );
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('Image must be smaller than 4MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !locationName.trim()) {
      setFormError('Please fill in all mandatory fields: Title, Location, and Description.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    try {
      await saveReport({
        title: title.trim(),
        description: description.trim(),
        locationName: locationName.trim(),
        latitude,
        longitude,
        severity,
        imageUrl: imageUrl || undefined,
        reporterName: reporterName.trim() || userSession.name,
      });

      setReports(getReports());
      const session = getUserSession();
      setUpvotedIds(session.upvotedReportIds || []);
      setIsModalOpen(false);

      // Reset form
      setTitle('');
      setDescription('');
      setLocationName('');
      setImageUrl('');
    } catch (err) {
      setFormError('Failed to save report. Please check details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (filterSeverity !== 'all' && r.severity !== filterSeverity) return false;
    return true;
  });

  const getSeverityBadge = (s: ReportSeverity) => {
    switch (s) {
      case 'critical':
        return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'high':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'medium':
        return 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
      default:
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    }
  };

  const getStatusBadge = (st: ReportStatus) => {
    switch (st) {
      case 'resolved':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'verified':
        return 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800';
      case 'investigating':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-dark-surface p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {language === 'hi' ? 'सामुदायिक मच्छर ब्रीडिंग निगरानी' : 'Geospatial Mosquito Breeding Surveillance'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-neon-teal/10 text-teal-700 dark:text-neon-teal border border-teal-200 dark:border-neon-teal/30">
              {reports.length} Verified Incidents
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'hi'
              ? 'ठहरे हुए पानी, कूलर व टायरों के ब्रीडिंग स्थलों का सार्वजनिक डेटाबेस एवं त्वरित निस्तारण।'
              : 'Citizen-assisted vector surveillance platform dispatching municipal response teams to eliminate larval foci.'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-neon-teal dark:hover:bg-teal-400 text-white dark:text-slate-950 text-xs sm:text-sm font-bold shadow-md shadow-teal-600/30 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'hi' ? 'नया ब्रीडिंग स्पॉट दर्ज करें' : 'Submit Breeding Report'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-dark-surface p-4 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-700 dark:text-slate-300">Surveillance Filters:</span>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-card text-slate-800 dark:text-slate-200 font-semibold outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">All Operational Statuses</option>
            <option value="pending">Pending Intake</option>
            <option value="investigating">Squad Dispatched</option>
            <option value="verified">Verified Hotspot</option>
            <option value="resolved">Treated / Cleared</option>
          </select>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-card text-slate-800 dark:text-slate-200 font-semibold outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical Hazard</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>

        <div className="text-slate-500 dark:text-slate-400 text-xs font-medium">
          Displaying {filteredReports.length} of {reports.length} verified surveillance entries
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.map((report) => {
          const isUpvotedByMe = upvotedIds.includes(report.id);

          return (
            <div
              key={report.id}
              className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm hover:shadow-md neon-card transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Photo attachment if available */}
                {report.imageUrl ? (
                  <div className="relative h-44 w-full bg-slate-100 dark:bg-dark-card overflow-hidden">
                    <img
                      src={report.imageUrl}
                      alt={report.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${getSeverityBadge(report.severity)}`}>
                        {report.severity}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black capitalize border shadow-sm ${getStatusBadge(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 pb-0 flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getSeverityBadge(report.severity)}`}>
                      {report.severity}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black capitalize border ${getStatusBadge(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                )}

                {/* Body */}
                <div className="p-5 space-y-2.5">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2">
                    {report.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {report.description}
                  </p>

                  <div className="pt-2 flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-neon-cyan shrink-0" />
                    <span className="truncate">{report.locationName}</span>
                  </div>

                  {report.adminNotes && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border text-[11px] text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-slate-900 dark:text-white">Municipal Action: </span>
                      {report.adminNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-dark-card/60 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  By {report.reporterName} • {new Date(report.createdAt).toLocaleDateString()}
                </span>

                {/* Corrected Upvote Toggle Button */}
                <button
                  type="button"
                  onClick={() => handleToggleUpvote(report.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-2xs border ${
                    isUpvotedByMe
                      ? 'bg-teal-600 text-white border-teal-700 dark:bg-neon-teal dark:text-dark-bg shadow-neon-teal'
                      : 'bg-white dark:bg-dark-surface border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-800'
                  }`}
                  title={isUpvotedByMe ? 'Click to withdraw confirmation' : 'Click to confirm you verified this hazard'}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${isUpvotedByMe ? 'fill-current' : ''}`} />
                  <span>{report.upvotes}</span>
                </button>
              </div>

            </div>
          );
        })}

        {filteredReports.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white dark:bg-dark-surface rounded-3xl border border-slate-200 dark:border-dark-border">
            <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto mb-2 opacity-80" />
            <h4 className="font-bold text-slate-800 dark:text-white text-base">No breeding spots found matching your filter</h4>
            <p className="text-xs text-slate-500 mt-1">Try switching filters or submit a new report.</p>
          </div>
        )}
      </div>

      {/* Submit Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-dark-border flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-slate-50 dark:bg-dark-card px-6 py-4 border-b border-slate-200 dark:border-dark-border flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-teal-100 dark:bg-neon-teal/20 text-teal-700 dark:text-neon-teal">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Register Vector Breeding Hazard</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Notifies municipal vector control squad</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Report Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Uncovered water tank with larvae in park"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-dark-card border border-slate-300 dark:border-dark-border rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Location & GPS detection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Location / Landmark *
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectGps}
                    disabled={gpsLoading}
                    className="text-xs text-teal-600 dark:text-neon-cyan hover:underline flex items-center gap-1 font-bold"
                  >
                    <Navigation className={`w-3 h-3 ${gpsLoading ? 'animate-spin' : ''}`} />
                    <span>{gpsLoading ? 'Detecting GPS...' : 'Auto-Detect GPS'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 12, Behind Community Hall, Near Gate 2"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-dark-card border border-slate-300 dark:border-dark-border rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Severity Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Breeding Risk Severity
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['low', 'medium', 'high', 'critical'] as ReportSeverity[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSeverity(lvl)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                        severity === lvl
                          ? lvl === 'critical' ? 'bg-rose-600 text-white border-rose-700' :
                            lvl === 'high' ? 'bg-amber-500 text-white border-amber-600' :
                            lvl === 'medium' ? 'bg-sky-500 text-white border-sky-600' :
                            'bg-emerald-500 text-white border-emerald-600'
                          : 'bg-slate-50 dark:bg-dark-card text-slate-600 dark:text-slate-300 border-slate-200 dark:border-dark-border'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hazard Description &amp; Larval Activity *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe standing water volume, presence of visible wriggling larvae, or mosquito swarms..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-dark-card border border-slate-300 dark:border-dark-border rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Attach Photo (Optional)
                </label>
                
                {imageUrl ? (
                  <div className="relative rounded-2xl overflow-hidden h-36 border border-slate-200 dark:border-dark-border">
                    <img src={imageUrl} alt="Uploaded preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 dark:border-dark-border hover:border-teal-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 dark:bg-dark-card hover:bg-teal-50/40 transition-colors">
                    <Camera className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Click to upload photo from camera or files</span>
                    <span className="text-[10px] text-slate-400">PNG, JPG, WebP up to 4MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                )}

                {/* Preset sample photos */}
                {!imageUrl && (
                  <div className="mt-2">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Or select a standard vector hazard image:</span>
                    <div className="flex gap-2">
                      {PRESET_SAMPLE_PHOTOS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImageUrl(p.url)}
                          className="px-2 py-1 rounded-lg text-[10px] font-medium bg-slate-100 dark:bg-dark-card hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-dark-border truncate"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-dark-border flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-dark-card"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-neon-teal dark:text-slate-950 shadow-md shadow-teal-600/30 transition-all flex items-center gap-1.5"
                >
                  {isSubmitting ? 'Registering...' : 'Register Hazard'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

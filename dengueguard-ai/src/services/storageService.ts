import { CommunityReport, ReminderItem, UserSession, ThemeMode, Language } from '../types';

const REPORTS_KEY = 'dengueguard_reports_v2';
const REMINDERS_KEY = 'dengueguard_reminders_v2';
const USER_KEY = 'dengueguard_session_v2';
const THEME_KEY = 'dengueguard_theme_v2';

export const INITIAL_REPORTS: CommunityReport[] = [
  {
    id: 'rep-101',
    title: 'Rainwater accumulation in discarded commercial tyres',
    description: 'Stack of ~12 commercial truck tyres left behind automobile workshop. Rainwater stagnant for 6 days with visible mosquito larvae clusters.',
    locationName: 'Sector 18, Block B, Near Metro Pillar 142',
    latitude: 28.5700,
    longitude: 77.3200,
    severity: 'critical',
    status: 'investigating',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Vikram Sharma',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    upvotes: 14,
    adminNotes: 'Rapid Vector Response Team dispatched for larvicide spraying (Temephos 50% EC).',
  },
  {
    id: 'rep-102',
    title: 'Uncovered municipal overhead reservoir with overflow leak',
    description: 'Overhead concrete tank missing protective mosquito netting cover. Overflow creating permanent 5-inch deep puddle in adjacent residential corridor.',
    locationName: 'Lajpat Nagar IV, Central Market Alley',
    latitude: 28.5670,
    longitude: 77.2430,
    severity: 'high',
    status: 'verified',
    imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Ananya Roy',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    upvotes: 9,
    adminNotes: 'Municipal water board notified to seal reservoir lid by Oct 31.',
  },
  {
    id: 'rep-103',
    title: 'Abandoned residential evaporative cooler with stagnant water',
    description: 'Metal desert cooler left with standing murky water on 1st-floor balcony of unoccupied property for over 2 weeks.',
    locationName: 'Green Park Extension, Lane 4',
    latitude: 28.5580,
    longitude: 77.2030,
    severity: 'medium',
    status: 'resolved',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Rahul Verma',
    createdAt: new Date(Date.now() - 3600000 * 52).toISOString(),
    upvotes: 21,
    adminNotes: 'Resolved: Property owner contacted; cooler drained, scrubbed, and dried.',
  },
  {
    id: 'rep-104',
    title: 'Clogged stormwater drainage culvert with standing water',
    description: 'Storm culvert obstructed by solid plastic waste. Heavy concentration of day-biting mosquitoes around children play park entrance.',
    locationName: 'Indiranagar 12th Main, Near Park Gate 3',
    latitude: 12.9784,
    longitude: 77.6408,
    severity: 'high',
    status: 'pending',
    reporterName: 'Priya Sundaram',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    upvotes: 5,
    adminNotes: 'Awaiting field inspector assignment.',
  }
];

export const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-1',
    title: 'Sunday Dry Day: Scrub & Dry Evaporative Desert Coolers',
    category: 'water_cooler',
    frequency: 'weekly',
    dayOfWeek: 0, // Sunday
    scheduledTime: '09:00',
    enabled: true,
    completionStreak: 3,
  },
  {
    id: 'rem-2',
    title: 'Inspect Potted Plant Saucers & AC Condensate Trays',
    category: 'flower_pots',
    frequency: 'weekly',
    dayOfWeek: 3, // Wednesday
    scheduledTime: '17:30',
    enabled: true,
    completionStreak: 2,
  },
  {
    id: 'rem-3',
    title: 'Dusk Repellent Application (Peak Vector Biting Window)',
    category: 'repellent',
    frequency: 'daily',
    scheduledTime: '16:45',
    enabled: true,
    completionStreak: 5,
  },
  {
    id: 'rem-4',
    title: 'Rooftop & Balcony Inspection for Discarded Containers',
    category: 'cleanup',
    frequency: 'weekly',
    dayOfWeek: 6, // Saturday
    scheduledTime: '10:00',
    enabled: true,
    completionStreak: 1,
  }
];

export const getStoredTheme = (): ThemeMode => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch (e) {}
  return 'dark'; // Default to modern neon dark theme
};

export const setStoredTheme = (theme: ThemeMode): void => {
  localStorage.setItem(THEME_KEY, theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const getUserSession = (): UserSession => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.upvotedReportIds) parsed.upvotedReportIds = [];
      return parsed;
    }
  } catch (e) {}

  const defaultSession: UserSession = {
    id: 'usr-' + Math.random().toString(36).substring(2, 9),
    name: 'Healthcare Advocate',
    email: 'advocate@dengueguard.org',
    role: 'citizen',
    savedCity: 'New Delhi',
    preferredLanguage: 'en',
    theme: 'dark',
    upvotedReportIds: [],
  };
  localStorage.setItem(USER_KEY, JSON.stringify(defaultSession));
  return defaultSession;
};

export const saveUserSession = (session: UserSession): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(session));
};

export const getReports = (): CommunityReport[] => {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (!raw) {
      localStorage.setItem(REPORTS_KEY, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_REPORTS;
  }
};

export const saveReport = async (report: Omit<CommunityReport, 'id' | 'createdAt' | 'upvotes' | 'status'>): Promise<CommunityReport> => {
  const newReport: CommunityReport = {
    ...report,
    id: 'rep-' + Date.now(),
    createdAt: new Date().toISOString(),
    upvotes: 1,
    status: 'pending',
    adminNotes: 'Field inspection queued by municipal intake.',
  };

  const list = getReports();
  const updated = [newReport, ...list];
  localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));

  // Sync with backend if available
  try {
    await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReport),
    });
  } catch (e) {
    // Offline resilience
  }

  // Auto-mark upvoted for the author
  const session = getUserSession();
  if (!session.upvotedReportIds.includes(newReport.id)) {
    session.upvotedReportIds.push(newReport.id);
    saveUserSession(session);
  }

  return newReport;
};

// FIX INCORRECT COUNTING: Precise, idempotent upvote toggle per user
export const toggleReportUpvote = (reportId: string): { updatedReports: CommunityReport[]; hasVoted: boolean } => {
  const session = getUserSession();
  const hasAlreadyVoted = session.upvotedReportIds.includes(reportId);
  const list = getReports();

  let nextHasVoted = false;
  const updated = list.map(r => {
    if (r.id === reportId) {
      if (hasAlreadyVoted) {
        // Toggle off: decrement count once
        nextHasVoted = false;
        return { ...r, upvotes: Math.max(0, r.upvotes - 1) };
      } else {
        // Toggle on: increment count once
        nextHasVoted = true;
        return { ...r, upvotes: r.upvotes + 1 };
      }
    }
    return r;
  });

  if (hasAlreadyVoted) {
    session.upvotedReportIds = session.upvotedReportIds.filter(id => id !== reportId);
  } else {
    session.upvotedReportIds.push(reportId);
  }

  saveUserSession(session);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));

  // Sync to backend
  try {
    fetch(`/api/reports/${reportId}/upvote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.id }),
    });
  } catch (e) {}

  return { updatedReports: updated, hasVoted: nextHasVoted };
};

export const updateReportStatus = async (
  reportId: string,
  newStatus: CommunityReport['status'],
  notes?: string
): Promise<CommunityReport[]> => {
  const list = getReports();
  const updated = list.map(r => {
    if (r.id === reportId) {
      return {
        ...r,
        status: newStatus,
        adminNotes: notes !== undefined ? notes : r.adminNotes,
      };
    }
    return r;
  });
  localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));

  try {
    await fetch(`/api/reports/${reportId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, adminNotes: notes }),
    });
  } catch (e) {}

  return updated;
};

export const deleteReport = async (reportId: string): Promise<CommunityReport[]> => {
  const list = getReports();
  const updated = list.filter(r => r.id !== reportId);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));

  try {
    await fetch(`/api/reports/${reportId}`, { method: 'DELETE' });
  } catch (e) {}

  return updated;
};

export const getReminders = (): ReminderItem[] => {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    if (!raw) {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(INITIAL_REMINDERS));
      return INITIAL_REMINDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_REMINDERS;
  }
};

export const saveReminder = (reminder: Omit<ReminderItem, 'id' | 'completionStreak'>): ReminderItem[] => {
  const newItem: ReminderItem = {
    ...reminder,
    id: 'rem-' + Date.now(),
    completionStreak: 0,
  };
  const list = getReminders();
  const updated = [...list, newItem];
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(updated));
  return updated;
};

export const toggleReminder = (id: string): ReminderItem[] => {
  const list = getReminders();
  const updated = list.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteReminder = (id: string): ReminderItem[] => {
  const list = getReminders();
  const updated = list.filter(r => r.id !== id);
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(updated));
  return updated;
};

export const markReminderDone = (id: string): ReminderItem[] => {
  const list = getReminders();
  const todayStr = new Date().toLocaleDateString();
  const updated = list.map(r => {
    if (r.id === id) {
      // Prevent incrementing streak multiple times on the same date
      const alreadyDoneToday = r.lastDone === todayStr;
      return {
        ...r,
        lastDone: todayStr,
        completionStreak: alreadyDoneToday ? r.completionStreak : (r.completionStreak || 0) + 1,
      };
    }
    return r;
  });
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(updated));
  return updated;
};

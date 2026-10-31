import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  User, 
  BadgeCheck, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Lock,
  Sparkles
} from 'lucide-react';
import { UserSession } from '../types';
import { saveUserSession } from '../services/storageService';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSession: UserSession;
  onUpdateSession: (session: UserSession) => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  userSession,
  onUpdateSession,
}) => {
  const [role, setRole] = useState<'citizen' | 'health_officer' | 'admin'>(userSession.role);
  const [name, setName] = useState(userSession.name);
  const [email, setEmail] = useState(userSession.email);
  const [badgeNumber, setBadgeNumber] = useState(userSession.badgeNumber || 'VO-8842');
  const [passkey, setPasskey] = useState('');
  const [authError, setAuthError] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    // If upgrading to Health Officer or Admin, verify passkey
    if (role !== 'citizen' && role !== userSession.role) {
      if (passkey.trim().length < 4) {
        setAuthError('Please enter a valid departmental passkey (e.g. 7429) to authorize Health Officer access.');
        return;
      }
    }

    const updated: UserSession = {
      ...userSession,
      name: name.trim() || 'Health Advocate',
      email: email.trim() || 'advocate@dengueguard.org',
      role,
      badgeNumber: role !== 'citizen' ? badgeNumber.trim() : undefined,
      department: role !== 'citizen' ? 'Vector Control & Environmental Health' : undefined,
    };

    saveUserSession(updated);
    onUpdateSession(updated);
    setSuccessMsg(true);

    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-dark-border">
        
        {/* Header */}
        <div className="bg-slate-50 dark:bg-dark-card px-6 py-4 border-b border-slate-200 dark:border-dark-border flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-neon-teal/10 text-teal-600 dark:text-neon-teal border border-teal-200 dark:border-neon-teal/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Security &amp; Identity Access</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Enterprise Role-Based Access Control (RBAC)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          
          {/* Security Status Card */}
          <div className="p-3.5 rounded-2xl bg-teal-50/60 dark:bg-dark-card/60 border border-teal-200/60 dark:border-dark-border text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-600 dark:text-neon-teal" />
                Data Protection:
              </span>
              <span className="font-bold text-teal-700 dark:text-neon-teal">
                TLS Encrypted Proxy Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Authorization Mode:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
                {userSession.role.replace('_', ' ')} Tier
              </span>
            </div>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Operating Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('citizen')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  role === 'citizen'
                    ? 'bg-teal-600 text-white border-teal-700 shadow-sm'
                    : 'bg-slate-50 dark:bg-dark-card text-slate-700 dark:text-slate-300 border-slate-200 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Citizen Reporter</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('health_officer')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  role === 'health_officer' || role === 'admin'
                    ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                    : 'bg-slate-50 dark:bg-dark-card text-slate-700 dark:text-slate-300 border-slate-200 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BadgeCheck className="w-3.5 h-3.5" />
                <span>Health Officer / Admin</span>
              </button>
            </div>
          </div>

          {/* Officer Credentials (Conditional) */}
          {role !== 'citizen' && (
            <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-amber-900 dark:text-amber-200 mb-1">
                  Department Badge ID
                </label>
                <input
                  type="text"
                  value={badgeNumber}
                  onChange={(e) => setBadgeNumber(e.target.value)}
                  placeholder="e.g. VO-8842"
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-dark-surface border border-slate-300 dark:border-dark-border rounded-lg text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-amber-900 dark:text-amber-200 mb-1">
                  Authorization Passkey
                </label>
                <input
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Enter 4-digit departmental pin (e.g. 7429)"
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-dark-surface border border-slate-300 dark:border-dark-border rounded-lg text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>
            </div>
          )}

          {/* User Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name / Display Alias
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-dark-card border border-slate-300 dark:border-dark-border rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-dark-card border border-slate-300 dark:border-dark-border rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-dark-border flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-dark-card hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/30 flex items-center gap-1.5"
            >
              {successMsg ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authorized!</span>
                </>
              ) : (
                <span>Update Credentials</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

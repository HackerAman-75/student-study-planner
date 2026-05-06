import React, { useState } from 'react';
import { useStudyStore } from '../store.ts';
import { 
  User as UserIcon, 
  Mail, 
  Target, 
  LogOut, 
  Shield, 
  Bell,
  Save,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils.ts';

export function Settings() {
  const { user, updateUser, logout } = useStudyStore();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dailyGoal: user?.dailyGoal || 4,
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateUser(profile);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-10">
      <header>
        <motion.h1 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="text-4xl font-extrabold text-slate-900 tracking-tight"
        >
          App Settings
        </motion.h1>
        <motion.p 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.1 }}
           className="text-slate-500 font-medium mt-1"
        >
          Personalize StudyFlow and manage your preferences.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">User Profile</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] font-extrabold text-slate-400 mb-3 block">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-slate-900 outline-none focus:border-red-500 focus:bg-white transition-all font-bold"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] font-extrabold text-slate-400 mb-3 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="email" 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-slate-900 outline-none focus:border-red-500 focus:bg-white transition-all font-bold"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.2em] font-extrabold text-slate-400 mb-3 block">Daily Study Goal (Hours)</label>
                <div className="flex items-center gap-6">
                  <div className="relative flex-1">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="range" 
                      min="1" 
                      max="12" 
                      step="0.5"
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-600 mt-6"
                      value={profile.dailyGoal}
                      onChange={(e) => setProfile({...profile, dailyGoal: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="w-20 text-center py-3 bg-red-50 rounded-2xl border-2 border-red-100 text-red-600 font-black text-lg">
                    {profile.dailyGoal}h
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-400 font-medium italic">We'll use this to track your progress on the dashboard.</p>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-50 flex justify-end">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className={cn(
                  "px-10 py-4 rounded-2xl font-black transition-all flex items-center gap-2",
                  isSaved 
                    ? "bg-emerald-500 text-white shadow-xl shadow-emerald-100" 
                    : "bg-red-600 text-white shadow-xl shadow-red-100 hover:bg-red-700"
                )}
              >
                {isSaved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                {isSaved ? 'Details Saved!' : 'Save Changes'}
              </motion.button>
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-8">Preferences</h3>
            <div className="space-y-4">
              <ToggleRow icon={Bell} label="Push Notifications" description="Receive reminders for upcoming tasks." />
              <ToggleRow icon={Shield} label="Privacy Mode" description="Hide sensitive detail from public view." />
            </div>
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-200"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-[60px] -mr-16 -mt-16 opacity-50" />
            
            <h3 className="text-xl font-bold mb-4 relative z-10">Sign Out</h3>
            <p className="text-slate-400 text-sm mb-10 relative z-10 leading-relaxed">
              Your profile data and settings are stored locally. Re-entering will require the same device.
            </p>
            <button 
              onClick={logout}
              className="w-full bg-white/10 hover:bg-white text-white hover:text-slate-900 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 border border-white/10 backdrop-blur-sm"
            >
              <LogOut className="w-5 h-5" />
              Sign Out Securely
            </button>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5 }}
             className="bg-red-50 rounded-[2.5rem] p-10 border-2 border-red-100"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Target className="w-6 h-6 text-red-600" />
            </div>
            <h4 className="text-red-900 font-black text-xl mb-2">Focus Tip</h4>
            <p className="text-red-700/70 text-sm font-medium leading-relaxed">
              Academic research suggests that the ideal deep-work block is roughly <span className="font-bold">90 minutes</span>. Try to schedule your sessions accordingly!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ icon: Icon, label, description }: any) {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
          <Icon className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900">{label}</div>
          <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{description}</div>
        </div>
      </div>
      <button 
        onClick={() => setEnabled(!enabled)}
        className={cn(
          "w-12 h-7 rounded-full transition-all relative p-1",
          enabled ? "bg-red-600 shadow-lg shadow-red-200" : "bg-slate-200"
        )}
      >
        <div className={cn(
          "absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm",
          enabled ? "left-6" : "left-1"
        )} />
      </button>
    </div>
  );
}

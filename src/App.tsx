import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { Subjects } from './pages/Subjects.tsx';
import { Tasks } from './pages/Tasks.tsx';
import { Planner } from './pages/Planner.tsx';
import { Settings } from './pages/Settings.tsx';
import { GraduationCap, ArrowRight, User as UserIcon, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { useStudyStore } from './store.ts';

// Simple Auth Wrap
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useStudyStore();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('study_flow_auth') === 'true';
  });
  const [loginData, setLoginData] = useState({ 
    name: user?.name || '', 
    email: user?.email || '' 
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-50 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] -ml-48 -mb-48 pointer-events-none opacity-50" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white rounded-[3.5rem] p-12 shadow-2xl relative z-10"
        >
           <div className="text-center">
              <motion.div 
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-24 h-24 bg-red-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-red-200"
              >
                <GraduationCap className="text-white w-12 h-12" />
              </motion.div>
              
              <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">StudyFlow</h1>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed px-4">
                Access your personalized academic suite.
              </p>

              <div className="space-y-4 mb-8 text-left">
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="Your Name"
                    value={loginData.name}
                    onChange={(e) => setLoginData({...loginData, name: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-slate-900 outline-none focus:border-red-500 focus:bg-white transition-all font-bold placeholder:text-slate-300"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password" 
                    placeholder="Password (anything)"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-slate-900 outline-none focus:border-red-500 focus:bg-white transition-all font-bold placeholder:text-slate-300"
                  />
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  localStorage.setItem('study_flow_auth', 'true');
                  setIsAuthenticated(true);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-[1.8rem] font-black text-lg flex items-center justify-center gap-3 group transition-all shadow-2xl shadow-red-200"
              >
                Sign In
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <div className="mt-12 group">
                <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                  Privacy Guaranteed
                </div>
                <div className="flex justify-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-200 group-hover:bg-red-300 transition-colors" />
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 group-hover:bg-red-500 transition-colors" />
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 group-hover:bg-red-700 transition-colors" />
                </div>
              </div>
           </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthGuard>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthGuard>
    </BrowserRouter>
  );
}

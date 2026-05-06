import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  Calendar, 
  Settings,
  GraduationCap,
  LogOut,
  Timer as TimerIcon,
  ClipboardList
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils.ts';
import { useStudyStore } from '../store.ts';

interface SidebarProps {
  className?: string;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: BookOpen, label: 'Subjects', path: '/subjects' },
  { icon: ClipboardList, label: 'Assignments', path: '/tasks' },
  { icon: TimerIcon, label: 'Focus Timer', path: '/planner' },
];

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useStudyStore();

  return (
    <aside className={cn("w-72 h-screen bg-slate-50 border-r border-slate-100 flex flex-col p-8", className)}>
      <div className="flex items-center gap-4 mb-12 px-2">
        <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-200">
          <GraduationCap className="text-white w-7 h-7" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">StudyFlow</span>
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1">Academic Suite</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300",
              isActive 
                ? "bg-red-600 text-white shadow-xl shadow-red-100 translate-x-2" 
                : "text-slate-400 hover:text-slate-900 hover:bg-white"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400")} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="pt-8 space-y-2">
        <NavLink
            to="/settings"
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 text-slate-400 hover:text-slate-900 hover:bg-white",
              isActive && "bg-red-50 text-red-600"
            )}
          >
            <Settings className="w-5 h-5" />
            Settings
          </NavLink>

        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-50 rounded-2xl shadow-sm mb-4">
             <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
               {user?.name?.charAt(0) || 'S'}
             </div>
             <div className="flex-1 min-w-0">
               <div className="text-xs font-black text-slate-900 truncate">{user?.name}</div>
               <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{user?.email}</div>
             </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-white text-slate-900 overflow-hidden font-sans">
      <Sidebar className="hidden lg:flex" />
      <main className="flex-1 overflow-y-auto bg-slate-50/30 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-50 rounded-full blur-[120px] -mr-64 -mt-64 opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] -ml-64 -mb-64 opacity-30 pointer-events-none" />
        
        <motion.div
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
           className="p-10 max-w-7xl mx-auto relative z-10"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

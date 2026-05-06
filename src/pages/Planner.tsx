import { useState, useEffect } from 'react';
import { useStudyStore } from '../store.ts';
import { 
  Play, 
  Pause, 
  Square, 
  Timer, 
  History, 
  BookOpen,
  Trophy,
  Coffee,
  Zap,
  ChevronRight,
  Plus
} from 'lucide-react';
import { format, differenceInSeconds } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils.ts';

export function Planner() {
  const { subjects, sessions, addSession } = useStudyStore();
  const [activeSubject, setActiveSubject] = useState(subjects[0]?.id || '');
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
    setStartTime(new Date());
  };

  const handleStop = () => {
    if (startTime) {
      addSession({
        subjectId: activeSubject,
        startTime: startTime,
        endTime: new Date(),
        notes: '',
      });
    }
    setIsActive(false);
    setSeconds(0);
    setStartTime(null);
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-10">
      <header>
        <motion.h1 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="text-4xl font-extrabold text-slate-900 tracking-tight"
        >
          Study Focus
        </motion.h1>
        <motion.p 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.1 }}
           className="text-slate-500 font-medium mt-1"
        >
          Track your deep-work sessions and build a daily habit.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Timer UI */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white border border-slate-100 rounded-[3rem] p-12 shadow-sm relative overflow-hidden flex flex-col items-center text-center"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-60" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-[100px] -ml-32 -mb-32 opacity-40" />

          <div className="relative mb-12 w-full">
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {subjects.map(subject => (
                <button
                  key={subject.id}
                  onClick={() => !isActive && setActiveSubject(subject.id)}
                  className={cn(
                    "px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2",
                    activeSubject === subject.id 
                      ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200 scale-105" 
                      : "bg-white text-slate-400 border-slate-50 hover:border-slate-200 grayscale",
                    isActive && activeSubject !== subject.id && "opacity-30 cursor-not-allowed"
                  )}
                  style={activeSubject === subject.id ? { backgroundColor: subject.color, borderColor: subject.color } : {}}
                >
                  {subject.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center">
               <motion.div 
                 animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="relative w-72 h-72 rounded-full border-[12px] border-slate-50 flex items-center justify-center p-10 bg-white shadow-2xl shadow-slate-100 mb-12"
               >
                 <div 
                    className="absolute inset-0 rounded-full border-[12px] border-red-500 transition-all duration-1000" 
                    style={{ 
                      clipPath: `conic-gradient(from 0deg, #ef4444 ${(seconds % 3600) / 36}deg, transparent 0deg)`,
                      opacity: isActive ? 1 : 0.1
                    }} 
                 />
                 <div className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums">
                    {formatTime(seconds)}
                 </div>
               </motion.div>

               <div className="flex items-center gap-6">
                 {!isActive ? (
                   <motion.button 
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={handleStart}
                     disabled={!activeSubject}
                     className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-red-200 transition-all hover:bg-red-700 disabled:opacity-50"
                   >
                     <Play className="w-8 h-8 fill-current ml-1" />
                   </motion.button>
                 ) : (
                   <>
                    <motion.button 
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => setIsActive(false)}
                       className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all"
                    >
                       <Pause className="w-6 h-6 fill-current" />
                    </motion.button>
                    <motion.button 
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={handleStop}
                       className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-2xl shadow-slate-200 hover:bg-black transition-all"
                    >
                       <Square className="w-8 h-8 fill-current" />
                    </motion.button>
                   </>
                 )}
               </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 w-full max-w-md pt-8 border-t border-slate-50">
             <div className="flex flex-col items-center">
               <Coffee className="w-5 h-5 text-slate-300 mb-2" />
               <div className="text-sm font-black text-slate-900">2 Breather</div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Breaks taken</div>
             </div>
             <div className="flex flex-col items-center border-x border-slate-50">
               <Zap className="w-5 h-5 text-red-500 mb-2" />
               <div className="text-sm font-black text-slate-900">4.2h</div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today</div>
             </div>
             <div className="flex flex-col items-center">
               <Trophy className="w-5 h-5 text-orange-400 mb-2" />
               <div className="text-sm font-black text-slate-900">Day 12</div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Streak</div>
             </div>
          </div>
        </motion.div>

        {/* History UI */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-red-500" />
              Recent Logs
            </h2>
            <button className="text-slate-400 hover:text-slate-600">
               <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
            {sessions.length > 0 ? (
              sessions.slice().reverse().map((session, idx) => {
                const subject = subjects.find(s => s.id === session.subjectId);
                const diff = (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000;
                const duration = Math.round(diff / 60);
                
                return (
                  <motion.div 
                    key={session.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (idx * 0.05) }}
                    className="p-5 rounded-3xl bg-slate-50 border border-transparent hover:bg-white hover:border-red-50 hover:shadow-lg transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div 
                         className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border"
                         style={{ color: subject?.color, backgroundColor: `${subject?.color}10`, borderColor: `${subject?.color}20` }}
                      >
                        {subject?.name || 'General'}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400">{format(new Date(session.startTime), 'MMM dd')}</div>
                    </div>
                    <div className="flex items-end justify-between">
                       <div>
                         <div className="text-lg font-black text-slate-900">{duration}m</div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Focused Duration</div>
                       </div>
                       <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-red-500 transform group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <Timer className="w-12 h-12 text-slate-100 mb-4" />
                <p className="text-slate-400 font-medium text-sm">No study logs yet.<br />Ready to start a session?</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

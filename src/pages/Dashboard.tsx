import { useStudyStore } from '../store.ts';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Calendar as CalendarIcon,
  ChevronRight,
  Target
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { cn } from '../lib/utils.ts';
import { motion } from 'motion/react';

export function Dashboard() {
  const { tasks, sessions, subjects, user } = useStudyStore();

  const today = format(new Date(), 'yyyy-MM-dd');
  const todaySessions = sessions.filter(s => s.date === today);
  const todayHours = todaySessions.reduce((acc, s) => {
    const diff = (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / (1000 * 3600);
    return acc + diff;
  }, 0);

  const dailyGoal = user?.dailyGoal || 4;
  const goalProgress = Math.min(100, Math.round((todayHours / dailyGoal) * 100));

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Prepare chart data for the last 7 days
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const day = addDays(weekStart, i);
    const daySessions = sessions.filter(s => isSameDay(new Date(s.startTime), day));
    const totalMinutes = daySessions.reduce((acc, s) => {
      return acc + (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / (1000 * 60);
    }, 0);
    return {
      name: format(day, 'EEE'),
      hours: parseFloat((totalMinutes / 60).toFixed(1)),
    };
  });

  const upcomingTasks = tasks
    .filter(t => t.status === 'pending')
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
    .slice(0, 4);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Dashboard
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-medium mt-1"
          >
            Welcome back, <span className="text-slate-900 font-bold">{user?.name}</span>! You have <span className="text-red-500 font-bold">{pendingTasks} tasks</span> pending.
          </motion.p>
        </div>
        <div className="flex items-center gap-4 bg-white border border-slate-100 p-3 rounded-3xl shadow-sm">
           <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
             <Target className="w-6 h-6 text-red-600" />
           </div>
           <div>
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Goal</div>
             <div className="text-sm font-bold text-slate-900">{todayHours.toFixed(1)}h / {dailyGoal}h</div>
           </div>
           <div className="w-12 h-12 rounded-full border-4 border-slate-50 relative flex items-center justify-center">
             <div 
                className="absolute inset-0 rounded-full border-4 border-red-500 transition-all duration-1000" 
                style={{ 
                  clipPath: `conic-gradient(from 0deg, #ef4444 ${goalProgress * 3.6}deg, transparent 0deg)`,
                  opacity: goalProgress > 0 ? 1 : 0
                }} 
              />
             <span className="text-[10px] font-black text-red-600">{goalProgress}%</span>
           </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={CheckCircle2} 
          label="Completed" 
          value={completedTasks} 
          sublabel="Milestones reached"
          color="text-emerald-600"
          bg="bg-emerald-50"
          index={0}
        />
        <StatCard 
          icon={Clock} 
          label="Pending" 
          value={pendingTasks} 
          sublabel="In progress"
          color="text-red-600"
          bg="bg-red-50"
          index={1}
        />
        <StatCard 
          icon={AlertCircle} 
          label="Urgent" 
          value={tasks.filter(t => t.priority === 'high' && t.status === 'pending').length} 
          sublabel="Immediate attention"
          color="text-orange-600"
          bg="bg-orange-50"
          index={2}
        />
        <StatCard 
          icon={TrendingUp} 
          label="Progress" 
          value={`${progressPercent}%`} 
          sublabel="Total completion"
          color="text-blue-600"
          bg="bg-blue-50"
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-50/50 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <h2 className="text-xl font-bold text-slate-900">Weekly Activity</h2>
            <div className="px-4 py-1.5 bg-slate-50 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">
              Session Hours
            </div>
          </div>
          <div className="h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ fontWeight: 700, color: '#ef4444' }}
                />
                <Bar dataKey="hours" radius={[8, 8, 8, 8]} barSize={40}>
                   {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.hours > 0 ? '#ef4444' : '#f1f5f9'} 
                      className="transition-all duration-500 hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">Up Next</h2>
            <button className="text-red-500 font-bold text-xs uppercase tracking-widest hover:underline">View All</button>
          </div>

          <div className="flex-1 space-y-4">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task, idx) => {
                const subject = subjects.find(s => s.id === task.subjectId);
                return (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (idx * 0.1) }}
                    className="group p-5 bg-white border border-slate-50 rounded-2xl hover:border-red-100 hover:shadow-xl hover:shadow-red-500/5 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                       <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subject?.color || '#ef4444' }} />
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {subject?.name || 'General'}
                        </span>
                       </div>
                       <div className="text-[10px] bg-slate-50 px-2 py-1 rounded-lg font-bold text-slate-500">
                        {format(task.deadline, 'MMM dd')}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors truncate pr-4">
                        {task.title}
                      </h3>
                      <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                <CalendarIcon className="w-12 h-12 text-slate-200 mb-4" />
                <p className="text-slate-400 font-medium text-sm">Your schedule is clear!<br />Time for a break? ☕️</p>
              </div>
            )}
          </div>

          {totalTasks > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-50">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall Productivity</span>
                 <span className="text-sm font-bold text-red-500">{progressPercent}%</span>
               </div>
               <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-red-500 rounded-full" 
                 />
               </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sublabel, color, bg, index }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white border border-slate-100 rounded-[2rem] p-7 shadow-sm relative overflow-hidden group hover:border-red-100 hover:shadow-xl hover:shadow-red-500/5 transition-all"
    >
      <div className={cn("inline-flex p-3 rounded-2xl mb-6 shadow-sm", bg)}>
        <Icon className={cn("w-6 h-6", color)} />
      </div>
      <div className="relative z-10">
        <div className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{value}</div>
        <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4">{label}</div>
        <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full inline-block">{sublabel}</div>
      </div>
    </motion.div>
  );
}

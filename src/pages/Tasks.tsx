import { useState } from 'react';
import { useStudyStore } from '../store.ts';
import { 
  Plus, 
  Search, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  Circle,
  Clock,
  Trash2,
  AlertCircle,
  X,
  PlusCircle,
  Check
} from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils.ts';

export function Tasks() {
  const { tasks, subjects, addTask, updateTask, deleteTask } = useStudyStore();
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const [newTask, setNewTask] = useState({
    title: '',
    subjectId: subjects[0]?.id || '',
    deadline: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    priority: 'medium' as const,
  });

  const handleAddTask = () => {
    if (!newTask.title || !newTask.subjectId) return;
    addTask({
      title: newTask.title,
      subjectId: newTask.subjectId,
      deadline: new Date(newTask.deadline),
      priority: newTask.priority,
    });
    setIsAdding(false);
    setNewTask({
      title: '',
      subjectId: subjects[0]?.id || '',
      deadline: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      priority: 'medium',
    });
  };

  const filteredTasks = tasks
    .filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || t.status === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime());

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Tasks & Assignments
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
             className="text-slate-500 font-medium mt-1"
          >
            Manage your daily goals and academic milestones.
          </motion.p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAdding(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-red-200 self-start"
        >
          <PlusCircle className="w-5 h-5" />
          Quick Add Task
        </motion.button>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search assignments by name..."
            className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-3.5 text-sm font-semibold text-slate-700 outline-none focus:border-red-500 transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 p-1.5 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-black capitalize tracking-widest transition-all",
                filter === f ? "bg-red-600 text-white shadow-lg shadow-red-100" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-4 relative">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => {
              const subject = subjects.find(s => s.id === task.subjectId);
              const isOverdue = isPast(task.deadline) && task.status === 'pending';
              const isDueToday = isToday(task.deadline) && task.status === 'pending';

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "group flex items-center gap-6 p-6 rounded-[2rem] border-2 transition-all duration-400",
                    task.status === 'completed' 
                      ? "bg-slate-50 border-slate-100 opacity-60" 
                      : "bg-white border-slate-100 hover:border-red-100 hover:shadow-2xl hover:shadow-red-500/5 hover:-translate-y-1"
                  )}
                >
                  <button 
                    onClick={() => updateTask(task.id, { status: task.status === 'completed' ? 'pending' : 'completed' })}
                    className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                      task.status === 'completed' 
                        ? "bg-red-600 border-red-600 text-white" 
                        : "border-slate-200 text-transparent hover:border-red-400 hover:text-red-400"
                    )}
                  >
                    <Check className="w-5 h-5 stroke-[4px]" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <div 
                        className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border"
                        style={{ color: subject?.color, backgroundColor: `${subject?.color}10`, borderColor: `${subject?.color}20` }}
                      >
                        {subject?.name || 'Academic'}
                      </div>
                      <div className={cn(
                        "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-lg border",
                        task.priority === 'high' ? "text-orange-600 bg-orange-50 border-orange-100" : "text-slate-400 border-slate-100"
                      )}>
                        {task.priority} Priority
                      </div>
                    </div>
                    <h3 className={cn(
                      "text-lg font-bold truncate transition-colors",
                      task.status === 'completed' ? "text-slate-400 line-through" : "text-slate-900 group-hover:text-red-600"
                    )}>
                      {task.title}
                    </h3>
                  </div>

                  <div className="flex flex-col items-end gap-3 pr-2">
                    <div className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold text-xs",
                      isOverdue ? "bg-red-50 border-red-100 text-red-600" : 
                      isDueToday ? "bg-orange-50 border-orange-100 text-orange-600" :
                      "bg-slate-50 border-slate-50 text-slate-500"
                    )}>
                      <Clock className="w-4 h-4" />
                      <span className="font-mono">{format(task.deadline, 'MMM dd, HH:mm')}</span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                       <button 
                        onClick={() => deleteTask(task.id)}
                        className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-white border-4 border-dashed border-slate-100 rounded-[3rem]"
            >
              <CheckCircle2 className="w-16 h-16 text-slate-100 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-slate-300">All clear! No tasks found.</h3>
              <p className="text-slate-400 mt-2 font-medium">Add a new assignment to get started.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-50 transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="absolute top-0 left-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -ml-16 -mt-16 opacity-50" />

              <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight relative z-10">New Activity</h2>
              <p className="text-slate-500 font-medium mb-10 relative z-10">Define your goals and set a deadline.</p>
              
              <div className="space-y-8 relative z-10">
                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] font-extrabold text-slate-400 mb-3 block">Task Description</label>
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="e.g. Finish React Hooks deep-dive"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 outline-none focus:border-red-500 focus:bg-white transition-all font-bold placeholder:text-slate-300"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[11px] uppercase tracking-[0.2em] font-extrabold text-slate-400 mb-3 block">Subject</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 outline-none focus:border-red-500 focus:bg-white transition-all font-bold appearance-none cursor-pointer"
                        value={newTask.subjectId}
                        onChange={(e) => setNewTask({...newTask, subjectId: e.target.value})}
                      >
                        {subjects.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                      <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                   <div>
                    <label className="text-[11px] uppercase tracking-[0.2em] font-extrabold text-slate-400 mb-3 block">Priority</label>
                    <div className="grid grid-cols-3 gap-2 p-1 bg-slate-50 border-2 border-slate-100 rounded-2xl">
                      {(['low', 'medium', 'high'] as const).map(p => (
                        <button
                          key={p}
                          onClick={() => setNewTask({...newTask, priority: p})}
                          className={cn(
                            "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            newTask.priority === p 
                              ? "bg-white text-red-600 shadow-sm border border-red-100" 
                              : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] font-extrabold text-slate-400 mb-3 block">Deadline</label>
                  <input 
                    type="datetime-local" 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-slate-900 outline-none focus:border-red-500 focus:bg-white transition-all font-bold"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-12 relative z-10">
                <button 
                   onClick={handleAddTask}
                   disabled={!newTask.title || !newTask.subjectId}
                   className="flex-[2] bg-red-600 hover:bg-red-700 text-white py-5 rounded-[1.5rem] font-black text-lg transition-all shadow-xl shadow-red-200 disabled:opacity-50 disabled:shadow-none"
                >
                  Create Task
                </button>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-5 rounded-[1.5rem] font-bold transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState } from 'react';
import { useStudyStore } from '../store.ts';
import { 
  Plus, 
  Trash2, 
  BookOpen, 
  Calculator, 
  Code, 
  Zap, 
  Palette,
  Atom,
  ChevronRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils.ts';

const icons = [
  { id: 'BookOpen', icon: BookOpen },
  { id: 'Calculator', icon: Calculator },
  { id: 'Code', icon: Code },
  { id: 'Zap', icon: Zap },
  { id: 'Palette', icon: Palette },
  { id: 'Atom', icon: Atom },
];

const colors = [
  '#ef4444', '#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#4b5563'
];

export function Subjects() {
  const { subjects, addSubject, deleteSubject } = useStudyStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('BookOpen');
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addSubject({
      name: newName.trim(), 
      color: selectedColor,
      icon: selectedIcon,
    } as any);
    setNewName('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            My Subjects
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-medium mt-1"
          >
            Organize your curriculum and track your weekly progress.
          </motion.p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAdding(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-red-200"
        >
          <Plus className="w-5 h-5" />
          Add Subject
        </motion.button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {subjects.map((subject, index) => {
            const IconComponent = icons.find(i => i.id === subject.icon)?.icon || BookOpen;
            return (
              <motion.div
                key={subject.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "bg-white border-2 border-slate-100 rounded-[2rem] p-8 group relative overflow-hidden transition-all duration-300 hover:border-red-100 hover:shadow-2xl hover:shadow-red-500/5",
                )}
              >
                <div 
                  className="absolute top-0 right-0 w-40 h-40 opacity-[0.03] rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150"
                  style={{ backgroundColor: subject.color }}
                />
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner"
                    style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
                  >
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <button 
                    onClick={() => deleteSubject(subject.id)}
                    className="text-slate-300 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 truncate">{subject.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold uppercase tracking-wider mb-8">
                     <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: subject.color }} />
                     Academic Module
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-tighter">
                      <span>Course Progress</span>
                      <span style={{ color: subject.color }}>40%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '40%' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                   <span className="text-xs font-bold text-slate-400">ID: {subject.id.slice(0, 8)}</span>
                   <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-red-400 transform group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight text-center">New Subject</h2>
              
              <div className="space-y-8">
                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] font-extrabold text-slate-400 mb-3 block">Subject Name</label>
                  <input 
                    autoFocus
                    type="text"
                    placeholder="e.g. Quantum Physics"
                    className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 px-6 py-4 rounded-2xl outline-none focus:border-red-500 focus:bg-white transition-all font-semibold"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] font-extrabold text-slate-400 mb-4 block text-center">Pick an Icon</label>
                  <div className="grid grid-cols-6 gap-3">
                    {icons.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedIcon(item.id)}
                        className={cn(
                          "aspect-square rounded-2xl border-2 flex items-center justify-center transition-all",
                          selectedIcon === item.id 
                            ? "border-red-500 bg-red-50 text-red-600 scale-110 shadow-lg shadow-red-100" 
                            : "border-slate-100 text-slate-400 hover:border-slate-200"
                        )}
                      >
                        <item.icon className="w-6 h-6" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] font-extrabold text-slate-400 mb-4 block text-center">Brand Color</label>
                  <div className="flex justify-center flex-wrap gap-4">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "w-8 h-8 rounded-full border-4 transition-all hover:scale-125",
                          selectedColor === color ? "border-slate-200 scale-125 shadow-lg" : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <button 
                  onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="w-full bg-red-600 hover:bg-red-700 text-white rounded-2xl py-5 text-lg font-bold transition-all shadow-xl shadow-red-100 disabled:opacity-50 disabled:shadow-none"
                >
                  Create Course
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

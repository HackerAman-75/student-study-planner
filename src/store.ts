import { useState, useEffect } from 'react';
import { Subject, Task, StudySession, User } from './types.ts';

const STORAGE_KEY = 'study_flow_data';

interface StudyFlowData {
  subjects: Subject[];
  tasks: Task[];
  sessions: StudySession[];
  user: User | null;
}

const DEFAULT_DATA: StudyFlowData = {
  subjects: [
    { id: '1', name: 'Mathematics', color: '#3b82f6', icon: 'Calculator' },
    { id: '2', name: 'Computer Science', color: '#10b981', icon: 'Code' },
    { id: '3', name: 'Physics', color: '#f59e0b', icon: 'Zap' },
  ],
  tasks: [],
  sessions: [],
  user: { id: '1', name: 'Student', email: 'student@example.com', dailyGoal: 4 },
};

export function useStudyStore() {
  const [data, setData] = useState<StudyFlowData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_DATA;
    try {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return {
        ...parsed,
        tasks: parsed.tasks.map((t: any) => ({ ...t, deadline: new Date(t.deadline) })),
        sessions: (parsed.sessions || []).map((s: any) => ({ ...s, startTime: new Date(s.startTime), endTime: new Date(s.endTime) })),
      };
    } catch (e) {
      return DEFAULT_DATA;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject = { ...subject, id: crypto.randomUUID() };
    setData(prev => ({ ...prev, subjects: [...prev.subjects, newSubject] }));
    return newSubject;
  };

  const deleteSubject = (id: string) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s.id !== id),
      tasks: prev.tasks.filter(t => t.subjectId !== id),
      sessions: prev.sessions.filter(s => s.subjectId !== id),
    }));
  };

  const addTask = (task: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = { ...task, id: crypto.randomUUID(), status: 'pending' };
    setData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
    }));
  };

  const deleteTask = (id: string) => {
    setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  };

  const addSession = (session: Omit<StudySession, 'id' | 'date'>) => {
    const startTime = new Date(session.startTime);
    const newSession: StudySession = { 
      ...session, 
      id: crypto.randomUUID(),
      date: startTime.toISOString().split('T')[0]
    };
    setData(prev => ({ ...prev, sessions: [...prev.sessions, newSession] }));
    return newSession;
  };

  const updateUser = (updates: Partial<User>) => {
    setData(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updates } : null
    }));
  };

  const logout = () => {
    localStorage.removeItem('study_flow_auth');
    // We don't clear STORAGE_KEY to persist data for return, 
    // but the session auth is removed.
    window.location.reload();
  };

  return {
    ...data,
    addSubject,
    deleteSubject,
    addTask,
    updateTask,
    deleteTask,
    addSession,
    updateUser,
    logout,
  };
}

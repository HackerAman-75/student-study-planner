/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Task {
  id: string;
  subjectId: string;
  title: string;
  deadline: Date;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
}

export interface StudySession {
  id: string;
  subjectId: string;
  startTime: Date;
  endTime: Date;
  date: string; // YYYY-MM-DD
}

export interface User {
  id: string;
  name: string;
  email: string;
  dailyGoal: number; // in hours
}

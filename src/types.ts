export type TaskStatus = 'todo' | 'pending' | 'done';

export interface Task {
  id: string;
  text: string;
  status: TaskStatus;
}

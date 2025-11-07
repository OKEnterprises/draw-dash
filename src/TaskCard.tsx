import { Task } from './types';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export default function TaskCard({ task, onStatusChange }: TaskCardProps) {
  return (
    <div className={`task-card task-card--${task.status}`}>
      <div className="task-card__header">
        <button
          className="task-card__button task-card__button--todo"
          onClick={() => onStatusChange(task.id, 'todo')}
          disabled={task.status === 'todo'}
        >
          Todo
        </button>
        <button
          className="task-card__button task-card__button--pending"
          onClick={() => onStatusChange(task.id, 'pending')}
          disabled={task.status === 'pending'}
        >
          Pending
        </button>
      </div>
      <div className="task-card__content">
        <p>{task.text}</p>
      </div>
      <div className="task-card__footer">
        <button
          className="task-card__button task-card__button--done"
          onClick={() => onStatusChange(task.id, 'done')}
          disabled={task.status === 'done'}
        >
          Done
        </button>
      </div>
    </div>
  );
}

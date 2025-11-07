import { useState } from 'react';
import './AddTask.css';

interface AddTaskProps {
  onAddTask: (text: string) => void;
}

export default function AddTask({ onAddTask }: AddTaskProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [taskText, setTaskText] = useState('');

  const handleSubmit = () => {
    if (taskText.trim()) {
      onAddTask(taskText.trim());
      setTaskText('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setTaskText('');
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <div className="add-task">
        <button
          className="add-task__button"
          onClick={() => setIsAdding(true)}
        >
          + Add New Task
        </button>
      </div>
    );
  }

  return (
    <div className="add-task add-task--active">
      <textarea
        className="add-task__input"
        placeholder="Enter task description..."
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
          if (e.key === 'Escape') {
            handleCancel();
          }
        }}
      />
      <div className="add-task__actions">
        <button
          className="add-task__action-button add-task__action-button--submit"
          onClick={handleSubmit}
        >
          Add Task
        </button>
        <button
          className="add-task__action-button add-task__action-button--cancel"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

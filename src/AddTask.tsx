import { useState } from 'react';
import HandwritingInput from './HandwritingInput';
import './AddTask.css';

interface AddTaskProps {
  onAddTask: (text: string) => void;
}

type InputMode = 'text' | 'handwriting';

export default function AddTask({ onAddTask }: AddTaskProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [taskText, setTaskText] = useState('');
  const [inputMode, setInputMode] = useState<InputMode>('text');

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
    setInputMode('text');
  };

  const handleHandwritingRecognized = (recognizedText: string) => {
    onAddTask(recognizedText);
    setIsAdding(false);
    setInputMode('text');
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
      <div className="add-task__mode-toggle">
        <button
          className={`add-task__mode-button ${inputMode === 'text' ? 'add-task__mode-button--active' : ''}`}
          onClick={() => setInputMode('text')}
        >
          ✍️ Type
        </button>
        <button
          className={`add-task__mode-button ${inputMode === 'handwriting' ? 'add-task__mode-button--active' : ''}`}
          onClick={() => setInputMode('handwriting')}
        >
          ✏️ Draw
        </button>
      </div>

      {inputMode === 'text' ? (
        <>
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
        </>
      ) : (
        <HandwritingInput
          onRecognized={handleHandwritingRecognized}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

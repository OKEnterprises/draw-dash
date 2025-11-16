import { useState, useRef, useEffect } from 'react';
import './FloatingTypeButton.css';

interface FloatingTypeButtonProps {
  onTaskCreated: (text: string) => void;
}

export default function FloatingTypeButton({ onTaskCreated }: FloatingTypeButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskText, setTaskText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isModalOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isModalOpen]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskText('');
  };

  const handleSubmit = () => {
    if (taskText.trim()) {
      onTaskCreated(taskText.trim());
      handleCloseModal();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      handleCloseModal();
    }
  };

  return (
    <>
      {/* Floating button */}
      {!isModalOpen && (
        <button
          className="floating-type-button"
          onClick={handleOpenModal}
          title="Type to create task"
        >
          ✍️
        </button>
      )}

      {/* Full-screen modal overlay */}
      {isModalOpen && (
        <div className="floating-type-overlay">
          <div className="floating-type-overlay__header">
            <h2>Type your task</h2>
            <p>Press Enter to add, Escape to cancel</p>
            <button
              className="floating-type-overlay__close"
              onClick={handleCloseModal}
            >
              ✕
            </button>
          </div>

          <div className="floating-type-overlay__content">
            <textarea
              ref={textareaRef}
              className="floating-type-overlay__textarea"
              placeholder="Enter task description..."
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="floating-type-overlay__submit"
              onClick={handleSubmit}
              disabled={!taskText.trim()}
            >
              Add Task
            </button>
          </div>
        </div>
      )}
    </>
  );
}

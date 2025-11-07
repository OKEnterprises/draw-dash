import { useState } from 'react';
import { Task, TaskStatus } from './types';
import AddTask from './AddTask';
import Filter from './Filter';
import TaskCard from './TaskCard';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>(['todo', 'pending', 'done']);

  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      status: 'todo',
    };
    setTasks([newTask, ...tasks]);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status } : task
    ));
  };

  const filteredTasks = tasks.filter(task =>
    selectedStatuses.includes(task.status)
  );

  return (
    <div className="app">
      <header className="app__header">
        <h1>Task Management System</h1>
      </header>

      <AddTask onAddTask={addTask} />

      <Filter
        selectedStatuses={selectedStatuses}
        onFilterChange={setSelectedStatuses}
      />

      <div className="app__tasks">
        {filteredTasks.length === 0 ? (
          <div className="app__empty">
            {tasks.length === 0 ? (
              <p>No tasks yet. Click "Add New Task" to get started!</p>
            ) : (
              <p>No tasks match the selected filters.</p>
            )}
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={updateTaskStatus}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;

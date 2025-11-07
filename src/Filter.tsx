import { TaskStatus } from './types';
import './Filter.css';

interface FilterProps {
  selectedStatuses: TaskStatus[];
  onFilterChange: (statuses: TaskStatus[]) => void;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'pending', label: 'Pending' },
  { value: 'done', label: 'Done' },
];

export default function Filter({ selectedStatuses, onFilterChange }: FilterProps) {
  const toggleStatus = (status: TaskStatus) => {
    if (selectedStatuses.includes(status)) {
      onFilterChange(selectedStatuses.filter(s => s !== status));
    } else {
      onFilterChange([...selectedStatuses, status]);
    }
  };

  return (
    <div className="filter">
      <h3 className="filter__title">Filter by Status:</h3>
      <div className="filter__options">
        {statusOptions.map(option => (
          <label key={option.value} className="filter__option">
            <input
              type="checkbox"
              checked={selectedStatuses.includes(option.value)}
              onChange={() => toggleStatus(option.value)}
              className="filter__checkbox"
            />
            <span className={`filter__label filter__label--${option.value}`}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

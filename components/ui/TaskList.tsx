import React from "react";

interface TaskItem {
  label: string;
  checked?: boolean
}

interface TaskListProps {
  items: TaskItem[];
}

export const TaskList: React.FC<TaskListProps> = ({ items }) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input type="checkbox" checked={item.checked} readOnly className="w-4 h-4 accent-green-600 cursor-not-allowed pointer-events-none" />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}
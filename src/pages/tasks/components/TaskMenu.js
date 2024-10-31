// src/pages/tasks/components/TaskMenu.js

import React from 'react';
import { CheckIcon, ClockIcon, RefreshIcon, TrashIcon } from '@heroicons/react/outline';

export default function TaskMenu({ task, updateTaskStatus, deleteTask }) {
    return (
        <div className="absolute top-12 right-0 bg-white border rounded shadow-lg z-10">
            {task.status !== 'Completed' && (
                <button onClick={() => updateTaskStatus(task.id, 'Completed')} className="flex items-center w-full px-4 py-2 text-left text-green-500 hover:bg-green-100">
                    <CheckIcon className="h-5 w-5 mr-2" />
                    Complete
                </button>
            )}
            {task.status !== 'Snoozed' && (
                <button onClick={() => updateTaskStatus(task.id, 'Snoozed')} className="flex items-center w-full px-4 py-2 text-left text-yellow-500 hover:bg-yellow-100">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    Snooze
                </button>
            )}
            {task.status !== 'Active' && (
                <button onClick={() => updateTaskStatus(task.id, 'Active')} className="flex items-center w-full px-4 py-2 text-left text-blue-500 hover:bg-blue-100">
                    <RefreshIcon className="h-5 w-5 mr-2" />
                    Activate
                </button>
            )}
            <button onClick={() => deleteTask(task.id)} className="flex items-center w-full px-4 py-2 text-left text-red-500 hover:bg-red-100">
                <TrashIcon className="h-5 w-5 mr-2" />
                Delete
            </button>
        </div>
    );
}

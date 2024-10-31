// src/pages/tasks/components/OverflowMenu.js

import React, { useEffect, useRef, useState } from 'react';
import { CheckIcon, ClockIcon, RefreshIcon, TrashIcon } from '@heroicons/react/outline';

/**
 * OverflowMenu Component
 * ----------------------
 * A dropdown menu for task actions, allowing users to update task statuses or delete the task.
 * 
 * Props:
 * - task (object): The current task with its status.
 * - updateTaskStatus (function): Callback to change the task status.
 * - deleteTask (function): Callback to delete the task.
 */
export default function OverflowMenu({ task, updateTaskStatus, deleteTask }) {
    const [isVisible, setIsVisible] = useState(true); // Manages visibility of the menu
    const menuRef = useRef(null); // Reference for the menu container

    // Hide menu when clicking outside of it
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsVisible(false); // Close menu if clicked outside
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // If the menu is not visible, do not render it
    if (!isVisible) return null;

    return (
        <div ref={menuRef} className="absolute right-0 top-10 bg-white border rounded shadow-lg">
            {/* Actions for tasks with status 'Active' */}
            {task.status === 'Active' && (
                <>
                    <button onClick={() => updateTaskStatus('Completed')} className="flex items-center w-full px-4 py-2 text-left text-green-500 hover:bg-green-100">
                        <CheckIcon className="h-5 w-5 mr-2" /> Complete
                    </button>
                    <button onClick={() => updateTaskStatus('Snoozed')} className="flex items-center w-full px-4 py-2 text-left text-yellow-500 hover:bg-yellow-100">
                        <ClockIcon className="h-5 w-5 mr-2" /> Snooze
                    </button>
                </>
            )}

            {/* Actions for tasks with status 'Snoozed' */}
            {task.status === 'Snoozed' && (
                <>
                    <button onClick={() => updateTaskStatus('Active')} className="flex items-center w-full px-4 py-2 text-left text-blue-500 hover:bg-blue-100">
                        <RefreshIcon className="h-5 w-5 mr-2" /> Activate
                    </button>
                    <button onClick={() => updateTaskStatus('Completed')} className="flex items-center w-full px-4 py-2 text-left text-green-500 hover:bg-green-100">
                        <CheckIcon className="h-5 w-5 mr-2" /> Complete
                    </button>
                </>
            )}

            {/* Actions for tasks with status 'Completed' */}
            {task.status === 'Completed' && (
                <>
                    <button onClick={() => updateTaskStatus('Active')} className="flex items-center w-full px-4 py-2 text-left text-blue-500 hover:bg-blue-100">
                        <RefreshIcon className="h-5 w-5 mr-2" /> Activate
                    </button>
                    <button onClick={() => updateTaskStatus('Snoozed')} className="flex items-center w-full px-4 py-2 text-left text-yellow-500 hover:bg-yellow-100">
                        <ClockIcon className="h-5 w-5 mr-2" /> Snooze
                    </button>
                </>
            )}

            {/* Delete Task button, available for all statuses */}
            <button onClick={deleteTask} className="flex items-center w-full px-4 py-2 text-left text-red-500 hover:bg-red-100">
                <TrashIcon className="h-5 w-5 mr-2" /> Delete
            </button>
        </div>
    );
}

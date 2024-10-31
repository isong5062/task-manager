// src/pages/tasks/components/OverflowMenu.js
import React, { useEffect, useRef, useState } from 'react';
import { CheckIcon, ClockIcon, RefreshIcon, TrashIcon } from '@heroicons/react/outline';

export default function OverflowMenu({ task, updateTaskStatus, deleteTask }) {
    const [isVisible, setIsVisible] = useState(true);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsVisible(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div ref={menuRef} className="absolute right-0 top-10 bg-white border rounded shadow-lg">
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
            <button onClick={deleteTask} className="flex items-center w-full px-4 py-2 text-left text-red-500 hover:bg-red-100">
                <TrashIcon className="h-5 w-5 mr-2" /> Delete
            </button>
        </div>
    );
}
// src/pages/tasks/components/TaskItem.js

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import TaskMenu from './taskMenu';

/**
 * TaskItem Component
 * --------------------
 * Represents a single task item in the task list, displaying task title and status.
 * Provides options to open a menu for task actions (e.g., update status, delete).
 *
 * Props:
 * - task: object - The task object containing task details (id, title, status).
 * - updateTaskStatus: function - Function to update the status of the task.
 * - deleteTask: function - Function to delete the task.
 */
export default function TaskItem({ task, updateTaskStatus, deleteTask }) {
    const [openMenu, setOpenMenu] = useState(false); // Tracks the open/close state of the task menu
    const menuRef = useRef(null); // Ref to detect clicks outside the menu
    const buttonRef = useRef(null); // Ref for the button that opens the menu

    // Toggles the menu visibility when the button is clicked
    const toggleMenu = (e) => {
        e.stopPropagation();
        setOpenMenu((prev) => !prev);
    };

    // Effect to close the menu if a click is detected outside of the menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setOpenMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <li key={task.id} className="relative">
            {/* Link to Task Detail Page */}
            <Link href={`/tasks/${task.id}`}>
                <div className="bg-white p-4 rounded shadow cursor-pointer flex justify-between items-center">
                    <div className="flex-grow mr-12 break-words max-w-[calc(100%-40px)]">
                        {/* Task Title */}
                        <h3 className="font-semibold">{task.title}</h3>
                        {/* Task Status Badge */}
                        <span
                            className={`text-sm mt-1 inline-block rounded px-2 py-1 ${
                                task.status === 'Active'
                                    ? 'bg-green-200 text-green-800'
                                    : task.status === 'Snoozed'
                                    ? 'bg-yellow-200 text-yellow-800'
                                    : 'bg-gray-300 text-gray-700'
                            }`}
                        >
                            {task.status}
                        </span>
                    </div>
                </div>
            </Link>

            {/* Menu Toggle Button */}
            <button
                ref={buttonRef}
                className="absolute top-2 right-2 bg-white rounded-full p-2"
                onClick={toggleMenu}
            >
                •••
            </button>

            {/* Task Menu with actions (open only if openMenu is true) */}
            {openMenu && (
                <div ref={menuRef} onClick={(e) => e.stopPropagation()}>
                    <TaskMenu
                        task={task}
                        updateTaskStatus={updateTaskStatus}
                        deleteTask={deleteTask}
                    />
                </div>
            )}
        </li>
    );
}

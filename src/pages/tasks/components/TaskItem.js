// src/pages/tasks/components/TaskItem.js

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import TaskMenu from './taskMenu';

export default function TaskItem({ task, updateTaskStatus, deleteTask }) {
    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const toggleMenu = (e) => {
        e.stopPropagation();
        setOpenMenu((prev) => !prev);
    };

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
            <Link href={`/tasks/${task.id}`}>
                <div className="bg-white p-4 rounded shadow cursor-pointer flex justify-between items-center">
                    <div className="flex-grow mr-12 break-words max-w-[calc(100%-40px)]">
                        <h3 className="font-semibold">{task.title}</h3>
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

            <button
                ref={buttonRef}
                className="absolute top-2 right-2 bg-white rounded-full p-2"
                onClick={toggleMenu}
            >
                •••
            </button>

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

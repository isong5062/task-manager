// src/pages/tasks/components/Header.js

import React from 'react';
import { LogoutIcon } from '@heroicons/react/outline';

/**
 * Header Component
 * -----------------
 * Displays a greeting, task count, filter buttons, and a logout button.
 * Allows users to filter tasks by status and log out of the application.
 *
 * Props:
 * - userName: string - The name of the logged-in user
 * - filter: string - The currently selected filter status
 * - handleFilterChange: function - Function to update the selected task filter
 * - taskCount: number - The number of tasks left to be completed
 * - handleLogout: function - Function to handle user logout
 */
export default function Header({ userName, filter, handleFilterChange, taskCount, handleLogout }) {
    return (
        <header className="py-4 w-full max-w-md">
            {/* Greeting and Logout Section */}
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold text-black">Hello {userName}!</h1>
                
                {/* Logout Button with Icon */}
                <button
                    onClick={handleLogout}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full space-x-2 hover:bg-blue-600"
                    aria-label="Log Out"
                >
                    <span>Log Out</span>
                    <LogoutIcon className="h-5 w-5" />
                </button>
            </div>

            {/* Task Count Display */}
            <p className="text-gray-700 text-left">
                You have <span className="text-blue-500 font-semibold">{taskCount}</span> tasks left! 👍
            </p>

            {/* Task List Header */}
            <h2 className="text-xl font-bold text-black mt-4 text-left">My Task List</h2>

            {/* Filter Buttons Section */}
            <div className="flex justify-start mt-4 space-x-2">
                {['All', 'Active', 'Snoozed', 'Completed'].map((status) => (
                    <button
                        key={status}
                        className={`px-4 py-2 rounded-full ${
                            filter === status ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                        onClick={() => handleFilterChange(status)}
                    >
                        {status}
                    </button>
                ))}
            </div>
        </header>
    );
}

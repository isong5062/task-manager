// src/pages/tasks/components/TabNavigation.js

import React from 'react';

/**
 * TabNavigation Component
 * -----------------------
 * Provides tab navigation for switching between "Chat" and "Task Details" views.
 * 
 * Props:
 * - activeTab (string): The currently selected tab ("Chat" or "Task Details").
 * - handleTabChange (function): Function to switch between tabs.
 */
export default function TabNavigation({ activeTab, handleTabChange }) {
    return (
        <div className="mt-6">
            {/* Chat Tab */}
            <button 
                onClick={() => handleTabChange("Chat")}
                className={`px-4 py-2 ${activeTab === "Chat" ? "border-b-2 border-blue-500" : ""}`}
            >
                Chat
            </button>
            
            {/* Task Details Tab */}
            <button 
                onClick={() => handleTabChange("Task Details")}
                className={`ml-4 px-4 py-2 ${activeTab === "Task Details" ? "border-b-2 border-blue-500" : ""}`}
            >
                Task Details
            </button>
        </div>
    );
}

// src/pages/tasks/components/TabNavigation.js
import React from 'react';

export default function TabNavigation({ activeTab, handleTabChange }) {
    return (
        <div className="mt-6">
            <button onClick={() => handleTabChange("Chat")} className={`px-4 py-2 ${activeTab === "Chat" ? "border-b-2 border-blue-500" : ""}`}>Chat</button>
            <button onClick={() => handleTabChange("Task Details")} className={`ml-4 px-4 py-2 ${activeTab === "Task Details" ? "border-b-2 border-blue-500" : ""}`}>Task Details</button>
        </div>
    );
}

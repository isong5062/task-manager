// src/pages/tasks/components/NewMessageForm.js

import React, { useState } from 'react';
import { supabase } from '../../../../db';

/**
 * NewMessageForm Component
 * ------------------------
 * Renders a form that allows users to send a message related to a specific task.
 * 
 * Props:
 * - taskId (string): ID of the task to which the message will be associated.
 * - onNewMessage (function): Callback function to trigger after a new message is successfully sent.
 */
export default function NewMessageForm({ taskId, onNewMessage }) {
    const [message, setMessage] = useState(""); // Holds the current message input value

    /**
     * Handle form submission to send a new message.
     * Checks for a logged-in user, and then inserts the message into the TaskMessages table.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Retrieve the logged-in user's ID from localStorage
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
            console.error("User not logged in or user ID is missing");
            return;
        }

        // Insert the new message into the database
        const { error } = await supabase
            .from('TaskMessages')
            .insert([{ task_id: taskId, user_id: userId, message }]);
        
        if (error) {
            console.error("Error sending message:", error.message);
        } else {
            setMessage(""); // Clear the input field after successful submission
            onNewMessage(); // Trigger callback to update the parent component (e.g., refresh message list)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message"
                className="flex-grow border rounded p-2"
            />
            <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full">Send</button>
        </form>
    );
}

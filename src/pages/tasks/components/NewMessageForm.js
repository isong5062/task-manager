// src/pages/tasks/components/NewMessageForm.js
import React, { useState } from 'react';
import { supabase } from '../../../../db';

export default function NewMessageForm({ taskId, onNewMessage }) {
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Retrieve the logged-in user's ID from localStorage
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
            console.error("User not logged in or user ID is missing");
            return;
        }

        const { error } = await supabase
            .from('TaskMessages')
            .insert([{ task_id: taskId, user_id: userId, message }]);
        
        if (error) {
            console.error("Error sending message:", error.message);
        } else {
            setMessage("");
            onNewMessage();
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

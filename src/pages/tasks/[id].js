// src/pages/tasks/[id].js

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import OverflowMenu from './components/OverflowMenu';
import TabNavigation from './components/TabNavigation';
import NewMessageForm from './components/NewMessageForm';
import { supabase } from '../../../db';

/**
 * TaskDetails Component
 * ---------------------
 * Displays detailed information about a task, including its status, title, and description.
 * Provides tab navigation to toggle between task-specific chat and task details.
 */
export default function TaskDetails() {
    const router = useRouter();
    const { id } = router.query;

    const [task, setTask] = useState(null); // Stores the task details
    const [messages, setMessages] = useState([]); // Stores chat messages related to the task
    const [activeTab, setActiveTab] = useState("Chat"); // Manages the active tab (Chat or Task Details)
    const [showMenu, setShowMenu] = useState(false); // Controls the visibility of the overflow menu
    const chatEndRef = useRef(null); // Reference to automatically scroll the chat to the latest message

    const userId = localStorage.getItem('userId'); // Retrieve logged-in user ID

    // Scroll to the bottom of the chat when a new message is added
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Fetch task details on initial render or when the task ID changes
    useEffect(() => {
        if (!id) return;
        async function fetchTaskDetails() {
            const { data, error } = await supabase
                .from('Tasks')
                .select('*')
                .eq('id', id)
                .single();
            if (error) {
                console.error("Error fetching task details:", error.message);
            } else {
                setTask(data);
            }
        }
        fetchTaskDetails();
    }, [id]);

    // Fetch chat messages for the task, with real-time updates using polling
    useEffect(() => {
        if (!id) return;
        async function fetchMessages() {
            const { data, error } = await supabase
                .from('TaskMessages')
                .select('*, Users(name)')
                .eq('task_id', id)
                .order('timestamp', { ascending: true });
            if (error) {
                console.error("Error fetching messages:", error.message);
            } else {
                setMessages(data);
            }
        }
        fetchMessages();
        const interval = setInterval(fetchMessages, 1000);
        return () => clearInterval(interval);
    }, [id]);

    // Toggle between Chat and Task Details tabs
    const handleTabChange = (tab) => setActiveTab(tab);

    // Toggle the overflow menu visibility
    const toggleMenu = () => setShowMenu((prev) => !prev);

    // Update the task status in the database
    const updateTaskStatus = async (newStatus) => {
        const { error } = await supabase
            .from('Tasks')
            .update({ status: newStatus })
            .eq('id', id);
        if (error) {
            console.error("Error updating task status:", error.message);
        } else {
            setTask((prev) => ({ ...prev, status: newStatus }));
            setShowMenu(false);
        }
    };

    // Delete the task from the database
    const deleteTask = async () => {
        const { error } = await supabase.from('Tasks').delete().eq('id', id);
        if (error) {
            console.error("Error deleting task:", error.message);
        } else {
            router.push('/tasks');
        }
    };

    // Display a loading message while task details are being fetched
    if (!task) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            {/* Task Details Container */}
            <div className="bg-white p-4 rounded shadow relative">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/tasks')}
                    className="bg-blue-500 text-white rounded-full px-3 py-1 text-sm absolute top-4 left-4 flex items-center"
                >
                    &larr; Back
                </button>
                {/* Overflow Menu Button */}
                <div className="absolute top-4 right-4">
                    <button
                        onClick={toggleMenu}
                        className="px-2 py-1 rounded-full bg-white"
                    >
                        •••
                    </button>
                    {showMenu && (
                        <OverflowMenu
                            task={task}
                            updateTaskStatus={updateTaskStatus}
                            deleteTask={deleteTask}
                        />
                    )}
                </div>
                {/* Task Title */}
                <div className="mt-10 mb-2 max-h-16 overflow-y-auto scrollbar-hidden">
                    <h1 className="text-2xl font-bold text-center break-words whitespace-pre-wrap">
                        {task.title}
                    </h1>
                </div>
                {/* Task Status Display */}
                <p className="text-center">
                    <span
                        className={`inline-block rounded px-2 py-1 text-sm ${
                            task.status === 'Active'
                                ? 'bg-green-200 text-green-800'
                                : task.status === 'Snoozed'
                                ? 'bg-yellow-200 text-yellow-800'
                                : 'bg-gray-300 text-gray-700'
                        }`}
                    >
                        {task.status}
                    </span>
                </p>
            </div>

            {/* Tab Navigation for Chat and Task Details */}
            <TabNavigation activeTab={activeTab} handleTabChange={handleTabChange} />

            {/* Conditional Rendering for Chat and Task Details based on Active Tab */}
            {activeTab === "Chat" ? (
                <div className="mt-4 bg-white p-4 rounded shadow flex flex-col h-96">
                    <h2 className="text-xl font-bold">Chat</h2>
                    <div className="flex-grow overflow-y-auto mt-4" style={{ maxHeight: '300px' }}>
                        <ul className="space-y-2">
                            {/* Render each message with alignment based on sender */}
                            {messages.map((message) => (
                                <li key={message.id} className={`flex ${message.user_id == userId ? 'justify-end' : 'justify-start'}`}>
                                    <span className={`p-2 rounded ${message.user_id == userId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                        {message.user_id == userId ? "You: " : `${message.Users.name}: `}
                                        {message.message}
                                    </span>
                                </li>
                            ))}
                            <div ref={chatEndRef} />
                        </ul>
                    </div>
                    {/* Form for Adding New Messages */}
                    <NewMessageForm
                        taskId={id}
                        onNewMessage={() => { setMessages((prev) => [...prev]); scrollToBottom(); }}
                    />
                </div>
            ) : (
                // Task Details View
                <div className="mt-4 bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-bold">Task Details</h2>
                    <p className="mt-2 break-words whitespace-pre-wrap">{task.description}</p>
                </div>
            )}
        </div>
    );
}

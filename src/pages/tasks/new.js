// src/pages/tasks/new.js

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../db';

/**
 * NewTask Component
 * -----------------
 * Provides a form to create a new task, allowing the user to enter
 * title, description, optional budget, and attach files (UI only).
 */
export default function NewTask() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);

    // Handles file selection and converts it to an array for easier handling
    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    /**
     * Handles form submission to create a new task.
     * - Checks for user login status.
     * - Constructs the task description with budget if provided.
     * - Inserts the task and assigns it to the current user.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setError("User is not logged in.");
            return;
        }

        // Append budget to description if provided
        let fullDescription = description;
        if (budget) {
            fullDescription += `\n\nBudget: $${parseFloat(budget).toFixed(2)}`;
        }
        
        // Step 1: Insert new task into the 'Tasks' table
        const { data: newTask, error: taskError } = await supabase
            .from('Tasks')
            .insert([
                {
                    title,
                    description: fullDescription,
                    status: 'Active',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ])
            .select()
            .single();

        if (taskError) {
            console.error('Error creating task:', taskError.message);
            setError("Failed to create task. Please try again.");
            return;
        }

        // Step 2: Assign the new task to the current user in the 'TaskAssignments' table
        const { error: assignmentError } = await supabase
            .from('TaskAssignments')
            .insert([
                {
                    task_id: newTask.id,
                    user_id: userId,
                },
            ]);

        if (assignmentError) {
            console.error('Error assigning task:', assignmentError.message);
            setError("Failed to assign task to user. Please try again.");
            return;
        }

        // Redirect to the task list upon successful creation and assignment
        router.push('/tasks');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            {/* Back Button to Return to Task List */}
            <button
                onClick={() => router.push('/tasks')}
                className="bg-blue-500 text-white rounded-full px-3 py-1 text-sm mb-4 flex items-center space-x-2"
            >
                <span>&larr; Back</span>
            </button>

            <h1 className="text-2xl font-bold text-center mb-4">Create a New Task</h1>

            {/* Task Creation Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto space-y-4">
                {/* Title Input */}
                <div>
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded-lg p-2"
                        required
                    />
                </div>

                {/* Description Input */}
                <div>
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded-lg p-2"
                    />
                </div>

                {/* Budget Input */}
                <div>
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="budget">
                        Budget (optional)
                    </label>
                    <input
                        type="number"
                        id="budget"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full border rounded-lg p-2"
                    />
                </div>

                {/* File Upload Input */}
                <div>
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="files">
                        Attach Files (optional)
                    </label>
                    <input
                        type="file"
                        id="files"
                        onChange={handleFileChange}
                        multiple
                        className="w-full border rounded-lg p-2"
                    />
                    {/* Display selected files */}
                    <div className="mt-2">
                        {files.length > 0 && (
                            <ul className="list-disc pl-5 space-y-1">
                                {files.map((file, index) => (
                                    <li key={index} className="text-gray-600">
                                        {file.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-full">
                    Create Task
                </button>

                {/* Error Message */}
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </form>
        </div>
    );
}

// src/pages/tasks/index.js

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import TaskItem from './components/TaskItem';
import { supabase } from '../../supabaseClient';
import { useRouter } from 'next/router';
import { PlusIcon } from '@heroicons/react/outline';

/**
 * TaskList Component
 * -------------------
 * Displays a list of tasks for the logged-in user, with filters for task status.
 * Includes search functionality, task status update, and deletion features.
 * Handles user logout and navigation to add a new task.
 */
export default function TaskList() {
    const router = useRouter();

    // State variables to manage tasks, filters, loading, errors, and search
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [userName, setUserName] = useState("");

    /**
     * useEffect to check login status and fetch user tasks and name if logged in.
     * Redirects to the login page if the user is not logged in.
     */
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('loggedIn');
        const userId = localStorage.getItem('userId');

        if (!isLoggedIn || !userId) {
            router.replace('/login');
        } else {
            fetchTasks(userId);
            fetchUserName(userId);
        }
    }, [router]);

    /**
     * Logs out the user by clearing local storage and redirecting to the login page.
     */
    const handleLogout = () => {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userId');
        router.replace('/login');
    };

    /**
     * Fetches tasks assigned to the logged-in user from the database.
     * @param {string} userId - The ID of the logged-in user
     */
    async function fetchTasks(userId) {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('Tasks')
                .select('*, TaskAssignments!inner(user_id)')
                .eq('TaskAssignments.user_id', userId);

            if (error) throw error;
            setTasks(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    /**
     * Fetches the username of the logged-in user for display.
     * @param {string} userId - The ID of the logged-in user
     */
    async function fetchUserName(userId) {
        const { data, error } = await supabase
            .from('Users')
            .select('name')
            .eq('id', userId)
            .single();

        if (!error && data) setUserName(data.name);
    }

    /**
     * Updates the filteredTasks list based on the selected filter and search query.
     */
    useEffect(() => {
        let filtered = tasks;

        // Filter by task status
        if (filter !== 'All') {
            filtered = filtered.filter(task => task.status === filter);
        }

        // Filter by search query in task title
        if (searchQuery) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredTasks(filtered);
    }, [tasks, filter, searchQuery]);

    // Sets the selected filter and updates the filteredTasks list
    const handleFilterChange = (status) => {
        setFilter(status);
    };

    // Updates the search query and filtered tasks list
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    /**
     * Updates the status of a specific task.
     * @param {number} taskId - The ID of the task to update
     * @param {string} newStatus - The new status to assign to the task
     */
    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            const { error } = await supabase
                .from('Tasks')
                .update({ status: newStatus })
                .eq('id', taskId);

            if (error) throw error;

            setTasks(tasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
            ));
        } catch (error) {
            setError('Failed to update task');
        }
    };

    /**
     * Deletes a specific task.
     * @param {number} taskId - The ID of the task to delete
     */
    const deleteTask = async (taskId) => {
        try {
            const { error } = await supabase
                .from('Tasks')
                .delete()
                .eq('id', taskId);

            if (error) throw error;

            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            setError('Failed to delete task');
        }
    };

    // Counts the number of tasks left that are not completed or snoozed
    const tasksLeftCount = tasks.filter(task => task.status !== 'Completed' && task.status !== 'Snoozed').length;

    if (loading) return <div className="text-center text-gray-500">Loading tasks...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="flex flex-col items-center h-screen overflow-hidden bg-gray-100 p-4">
            <div className="w-full max-w-md">
                <Header
                    userName={userName}
                    filter={filter}
                    handleFilterChange={handleFilterChange}
                    taskCount={tasksLeftCount}
                    handleLogout={handleLogout} // Pass handleLogout function
                />
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Search a task..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="p-2 border rounded w-full"
                    />
                </div>
            </div>

            {/* Task list section */}
            <div className="w-full max-w-md mt-4 overflow-y-auto flex-grow" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <ul className="space-y-4">
                    {filteredTasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            updateTaskStatus={updateTaskStatus}
                            deleteTask={deleteTask}
                        />
                    ))}
                </ul>
            </div>

            {/* New Task button at the bottom */}
            <Link href="/tasks/new">
                <button className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white rounded-full px-6 py-3 flex items-center justify-center space-x-2">
                    <span>New Task</span>
                    <PlusIcon className="h-5 w-5 text-white" />
                </button>
            </Link>
        </div>
    );
}

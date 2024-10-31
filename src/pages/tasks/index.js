// src/pages/tasks/index.js

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import TaskItem from './components/TaskItem';
import { supabase } from '../../supabaseClient';
import { useRouter } from 'next/router';
import { PlusIcon } from '@heroicons/react/outline';

export default function TaskList() {
    const router = useRouter();
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [userName, setUserName] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const isLoggedIn = localStorage.getItem('loggedIn');
            const userId = localStorage.getItem('userId');

            if (!isLoggedIn || !userId) {
                router.replace('/login');
            } else {
                fetchTasks(userId);
                fetchUserName(userId);
            }
        }
    }, [router]);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userId');
        router.replace('/login');
    };

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

    async function fetchUserName(userId) {
        const { data, error } = await supabase
            .from('Users')
            .select('name')
            .eq('id', userId)
            .single();

        if (!error && data) setUserName(data.name);
    }

    useEffect(() => {
        let filtered = tasks;

        if (filter !== 'All') {
            filtered = filtered.filter(task => task.status === filter);
        }

        if (searchQuery) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredTasks(filtered);
    }, [tasks, filter, searchQuery]);

    const handleFilterChange = (status) => {
        setFilter(status);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

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
            <Link href="/tasks/new">
                <button className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white rounded-full px-6 py-3 flex items-center justify-center space-x-2">
                    <span>New Task</span>
                    <PlusIcon className="h-5 w-5 text-white" />
                </button>
            </Link>
        </div>
    );
}

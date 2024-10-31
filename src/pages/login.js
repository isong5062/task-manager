// src/pages/login.js

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../db';

/**
 * LoginPage Component
 * -------------------
 * Renders the login page where users can input their name and email.
 * If the user exists, they are redirected to the task list.
 * If the user doesn't exist, a new user record is created in the database.
 * Stores user login state and ID in localStorage upon successful login.
 */
export default function LoginPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);

    /**
     * Handle form submission for login.
     * If user exists, redirect to tasks; otherwise, create a new user.
     * @param {Event} e - Form submit event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input fields
        if (!name || !email) {
            setError("Please enter both your name and email.");
            return;
        }

        try {
            // Check if a user with the entered email already exists
            const { data: existingUser, error: fetchError } = await supabase
                .from('Users')
                .select('id')
                .eq('email', email)
                .single();

            // If there's a fetch error not related to missing data, show error
            if (fetchError && fetchError.code !== 'PGRST116') {
                setError("There was an error checking your information. Please try again.");
                return;
            }

            if (existingUser) {
                // User exists; store login state and redirect to tasks
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('userId', existingUser.id);
                router.push('/tasks');
            } else {
                // User does not exist; create a new user
                const { data: newUser, error: insertError } = await supabase
                    .from('Users')
                    .insert([{ name, email }])
                    .select()
                    .single();

                // Handle insertion errors
                if (insertError) {
                    setError("There was an error recording your information. Please try again.");
                } else if (newUser) {
                    // Store login state and redirect after creating new user
                    localStorage.setItem('loggedIn', 'true');
                    localStorage.setItem('userId', newUser.id);
                    router.push('/tasks');
                }
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            setError("Unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            {/* Page Title and Subtitle */}
            <div className="w-full max-w-md px-6">
                <h1 className="text-3xl font-bold text-left text-black mb-2">Login</h1>
                <p className="text-left text-gray-500 mb-6">Please sign in to continue.</p>
            </div>

            {/* Main Container with form */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Error message display */}
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    {/* Name Input Field */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-lg p-2"
                            required
                        />
                    </div>

                    {/* Email Input Field */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-lg p-2"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-full flex justify-center items-center">
                        Continue to Task List <span className="ml-2">→</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

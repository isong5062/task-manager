// src/pages/login.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../db'; // Adjust path as necessary

export default function LoginPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email) {
            setError("Please enter both your name and email.");
            return;
        }

        try {
            const { data: existingUser, error: fetchError } = await supabase
                .from('Users')
                .select('id')
                .eq('email', email)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                setError("There was an error checking your information. Please try again.");
                return;
            }

            if (existingUser) {
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('userId', existingUser.id);
                router.push('/tasks');
            } else {
                const { data: newUser, error: insertError } = await supabase
                    .from('Users')
                    .insert([{ name, email }])
                    .select()
                    .single();

                if (insertError) {
                    setError("There was an error recording your information. Please try again.");
                } else if (newUser) {
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
            {/* Title and Subtitle Outside the White Box */}
            <div className="w-full max-w-md px-6">
                <h1 className="text-3xl font-bold text-left text-black mb-2">Login</h1>
                <p className="text-left text-gray-500 mb-6">Please sign in to continue.</p>
            </div>

            {/* Main Container with rounded corners */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    
                    {/* Name Input */}
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

                    {/* Email Input */}
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

                    {/* Submit Button with Arrow */}
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-full flex justify-center items-center">
                        Continue to Task List <span className="ml-2">→</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

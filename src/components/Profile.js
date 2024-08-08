'use client';

import { useState, useEffect } from 'react';
import { axios } from '@/lib/axios';
import useSWR from 'swr';

const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
    console.error('Error fetching data:', error);
    throw error;
});

export const ProfileForm = () => {
    const { data: user, error: userError, mutate } = useSWR('/api/profile', fetcher);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');    

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            name,
            email,
        };

        try {
            await axios.put('/api/profile', formData);
            mutate(); // Re-fetch the user data after update
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to update profile.');
        }
    };

    if (userError) return <div>Failed to load profile: {userError.message}</div>;
    if (!user) return <div>Loading...</div>;

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default ProfileForm;

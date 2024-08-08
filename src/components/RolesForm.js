'use client';

import { useState, useEffect } from 'react';
import { axios } from '@/lib/axios';
import useSWR from 'swr';

const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
    console.error('Error fetching data:', error);
    throw error;
});

export const RolesForm = () => {
    const { data: roles, error: rolesError, mutate } = useSWR('/api/roles', fetcher);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            name,
            description,
        };

        try {
            await axios.post('/api/roles', formData);
            mutate();
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
    };

    useEffect(() => {
        console.log('Roles:', roles);
    }, [roles]);

    if (rolesError) return <div>Failed to load roles: {rolesError.message}</div>;
    if (!roles) return <div>Loading...</div>;

    return (
        <div>
            <h1>Roles CRUD</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default RolesForm;

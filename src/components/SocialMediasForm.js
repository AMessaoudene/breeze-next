'use client';

import { useState } from 'react';
import {axios} from '@/lib/axios';
import useSWR from 'swr';

const fetcher = url => 
    axios.get(url).then(res => res.data).catch(error => {
        if (error.response.status !== 409) throw error;
    });

export const SocialMediasForm = () => {
    const { data: socialMedias, error, mutate } = useSWR('/api/admin/socialmedias', fetcher);

    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newSocialMedia = { name };
            await axios.post('/api/admin/socialmedias', newSocialMedia);
            mutate();
            setName('');
        } catch (error) {
            console.error(error);
        }
    };

    if (error) return <div>Failed to load</div>;
    if (!socialMedias) return <div>Loading...</div>;

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                </div>
                <button type="submit">Create Social Media</button>
            </form>
        </div>
    );
};

export default SocialMediasForm;

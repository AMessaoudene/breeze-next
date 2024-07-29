'use client';

import { useState } from 'react';
import {axios} from '@/lib/axios'
import useSWR from 'swr';

const fetcher = url => 
    axios.get(url).then(res => res.data).catch(error => {
        if (error.response.status !== 409) throw error;
    });

export const OffersForm = () => {
    const { data: offers, error, mutate } = useSWR('/api/offers', fetcher);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newOffer = {
                name,
                description,
            };
            await axios.post('/api/offers', newOffer);
            mutate();
            setName('');
            setDescription('');
        } catch (error) {
            console.error(error);
        }
    };

    if (error) return <div>Failed to load</div>;
    if (!offers) return <div>Loading...</div>;

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <button type="submit">Create Offer</button>
            </form>
        </div>
    );
};

export default OffersForm;

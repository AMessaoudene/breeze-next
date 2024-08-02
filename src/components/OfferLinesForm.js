'use client';

import { useState } from 'react';
import {axios} from '@/lib/axios'
import useSWR from 'swr';

const fetcher = url => 
    axios.get(url).then(res => res.data).catch(error => {
        if (error.response.status !== 409) throw error;
    });

export const OfferLinesForm = () => {
    const { data: offerlines, error, mutate } = useSWR('/api/offers', fetcher);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newOfferline = {
                name,
                description,
            };
            await axios.post('/api/offerlines', newOfferline);
            mutate();
            setName('');
            setDescription('');
        } catch (error) {
            console.error(error);
        }
    };

    if (error) return <div>Failed to load</div>;
    if (!offerlines) return <div>Loading...</div>;

    return (
        <div>
            <h1>Offer Lines CRUD</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
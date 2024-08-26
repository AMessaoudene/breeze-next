'use client';

import { useState, useEffect } from 'react';
import { axios } from '@/lib/axios';
import useSWR from 'swr';

const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
    console.error('Error fetching data:', error);
    throw error;
});

export const StoreForm = () => {
    const { data: stores, error: storesError, mutate } = useSWR('/api/stores', fetcher);

    const [store, setStore] = useState({
        name: '',
        email: '',
        description: '',
        image: null,
        icon: null,
        website_id: '',
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setStore({
            ...store,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(store).forEach(key => formData.append(key, store[key]));

        try {
            await axios.post('/api/stores', formData);
            mutate();
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const resetForm = () => {
        setStore({
            name: '',
            email: '',
            description: '',
            image: null,
            icon: null,
            website_id: '',
        });
    };

    useEffect(() => {
        console.log('Stores:', stores);
    }, [stores]);

    if (storesError) return <div>Failed to load stores: {storesError.message}</div>;
    if (!stores) return <div>Loading...</div>;

    return (
        <div>
            <h1>Create Store</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={store.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={store.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={store.description}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div>
                    <label>Image</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Icon</label>
                    <input
                        type="file"
                        name="icon"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Website ID</label>
                    <input
                        type="text"
                        name="website_id"
                        value={store.website_id}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default StoreForm;

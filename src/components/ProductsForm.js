'use client'

import { useState } from 'react';
import axios from '@/lib/axios';

export const ProductsForm = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [media, setMedia] = useState(null);

    const handleMediaChange = (e) => {
        setMedia(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        if (media) {
            formData.append('media', media);
        }

        try {
            await axios.post('/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setName('');
            setPrice(0);
            setDescription('');
            setMedia(null);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Products CRUD</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Media</label>
                    <input
                        type="file"
                        onChange={handleMediaChange}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

'use client';

import { useState, useEffect } from 'react';
import { axios } from '@/lib/axios';
import useSWR from 'swr';

const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
    console.error('Error fetching data:', error);
    throw error;
});

export const ArticleCategoriesForm = () => {
    const { data: categories, error: categoriesError, mutate } = useSWR('/api/articlescategories', fetcher);

    const [category, setCategory] = useState({
        name: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory({
            ...category,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/articlescategories', category);
            mutate();
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const resetForm = () => {
        setCategory({
            name: '',
            description: '',
        });
    };

    useEffect(() => {
        console.log('Categories:', categories);
    }, [categories]);

    if (categoriesError) return <div>Failed to load categories: {categoriesError.message}</div>;
    if (!categories) return <div>Loading...</div>;

    return (
        <div>
            <h1>Article Categories CRUD</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={category.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={category.description}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ArticleCategoriesForm;

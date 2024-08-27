'use client';

import { useState, useEffect } from 'react';
import { axios } from '@/lib/axios';
import useSWR from 'swr';
import Label from '@/components/Label';
import Input from '@/components/Input'

const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
    console.error('Error fetching data:', error);
    throw error;
});

export const ArticlesForm = () => {
    const { data: articles, error: articlesError, mutate } = useSWR('/api/articles', fetcher);

    const [article, setArticle] = useState({
        code: '',
        name: '',
        description: '',
        barcode: '',
        sku: '',
        price: '',
        status: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setArticle({
            ...article,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/articles', article);
            mutate();
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const resetForm = () => {
        setArticle({
            code: '',
            name: '',
            description: '',
            barcode: '',
            sku: '',
            price: '',
            status: false,
        });
    };

    useEffect(() => {
        console.log('Articles:', articles);
    }, [articles]);

    if (articlesError) return <div>Failed to load articles: {articlesError.message}</div>;
    if (!articles) return <div>Loading...</div>;

    return (
        <div>
            <h1>Articles CRUD</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <Label>Code</Label>
                    <Input
                        type="text"
                        name="code"
                        value={article.code}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <Label>Name</Label>
                    <Input
                        type="text"
                        name="name"
                        value={article.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <Label>Description</Label>
                    <textarea
                        name="description"
                        value={article.description}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div>
                    <Label>Barcode</Label>
                    <Input
                        type="text"
                        name="barcode"
                        value={article.barcode}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label>SKU</Label>
                    <Input
                        type="text"
                        name="sku"
                        value={article.sku}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label>Price</Label>
                    <Input
                        type="number"
                        name="price"
                        value={article.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <Label>Status</Label>
                    <Input
                        type="checkbox"
                        name="status"
                        checked={article.status}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ArticlesForm;

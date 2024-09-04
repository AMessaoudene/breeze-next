'use client';

import { useState } from 'react';
import { axios } from '@/lib/axios';
import useSWR from 'swr';

const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
    console.error('Error fetching data:', error);
    throw error;
});

export const BlogPostForm = () => {
    const { data: users, error: usersError } = useSWR('/api/users', fetcher);
    const { data: articles, error: articlesError } = useSWR('/api/articles', fetcher);

    const [blogPost, setBlogPost] = useState({
        title: '',
        content: '',
        slug: '',
        published: true,
        user_id: '',
        medias: [],
        articles: [{ article_id: '' }],
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBlogPost({
            ...blogPost,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        setBlogPost({
            ...blogPost,
            medias: [...e.target.files],
        });
    };

    const handleArrayChange = (e, index, arrayName, key) => {
        const { value } = e.target;
        const updatedArray = [...blogPost[arrayName]];
        updatedArray[index][key] = value;
        setBlogPost({ ...blogPost, [arrayName]: updatedArray });
    };

    const addArrayField = (arrayName) => {
        const updatedArray = [...blogPost[arrayName], {}];
        setBlogPost({ ...blogPost, [arrayName]: updatedArray });
    };

    const removeArrayField = (index, arrayName) => {
        const updatedArray = blogPost[arrayName].filter((_, i) => i !== index);
        setBlogPost({ ...blogPost, [arrayName]: updatedArray });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', blogPost.title);
        formData.append('content', blogPost.content);
        formData.append('slug', blogPost.slug);
        formData.append('published', blogPost.published);
        formData.append('user_id', blogPost.user_id);

        blogPost.medias.forEach((file, index) => {
            formData.append(`medias[${index}]`, file);
        });

        blogPost.articles.forEach((article, index) => {
            formData.append(`articles[${index}][article_id]`, article.article_id);
        });

        try {
            await axios.post('/api/blogposts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const resetForm = () => {
        setBlogPost({
            title: '',
            content: '',
            slug: '',
            published: true,
            user_id: '',
            medias: [],
            articles: [{ article_id: '' }],
        });
    };

    if (usersError || articlesError) return <div>Failed to load data</div>;
    if (!users || !articles) return <div>Loading...</div>;

    return (
        <div>
            <h1>Create Blog Post</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={blogPost.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Content</label>
                    <textarea
                        name="content"
                        value={blogPost.content}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Slug</label>
                    <input
                        type="text"
                        name="slug"
                        value={blogPost.slug}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Published</label>
                    <input
                        type="checkbox"
                        name="published"
                        checked={blogPost.published}
                        onChange={handleChange}
                    />
                </div>

                <h3>Medias (Images)</h3>
                <div>
                    <input
                        type="file"
                        name="medias"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                    />
                </div>

                <h3>Articles</h3>
                {blogPost.articles.map((article, index) => (
                    <div key={index}>
                        <label>Article</label>
                        <select
                            value={article.article_id}
                            onChange={(e) => handleArrayChange(e, index, 'articles', 'article_id')}
                            required
                        >
                            <option value="">Select Article</option>
                            {articles.map((article) => (
                                <option key={article.id} value={article.id}>
                                    {article.title}
                                </option>
                            ))}
                        </select>
                        <button type="button" onClick={() => removeArrayField(index, 'articles')}>Remove</button>
                    </div>
                ))}
                <button type="button" onClick={() => addArrayField('articles')}>Add Article</button>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
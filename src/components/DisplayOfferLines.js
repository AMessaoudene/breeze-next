'use client'

import { useState } from 'react';
import {axios} from '@/lib/axios'
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = url => 
    axios.get(url).then(res => res.data).catch(error => {
        if (error.response.status !== 409) throw error;
    });

export const DisplayOfferLines = () => {
    const { data: offerlines, error, mutate } = useSWR('/api/offerlines', fetcher);
    const [editOfferLine, setEditOfferLine] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    if (error) return <div>Failed to load</div>;
    if (!offerlines) return <div>Loading...</div>;

    const handleEdit = (offerline) => {
        setEditOfferLine(offerline);
        setName(offerline.name);
        setDescription(offerline.description);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/offerlines/${id}`);
            mutate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/offerlines/${editOfferLine.id}`, { name, description });
            mutate();
            setEditOfferLine(null);
            setName('');
            setDescription('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Offer Lines</h2>
            <div className="offers-container">
                {offerlines.map(offerline => (
                    <div key={offerline.id} className="offer-card">
                        <h3>{offerline.name}</h3>
                        <p>{offerline.description}</p>
                        <button onClick={() => handleEdit(offerline)}>Edit</button>
                        <br/>
                        <button onClick={() => handleDelete(offerline.id)}>Delete</button>
                        <br/>
                        <Link href={`/offerlines/${offerline.id}`}>
                            Order Now
                        </Link>
                    </div>
                ))}
            </div>

            {editOfferLine && (
                <div className="edit-form">
                    <h3>Edit Offer Line</h3>
                    <form onSubmit={handleUpdate}>
                        <div>
                            <label>Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <label>Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <button type="submit">Update Offer</button>
                        <button type="button" onClick={() => setEditOffer(null)}>Cancel</button>
                    </form>
                </div>
            )}

            <style jsx>{`
                .offers-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                .offer-card {
                    border: 1px solid #ccc;
                    padding: 16px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    width: calc(33.333% - 32px);
                    box-sizing: border-box;
                }
                .offer-card h3 {
                    margin: 0 0 8px;
                }
                .offer-card p {
                    margin: 0 0 16px;
                }
                .edit-form {
                    margin-top: 20px;
                    padding: 16px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .edit-form h3 {
                    margin-top: 0;
                }
                .edit-form form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .edit-form button {
                    margin-top: 16px;
                }
            `}</style>
        </div>
    );
};

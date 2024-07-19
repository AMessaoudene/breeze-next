'use client'

import { useState } from 'react';
import axios from '@/lib/axios';
import useSWR from 'swr';

const fetcher = url =>
    axios.get(url).then(res => res.data).catch(error => {
        if (error.response.status !== 409) throw error;
    });

export const DisplayOfferLinesStatuses = () => {
    const { data: offerLinesStatuses, error: offerLinesStatusesError, mutate } = useSWR('/api/offerlinesstatuses', fetcher);
    const { data: offers, error: offersError } = useSWR('/api/offers', fetcher);
    const { data: offerlines, error: offerlinesError } = useSWR('/api/offerlines', fetcher);

    const [editStatus, setEditStatus] = useState(null);
    const [offer_id, setOffer_id] = useState('');
    const [offerline_id, setOfferline_id] = useState('');
    const [status, setStatus] = useState('');

    if (offerLinesStatusesError || offersError || offerlinesError) return <div>Failed to load</div>;
    if (!offerLinesStatuses || !offers || !offerlines) return <div>Loading...</div>;

    const handleEdit = (offerLineStatus) => {
        setEditStatus(offerLineStatus);
        setOffer_id(offerLineStatus.offer_id);
        setOfferline_id(offerLineStatus.offerline_id);
        setStatus(offerLineStatus.status.toString());
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/offerlinesstatuses/${id}`);
            mutate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/offerlinesstatuses/${editStatus.id}`, {
                offer_id,
                offerline_id,
                status: status === 'true'
            });
            mutate();
            setEditStatus(null);
            setOffer_id('');
            setOfferline_id('');
            setStatus('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Offer Lines Statuses</h2>
            <div className="statuses-container">
                {offerLinesStatuses.map(status => (
                    <div key={status.id} className="status-card">
                        <h3>{status.offer_id} - {status.offerline_id}</h3>
                        <p>{status.status ? 'Active' : 'Inactive'}</p>
                        <button onClick={() => handleEdit(status)}>Edit</button>
                        <br />
                        <button onClick={() => handleDelete(status.id)}>Delete</button>
                    </div>
                ))}
            </div>

            {editStatus && (
                <div className="edit-form">
                    <h3>Edit Status</h3>
                    <form onSubmit={handleUpdate}>
                        <div>
                            <label htmlFor="offer_id">Offer ID</label>
                            <select
                                id="offer_id"
                                value={offer_id}
                                onChange={(e) => setOffer_id(e.target.value)}
                            >
                                <option value="">Select Offer</option>
                                {offers.map(offer => (
                                    <option key={offer.id} value={offer.id}>{offer.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="offerline_id">Offer Line ID</label>
                            <select
                                id="offerline_id"
                                value={offerline_id}
                                onChange={(e) => setOfferline_id(e.target.value)}
                            >
                                <option value="">Select Offer Line</option>
                                {offerlines.map(offerline => (
                                    <option key={offerline.id} value={offerline.id}>{offerline.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">Select Status</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                        <button type="submit">Update Status</button>
                        <button type="button" onClick={() => setEditStatus(null)}>Cancel</button>
                    </form>
                </div>
            )}

            <style jsx>{`
                .statuses-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                .status-card {
                    border: 1px solid #ccc;
                    padding: 16px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    width: calc(33.333% - 32px);
                    box-sizing: border-box;
                }
                .status-card h3 {
                    margin: 0 0 8px;
                }
                .status-card p {
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

'use client'

import { useState, useEffect } from 'react';
import {axios} from '@/lib/axios'
import useSWR from 'swr';

const fetcher = url =>
    axios.get(url).then(res => res.data).catch(error => {
        if (error.response.status !== 409) throw error;
    });

export const OfferLinesStatusesForm = () => {
    const { data: offerLinesStatuses, error: offerLinesStatusesError, mutate } = useSWR('/api/offerlinesstatuses', fetcher);
    const { data: offers, error: offersError } = useSWR('/api/offers', fetcher);
    const { data: offerlines, error: offerlinesError } = useSWR('/api/offerlines', fetcher);

    const [offer_id, setOffer_id] = useState('');
    const [offerline_id, setOfferline_id] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newOfferLinesStatus = {
                offer_id,
                offerline_id,
                status: status === 'true' // Convert the status to a boolean
            };
            await axios.post('/api/offerlinesstatuses', newOfferLinesStatus);
            mutate();
            setOffer_id('');
            setOfferline_id('');
            setStatus('');
        } catch (error) {
            console.error(error);
        }
    };

    if (offerLinesStatusesError || offersError || offerlinesError) return <div>Failed to load</div>;
    if (!offerLinesStatuses || !offers || !offerlines) return <div>Loading...</div>;

    return (
        <div>
            <h1>Offer Lines Statuses CRUD</h1>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

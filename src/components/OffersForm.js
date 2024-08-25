'use client';

import { useState } from 'react';
import { axios } from '@/lib/axios';
import useSWR from 'swr';

const fetcher = url => 
    axios.get(url).then(res => res.data).catch(error => {
        if (error.response.status !== 409) throw error;
    });

export const OffersForm = () => {
    const { data: offerLines, error: offerLinesError } = useSWR('/api/offerlines', fetcher);
    const { data: offerTimeTypes, error: offerTimeTypesError } = useSWR('/api/offertimetypes', fetcher);
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedOfferLines, setSelectedOfferLines] = useState({});
    const [offerPricing, setOfferPricing] = useState({});

    const handleOfferLineChange = (offerLineId) => {
        setSelectedOfferLines(prev => ({
            ...prev,
            [offerLineId]: !prev[offerLineId]
        }));
    };

    const handlePricingChange = (offerTimeTypeId, value) => {
        setOfferPricing(prev => ({
            ...prev,
            [offerTimeTypeId]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newOffer = {
                name,
                description,
                offer_lines: selectedOfferLines,
                offer_pricings: Object.entries(offerPricing).map(([offer_time_type_id, price]) => ({
                    offer_time_type_id,
                    price,
                })),
            };
            await axios.post('/api/offers', newOffer);
            // Reset form state after successful submission
            setName('');
            setDescription('');
            setSelectedOfferLines({});
            setOfferPricing({});
        } catch (error) {
            console.error(error);
        }
    };
    
    

    if (offerLinesError || offerTimeTypesError) return <div>Failed to load</div>;
    if (!offerLines || !offerTimeTypes) return <div>Loading...</div>;

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Description</label>
                <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                />
            </div>

            <div>
                <h2>Select Offer Lines</h2>
                {offerLines.map(offerLine => (
                    <div key={offerLine.id}>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={selectedOfferLines[offerLine.id] || false} 
                                onChange={() => handleOfferLineChange(offerLine.id)} 
                            />
                            {offerLine.name}
                        </label>
                    </div>
                ))}
            </div>

            <div>
                <h2>Set Pricing for Offer Time Types</h2>
                {offerTimeTypes.map(offerTimeType => (
                    <div key={offerTimeType.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <label style={{ marginRight: '10px' }}>{offerTimeType.name}</label>
                        <input 
                            type="number" 
                            value={offerPricing[offerTimeType.id] || ''} 
                            onChange={(e) => handlePricingChange(offerTimeType.id, e.target.value)} 
                            placeholder="Enter price"
                            required 
                        />
                    </div>
                ))}
            </div>

            <button type="submit">Create Offer</button>
        </form>
    );
};

export default OffersForm;

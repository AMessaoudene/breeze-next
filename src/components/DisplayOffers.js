'use client'

import { useState } from 'react';
import { axios } from '@/lib/axios';
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = url => 
    axios.get(url).then(res => res.data).catch(error => {
        if (error.response.status !== 409) throw error;
    });

export const DisplayOffers = () => {
    const { data: offers, error, mutate } = useSWR('/api/offers', fetcher);
    const [editOffer, setEditOffer] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        offer_lines: {},
        offer_pricings: [],
    });

    if (error) return <div>Failed to load</div>;
    if (!offers) return <div>Loading...</div>;

    const handleEdit = (offer) => {
        setEditOffer(offer);
        setFormData({
            name: offer.name,
            description: offer.description,
            offer_lines: offer.offer_lines.reduce((acc, line) => {
                acc[line.id] = line.status;
                return acc;
            }, {}),
            offer_pricings: offer.offer_pricings.map(pricing => ({
                offer_time_type_id: pricing.offer_time_type_id,
                price: pricing.price,
            })),
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/offers/${id}`);
            mutate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/offers/${editOffer.id}`, formData);
            mutate();
            setEditOffer(null);
            setFormData({
                name: '',
                description: '',
                offer_lines: {},
                offer_pricings: [],
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLineChange = (lineId) => {
        setFormData({
            ...formData,
            offer_lines: {
                ...formData.offer_lines,
                [lineId]: !formData.offer_lines[lineId],
            },
        });
    };

    const handlePricingChange = (index, field, value) => {
        const newPricings = [...formData.offer_pricings];
        newPricings[index][field] = value;
        setFormData({ ...formData, offer_pricings: newPricings });
    };

    return (
        <div>
            <h2>Offers</h2>
            <div className="offers-container">
                {offers.map(offer => (
                    <div key={offer.id} className="offer-card">
                        <h3>{offer.name}</h3>
                        <p>{offer.description}</p>
                        <button onClick={() => handleEdit(offer)}>Edit</button>
                        <br/>
                        <button onClick={() => handleDelete(offer.id)}>Delete</button>
                        <br/>
                        <Link href={`/offers/${offer.id}`}>
                            Order Now
                        </Link>
                    </div>
                ))}
            </div>

            {editOffer && (
                <div className="edit-form">
                    <h3>Edit Offer</h3>
                    <form onSubmit={handleUpdate}>
                        <div>
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Offer Lines</label>
                            {editOffer.offer_lines.map(line => (
                                <div key={line.id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.offer_lines[line.id] || false}
                                            onChange={() => handleLineChange(line.id)}
                                        />
                                        {line.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div>
                            <label>Offer Pricings</label>
                            {formData.offer_pricings.map((pricing, index) => (
                                <div key={index}>
                                    <label>Time Type</label>
                                    <select
                                        value={pricing.offer_time_type_id}
                                        onChange={(e) => handlePricingChange(index, 'offer_time_type_id', e.target.value)}
                                    >
                                        {editOffer?.available_time_types?.map(type => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label>Price</label>
                                    <input
                                        type="number"
                                        value={pricing.price}
                                        onChange={(e) => handlePricingChange(index, 'price', e.target.value)}
                                    />
                                </div>
                            ))}
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

'use client';

import { useState } from 'react';
import { axios } from '@/lib/axios';
import useSWR from 'swr';

const fetcher = url =>
    axios.get(url)
        .then(res => res.data)
        .catch(error => {
            if (error.response.status !== 409) throw error;
        });

export const ControlDiscounts = () => {
    const { data: discounts, error, mutate } = useSWR('/api/discounts', fetcher);
    const [loading, setLoading] = useState({});

    const handleDelete = async (discountId) => {
        setLoading(prev => ({ ...prev, [discountId]: true }));
        try {
            await axios.delete(`/api/discounts/${discountId}`);
            mutate(); // Re-fetch the discounts list after deletion
        } catch (error) {
            console.error(error);
        }
        setLoading(prev => ({ ...prev, [discountId]: false }));
    };

    if (error) return <div>Failed to load</div>;
    if (!discounts) return <div>Loading...</div>;

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Store Name</th>
                        <th>Amount</th>
                        <th>Percentage</th>
                        <th>Use Counter</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {discounts && discounts.length > 0 ? (
                        discounts.map(discount => (
                            <tr key={discount.id}>
                                <td>{discount.code}</td>
                                <td>{discount.stores?.name || 'No Store'}</td>
                                <td>{discount.amount || 'N/A'}</td>
                                <td>{discount.percentage || 'N/A'}</td>
                                <td>{discount.usecounter || 'N/A'}</td>
                                <td>{discount.startdate || 'N/A'}</td>
                                <td>{discount.enddate || 'N/A'}</td>
                                <td>
                                    <button onClick={() => handleDelete(discount.id)} disabled={loading[discount.id]} className="delete-button">
                                        {loading[discount.id] ? 'Deleting...' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No discounts available</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <style jsx>{`
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                .delete-button {
                    font-size: 12px;
                    padding: 4px 8px;
                }
            `}</style>
        </div>
    );
};

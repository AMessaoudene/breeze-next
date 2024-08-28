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

export const DisplayDiscounts = () => {
    const { data: discounts, error, mutate } = useSWR('/api/discounts', fetcher);
    const [editingDiscountId, setEditingDiscountId] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [loading, setLoading] = useState({});

    const handleEdit = (discount) => {
        setEditingDiscountId(discount.id);
        setFormValues({
            code: discount.code,
            amount: discount.amount,
            percentage: discount.percentage,
            usecounter: discount.usecounter,
            startdate: discount.startdate,
            enddate: discount.enddate,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setLoading(prev => ({ ...prev, [editingDiscountId]: true }));
        try {
            await axios.patch(`/api/discounts/${editingDiscountId}`, formValues);
            mutate(); // Re-fetch the discounts list after updating
            setEditingDiscountId(null);
        } catch (error) {
            console.error(error);
        }
        setLoading(prev => ({ ...prev, [editingDiscountId]: false }));
    };

    const handleCancel = () => {
        setEditingDiscountId(null);
        setFormValues({});
    };

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
                        <th>Counter</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {discounts && discounts.length > 0 ? (
                        discounts.map(discount => (
                            <tr key={discount.id} className={editingDiscountId === discount.id ? 'editing-row' : ''}>
                                <td>
                                    {editingDiscountId === discount.id ? (
                                        <input
                                            type="text"
                                            name="code"
                                            value={formValues.code}
                                            onChange={handleInputChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        discount.code
                                    )}
                                </td>
                                <td>{discount.stores?.name || 'No Store'}</td>
                                <td>
                                    {editingDiscountId === discount.id ? (
                                        <input
                                            type="number"
                                            name="amount"
                                            value={formValues.amount}
                                            onChange={handleInputChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        discount.amount || 'N/A'
                                    )}
                                </td>
                                <td>
                                    {editingDiscountId === discount.id ? (
                                        <input
                                            type="number"
                                            name="percentage"
                                            value={formValues.percentage}
                                            onChange={handleInputChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        discount.percentage || 'N/A'
                                    )}
                                </td>
                                <td>
                                    {editingDiscountId === discount.id ? (
                                        <input
                                            type="number"
                                            name="usecounter"
                                            value={formValues.usecounter}
                                            onChange={handleInputChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        discount.usecounter || 'N/A'
                                    )}
                                </td>
                                <td>{discount.counter || 'No Counter'}</td>
                                <td>
                                    {editingDiscountId === discount.id ? (
                                        <input
                                            type="date"
                                            name="startdate"
                                            value={formValues.startdate}
                                            onChange={handleInputChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        discount.startdate || 'N/A'
                                    )}
                                </td>
                                <td>
                                    {editingDiscountId === discount.id ? (
                                        <input
                                            type="date"
                                            name="enddate"
                                            value={formValues.enddate}
                                            onChange={handleInputChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        discount.enddate || 'N/A'
                                    )}
                                </td>
                                <td>
                                    {editingDiscountId === discount.id ? (
                                        <>
                                            <button onClick={handleSave} disabled={loading[discount.id]} className="save-button">
                                                {loading[discount.id] ? 'Saving...' : 'Save'}
                                            </button>
                                            <button onClick={handleCancel} className="cancel-button">
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(discount)} className="edit-button">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(discount.id)} disabled={loading[discount.id]} className="delete-button">
                                                {loading[discount.id] ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </>
                                    )}
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
                .editing-row {
                    background-color: #f9f9f9;
                }
                .edit-input {
                    width: 80px;
                    padding: 4px;
                    font-size: 12px;
                }
                .save-button, .cancel-button {
                    margin-right: 4px;
                    font-size: 12px;
                    padding: 4px 8px;
                }
                .edit-button, .delete-button {
                    font-size: 12px;
                    padding: 4px 8px;
                }
            `}</style>
        </div>
    );
};

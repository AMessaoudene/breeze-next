'use client';

import { useState, useEffect } from 'react';
import { axios } from '@/lib/axios';
import useSWR from 'swr';

const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
    console.error('Error fetching data:', error);
    throw error;
});

export const PaymentMethodsForm = () => {
    const { data: paymentMethods, error: paymentMethodsError, mutate } = useSWR('/api/paymentmethods', fetcher);

    const [name, setName] = useState('');
    const [commission, setCommission] = useState('');
    const [apikey, setApikey] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(true);

    const [editData, setEditData] = useState({});

    const handleInputChange = (id, field, value) => {
        setEditData(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            },
        }));
    };

    const handleEdit = (paymentMethod) => {
        setEditData(prev => ({
            ...prev,
            [paymentMethod.id]: paymentMethod,
        }));
    };

    const handleSave = async (id) => {
        try {
            await axios.put(`/api/paymentmethods/${id}`, editData[id]);
            mutate();
            setEditData(prev => {
                const newData = { ...prev };
                delete newData[id];
                return newData;
            });
        } catch (error) {
            console.error('Error updating payment method:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/paymentmethods/${id}`);
            mutate();
        } catch (error) {
            console.error('Error deleting payment method:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            name,
            commission,
            apikey,
            description,
            status
        };

        try {
            await axios.post('/api/paymentmethods', formData);
            mutate();
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const resetForm = () => {
        setName('');
        setCommission('');
        setApikey('');
        setDescription('');
        setStatus(true);
    };

    useEffect(() => {
        console.log('Payment Methods:', paymentMethods);
    }, [paymentMethods]);

    if (paymentMethodsError) return <div>Failed to load payment methods: {paymentMethodsError.message}</div>;
    if (!paymentMethods) return <div>Loading...</div>;

    return (
        <div>
            <h1>Payment Methods CRUD</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Commission</label>
                    <input
                        type="number"
                        value={commission}
                        onChange={e => setCommission(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>API Key</label>
                    <input
                        type="text"
                        value={apikey}
                        onChange={e => setApikey(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <div>
                    <label>Status</label>
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value === 'true')}
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
                <button type="submit">Submit</button>
            </form>
            <h2>Existing Payment Methods</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Commission</th>
                        <th>API Key</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paymentMethods.map(paymentMethod => (
                        <tr key={paymentMethod.id}>
                            <td>
                                {editData[paymentMethod.id] ? (
                                    <input
                                        type="text"
                                        value={editData[paymentMethod.id].name}
                                        onChange={e => handleInputChange(paymentMethod.id, 'name', e.target.value)}
                                    />
                                ) : (
                                    paymentMethod.name
                                )}
                            </td>
                            <td>
                                {editData[paymentMethod.id] ? (
                                    <input
                                        type="number"
                                        value={editData[paymentMethod.id].commission}
                                        onChange={e => handleInputChange(paymentMethod.id, 'commission', e.target.value)}
                                    />
                                ) : (
                                    paymentMethod.commission
                                )}
                            </td>
                            <td>
                                {editData[paymentMethod.id] ? (
                                    <input
                                        type="text"
                                        value={editData[paymentMethod.id].apikey}
                                        onChange={e => handleInputChange(paymentMethod.id, 'apikey', e.target.value)}
                                    />
                                ) : (
                                    paymentMethod.apikey
                                )}
                            </td>
                            <td>
                                {editData[paymentMethod.id] ? (
                                    <input
                                        type="text"
                                        value={editData[paymentMethod.id].description}
                                        onChange={e => handleInputChange(paymentMethod.id, 'description', e.target.value)}
                                    />
                                ) : (
                                    paymentMethod.description
                                )}
                            </td>
                            <td>
                                {editData[paymentMethod.id] ? (
                                    <select
                                        value={editData[paymentMethod.id].status}
                                        onChange={e => handleInputChange(paymentMethod.id, 'status', e.target.value === 'true')}
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                ) : (
                                    paymentMethod.status ? 'Active' : 'Inactive'
                                )}
                            </td>
                            <td>
                                {editData[paymentMethod.id] ? (
                                    <button onClick={() => handleSave(paymentMethod.id)}>Save</button>
                                ) : (
                                    <button onClick={() => handleEdit(paymentMethod)}>Edit</button>
                                )}
                                <button onClick={() => handleDelete(paymentMethod.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentMethodsForm;

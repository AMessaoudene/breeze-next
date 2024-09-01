'use client';

import { useState } from 'react';
import { axios } from '@/lib/axios';

export const ShipmentTypesForm = ({ onShipmentTypeCreated }) => {
    const [formValues, setFormValues] = useState({
        name: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/shipmenttypes', formValues);
            setFormValues({ name: '', description: '' });
            if (onShipmentTypeCreated) onShipmentTypeCreated(response.data);
        } catch (error) {
            setError('An error occurred while creating the shipment type.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Create Shipment Type</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formValues.description}
                        onChange={handleInputChange}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create'}
                </button>
            </form>
        </div>
    );
};

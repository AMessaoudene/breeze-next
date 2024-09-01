'use client';

import { useState } from 'react';
import { axios } from '@/lib/axios';
import useSWR from 'swr';

const fetcher = url => axios.get(url).then(res => res.data);

export const ShipmentPricingForm = ({ shipmentPricing, onSaved }) => {
    const [formValues, setFormValues] = useState({
        shipmentline_id: shipmentPricing?.shipmentline_id || '',
        state_id: shipmentPricing?.state_id || '',
        shipmenttype_id: shipmentPricing?.shipmenttype_id || '',
        price: shipmentPricing?.price || '',
    });
    const [loading, setLoading] = useState(false);

    const { data: shipmentLines } = useSWR('/api/shipmentlines', fetcher);
    const { data: states } = useSWR('/api/states', fetcher);
    const { data: shipmentTypes } = useSWR('/api/shipmenttypes', fetcher);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (shipmentPricing) {
                await axios.patch(`/api/shipmentpricings/${shipmentPricing.id}`, formValues);
            } else {
                await axios.post('/api/shipmentpricings', formValues);
            }
            onSaved();
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Shipment Line:</label>
                <select
                    name="shipmentline_id"
                    value={formValues.shipmentline_id}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Shipment Line</option>
                    {shipmentLines?.map(line => (
                        <option key={line.id} value={line.id}>
                            {line.shipmentcompany?.name} - {line.store?.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>State:</label>
                <select
                    name="state_id"
                    value={formValues.state_id}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select State</option>
                    {states?.map(state => (
                        <option key={state.id} value={state.id}>
                            {state.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Shipment Type:</label>
                <select
                    name="shipmenttype_id"
                    value={formValues.shipmenttype_id}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Shipment Type</option>
                    {shipmentTypes?.map(type => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Price:</label>
                <input
                    type="number"
                    name="price"
                    value={formValues.price}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
};

'use client';

import { useState } from 'react';
import { axios } from '@/lib/axios';
import useSWR from 'swr';
import { ShipmentPricingForm } from './ShipmentPricingForm';

const fetcher = url => axios.get(url).then(res => res.data);

export const DisplayShipmentPricings = () => {
    const { data: shipmentPricings, error, mutate } = useSWR('/api/shipmentpricings', fetcher);
    const [editingShipmentPricing, setEditingShipmentPricing] = useState(null);
    const [loading, setLoading] = useState({});

    const handleEdit = (shipmentPricing) => {
        setEditingShipmentPricing(shipmentPricing);
    };

    const handleDelete = async (id) => {
        setLoading(prev => ({ ...prev, [id]: true }));
        try {
            await axios.delete(`/api/shipmentpricings/${id}`);
            mutate();
        } catch (error) {
            console.error(error);
        }
        setLoading(prev => ({ ...prev, [id]: false }));
    };

    const handleSave = () => {
        setEditingShipmentPricing(null);
        mutate();
    };

    if (error) return <div>Failed to load</div>;
    if (!shipmentPricings) return <div>Loading...</div>;

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Shipment Line</th>
                        <th>State</th>
                        <th>Shipment Type</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {shipmentPricings && shipmentPricings.length > 0 ? (
                        shipmentPricings.map(shipmentPricing => (
                            <tr key={shipmentPricing.id}>
                                <td>{shipmentPricing.shipmentline?.shipmentcompany?.name} - {shipmentPricing.shipmentline?.store?.name}</td>
                                <td>{shipmentPricing.state?.name}</td>
                                <td>{shipmentPricing.shipmenttype?.name}</td>
                                <td>{shipmentPricing.price}</td>
                                <td>
                                    <button onClick={() => handleEdit(shipmentPricing)} className="edit-button">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(shipmentPricing.id)} disabled={loading[shipmentPricing.id]} className="delete-button">
                                        {loading[shipmentPricing.id] ? 'Deleting...' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No shipment pricings available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {editingShipmentPricing && (
                <ShipmentPricingForm
                    shipmentPricing={editingShipmentPricing}
                    onSaved={handleSave}
                />
            )}

            <style jsx>{`
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                }
                th {
                    padding-top: 12px;
                    padding-bottom: 12px;
                    text-align: left;
                    background-color: #f2f2f2;
                }
                .edit-button, .delete-button {
                    margin-right: 5px;
                }
            `}</style>
        </div>
    );
};

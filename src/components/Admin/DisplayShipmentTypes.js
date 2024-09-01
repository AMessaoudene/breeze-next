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

export const DisplayShipmentTypes = () => {
    const { data: shipmentTypes, error, mutate } = useSWR('/api/shipmenttypes', fetcher);
    const [editingShipmentTypeId, setEditingShipmentTypeId] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [loading, setLoading] = useState({});

    const handleEdit = (shipmentType) => {
        setEditingShipmentTypeId(shipmentType.id);
        setFormValues({
            name: shipmentType.name,
            description: shipmentType.description,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setLoading(prev => ({ ...prev, [editingShipmentTypeId]: true }));
        try {
            await axios.patch(`/api/shipmenttypes/${editingShipmentTypeId}`, formValues);
            mutate(); // Re-fetch the shipment types list after updating
            setEditingShipmentTypeId(null);
        } catch (error) {
            console.error(error);
        }
        setLoading(prev => ({ ...prev, [editingShipmentTypeId]: false }));
    };

    const handleCancel = () => {
        setEditingShipmentTypeId(null);
        setFormValues({});
    };

    const handleDelete = async (shipmentTypeId) => {
        setLoading(prev => ({ ...prev, [shipmentTypeId]: true }));
        try {
            await axios.delete(`/api/shipmenttypes/${shipmentTypeId}`);
            mutate(); // Re-fetch the shipment types list after deletion
        } catch (error) {
            console.error(error);
        }
        setLoading(prev => ({ ...prev, [shipmentTypeId]: false }));
    };

    if (error) return <div>Failed to load</div>;
    if (!shipmentTypes) return <div>Loading...</div>;

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {shipmentTypes && shipmentTypes.length > 0 ? (
                        shipmentTypes.map(shipmentType => (
                            <tr key={shipmentType.id} className={editingShipmentTypeId === shipmentType.id ? 'editing-row' : ''}>
                                <td>
                                    {editingShipmentTypeId === shipmentType.id ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formValues.name}
                                            onChange={handleInputChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        shipmentType.name
                                    )}
                                </td>
                                <td>
                                    {editingShipmentTypeId === shipmentType.id ? (
                                        <textarea
                                            name="description"
                                            value={formValues.description}
                                            onChange={handleInputChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        shipmentType.description || 'No Description'
                                    )}
                                </td>
                                <td>
                                    {editingShipmentTypeId === shipmentType.id ? (
                                        <>
                                            <button onClick={handleSave} disabled={loading[shipmentType.id]} className="save-button">
                                                {loading[shipmentType.id] ? 'Saving...' : 'Save'}
                                            </button>
                                            <button onClick={handleCancel} className="cancel-button">
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(shipmentType)} className="edit-button">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(shipmentType.id)} disabled={loading[shipmentType.id]} className="delete-button">
                                                {loading[shipmentType.id] ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No shipment types available</td>
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
                    width: 100%;
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

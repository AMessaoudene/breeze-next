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

export const DisplayShipmentLines = () => {
    const { data: shipmentLines, error, mutate } = useSWR('/api/shipmentlines', fetcher);
    const [editingShipmentLineId, setEditingShipmentLineId] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [loading, setLoading] = useState({});

    const handleEdit = (shipmentLine) => {
        setEditingShipmentLineId(shipmentLine.id);
        setFormValues({
            shipmentcompany_id: shipmentLine.shipmentcompany_id,
            store_id: shipmentLine.store_id,
            shipmentID: shipmentLine.shipmentID,
            tokenid: shipmentLine.tokenid,
            status: shipmentLine.status,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ 
            ...prev, 
            [name]: name === 'status' ? value === 'true' : value // Convert "true"/"false" to boolean 
        }));
    };

    const handleSave = async () => {
        setLoading(prev => ({ ...prev, [editingShipmentLineId]: true }));
        try {
            await axios.patch(`/api/shipmentlines/${editingShipmentLineId}`, formValues);
            mutate(); // Re-fetch the shipment lines list after updating
            setEditingShipmentLineId(null);
        } catch (error) {
            console.error(error);
        }
        setLoading(prev => ({ ...prev, [editingShipmentLineId]: false }));
    };

    const handleCancel = () => {
        setEditingShipmentLineId(null);
        setFormValues({});
    };

    const handleDelete = async (shipmentLineId) => {
        setLoading(prev => ({ ...prev, [shipmentLineId]: true }));
        try {
            await axios.delete(`/api/shipmentlines/${shipmentLineId}`);
            mutate(); // Re-fetch the shipment lines list after deletion
        } catch (error) {
            console.error(error);
        }
        setLoading(prev => ({ ...prev, [shipmentLineId]: false }));
    };

    if (error) return <div>Failed to load</div>;
    if (!shipmentLines) return <div>Loading...</div>;

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Shipment Company</th>
                        <th>Store Name</th>
                        <th>Shipment ID</th>
                        <th>Token ID</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {shipmentLines && shipmentLines.length > 0 ? (
                        shipmentLines.map(shipmentLine => (
                            <tr key={shipmentLine.id} className={editingShipmentLineId === shipmentLine.id ? 'editing-row' : ''}>
                                <td>
                                    {shipmentLine.shipmentcompany?.name || 'No Company'}
                                </td>
                                <td>
                                    {shipmentLine.store?.name || 'No Store'}
                                </td>
                                <td>
                                    {editingShipmentLineId === shipmentLine.id ? (
                                        <input
                                            type="text"
                                            name="shipmentID"
                                            value={formValues.shipmentID}
                                            onChange={handleInputChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        shipmentLine.shipmentID
                                    )}
                                </td>
                                <td>
                                    {editingShipmentLineId === shipmentLine.id ? (
                                        <input
                                            type="text"
                                            name="tokenid"
                                            value={formValues.tokenid}
                                            onChange={handleInputChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        shipmentLine.tokenid
                                    )}
                                </td>
                                <td>
                                    {editingShipmentLineId === shipmentLine.id ? (
                                        <select
                                            name="status"
                                            value={formValues.status}
                                            onChange={handleInputChange}
                                            className="edit-input"
                                        >
                                            <option value={true}>Active</option>
                                            <option value={false}>Inactive</option>
                                        </select>
                                    ) : (
                                        shipmentLine.status ? 'Active' : 'Inactive'
                                    )}
                                </td>
                                <td>
                                    {editingShipmentLineId === shipmentLine.id ? (
                                        <>
                                            <button onClick={handleSave} disabled={loading[shipmentLine.id]} className="save-button">
                                                {loading[shipmentLine.id] ? 'Saving...' : 'Save'}
                                            </button>
                                            <button onClick={handleCancel} className="cancel-button">
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(shipmentLine)} className="edit-button">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(shipmentLine.id)} disabled={loading[shipmentLine.id]} className="delete-button">
                                                {loading[shipmentLine.id] ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No shipment lines available</td>
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

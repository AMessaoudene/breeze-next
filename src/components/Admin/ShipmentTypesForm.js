'use client';

import { useState, useEffect } from 'react';
import { axios } from '@/lib/axios';
import useSWR from 'swr';

const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
    console.error('Error fetching data:', error);
    throw error;
});

export const ShipmentTypesForm = () => {
    const { data: shipmentTypes, error: shipmentTypesError, mutate } = useSWR('/api/shipmenttypes', fetcher);

    const [shipmentType, setShipmentType] = useState({
        name: '',
        description: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShipmentType({
            ...shipmentType,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`/api/shipmenttypes/${editingId}`, shipmentType);
                setIsEditing(false);
                setEditingId(null);
            } else {
                await axios.post('/api/shipmenttypes', shipmentType);
            }
            mutate();
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/shipmenttypes/${id}`);
            mutate();
        } catch (error) {
            console.error('Error deleting shipment type:', error);
        }
    };

    const handleEdit = (shipmentType) => {
        setShipmentType({
            name: shipmentType.name,
            description: shipmentType.description,
        });
        setIsEditing(true);
        setEditingId(shipmentType.id);
    };

    const resetForm = () => {
        setShipmentType({
            name: '',
            description: '',
        });
        setIsEditing(false);
        setEditingId(null);
    };

    useEffect(() => {
        console.log('Shipment Types:', shipmentTypes);
    }, [shipmentTypes]);

    if (shipmentTypesError) return <div>Failed to load shipment types: {shipmentTypesError.message}</div>;
    if (!shipmentTypes) return <div>Loading...</div>;

    return (
        <div>
            <h1>Shipment Types CRUD</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={shipmentType.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={shipmentType.description}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <button type="submit">{isEditing ? 'Update' : 'Submit'}</button>
                {isEditing && <button onClick={resetForm}>Cancel</button>}
            </form>
            <div>
                <h2>Existing Shipment Types</h2>
                <ul>
                    {shipmentTypes.map((type) => (
                        <li key={type.id}>
                            {type.name} - {type.description} 
                            <button onClick={() => handleEdit(type)}>Edit</button>
                            <button onClick={() => handleDelete(type.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ShipmentTypesForm;

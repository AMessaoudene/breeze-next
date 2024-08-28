'use client';

import { useState, useEffect } from 'react';
import { axios } from '@/lib/axios';
import useSWR from 'swr';

const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
    console.error('Error fetching data:', error);
    throw error;
});

export const ShipmentCompaniesForm = () => {
    const { data: companies, error: companiesError, mutate } = useSWR('/api/shipmentcompanies', fetcher);

    const [company, setCompany] = useState({
        name: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompany({
            ...company,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`/api/shipmentcompanies/${editingId}`, company);
                setIsEditing(false);
                setEditingId(null);
            } else {
                await axios.post('/api/shipmentcompanies', company);
            }
            mutate();
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/shipmentcompanies/${id}`);
            mutate();
        } catch (error) {
            console.error('Error deleting company:', error);
        }
    };

    const handleEdit = (company) => {
        setCompany({
            name: company.name,
        });
        setIsEditing(true);
        setEditingId(company.id);
    };

    const resetForm = () => {
        setCompany({
            name: '',
        });
        setIsEditing(false);
        setEditingId(null);
    };

    useEffect(() => {
        console.log('Shipment Companies:', companies);
    }, [companies]);

    if (companiesError) return <div>Failed to load companies: {companiesError.message}</div>;
    if (!companies) return <div>Loading...</div>;

    return (
        <div>
            <h1>Shipment Companies CRUD</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={company.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">{isEditing ? 'Update' : 'Submit'}</button>
                {isEditing && <button onClick={resetForm}>Cancel</button>}
            </form>
            <div>
                <h2>Existing Shipment Companies</h2>
                <ul>
                    {companies.map((comp) => (
                        <li key={comp.id}>
                            {comp.name} 
                            <button onClick={() => handleEdit(comp)}>Edit</button>
                            <button onClick={() => handleDelete(comp.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ShipmentCompaniesForm;

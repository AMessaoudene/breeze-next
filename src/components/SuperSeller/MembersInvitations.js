'use client';

import { useState, useEffect } from 'react';
import { axios } from '@/lib/axios';
import useSWR from 'swr';

const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
    console.error('Error fetching data:', error);
    throw error;
});

const MembershipInvitations = () => {
    const { data: invitations, error: invitationsError, mutate } = useSWR('/api/invitations', fetcher);
    const { data: stores, error: storesError } = useSWR('/api/stores', fetcher);
    const { data: roles, error: rolesError } = useSWR('/api/roles', fetcher);

    const [formData, setFormData] = useState({
        email: '',
        store_id: '',
        role_id: '',
    });
    const [editingId, setEditingId] = useState(null);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await axios.put(`/api/invitations/${editingId}`, formData);
            } else {
                await axios.post('/api/invitations', formData);
            }
            mutate(); // Re-fetch the data
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (invitation) => {
        setFormData({
            email: invitation.email,
            store_id: invitation.store_id,
            role_id: invitation.role_id,
        });
        setEditingId(invitation.id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/invitations/${id}`);
            mutate(); // Re-fetch the data
        } catch (error) {
            console.error('Error deleting invitation:', error);
        }
    };

    const resetForm = () => {
        setFormData({ email: '', store_id: '', role_id: '' });
        setEditingId(null);
    };

    useEffect(() => {
        console.log('Invitations:', invitations);
    }, [invitations]);

    if (invitationsError) return <div>Failed to load invitations: {invitationsError.message}</div>;
    if (storesError) return <div>Failed to load stores: {storesError.message}</div>;
    if (rolesError) return <div>Failed to load roles: {rolesError.message}</div>;
    if (!invitations || !stores || !roles) return <div>Loading...</div>;

    return (
        <div>
            <h1>Manage Membership Invitations</h1>
            <h2>Invitations</h2>
            {invitations?.map((invitation) => (
                <div key={invitation.id}>
                    <p>Email: {invitation.email}</p>
                    <p>Store: {stores.find(store => store.id === invitation.store_id)?.name || 'No store assigned'}</p>
                    <p>Role: {roles.find(role => role.id === invitation.role_id)?.name || 'No role assigned'}</p>
                    <p>Status: {invitation.status ? 'Accepted' : 'Pending'}</p>
                    <button onClick={() => handleEdit(invitation)}>Edit</button>
                    <button onClick={() => handleDelete(invitation.id)}>Delete</button>
                </div>
            ))}

            <h2>{editingId ? 'Edit' : 'Add'} Invitation</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="User Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
                <select
                    name="store_id"
                    value={formData.store_id}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Store</option>
                    {stores?.map((store) => (
                        <option key={store.id} value={store.id}>
                            {store.name}
                        </option>
                    ))}
                </select>
                <select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Role</option>
                    {roles?.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                    ))}
                </select>
                <button type="submit">{editingId ? 'Update' : 'Add'}</button>
                {editingId && <button onClick={resetForm}>Cancel</button>}
            </form>
        </div>
    );
};

export default MembershipInvitations;

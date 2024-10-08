'use client';

import { useState, useEffect } from 'react';
import { axios } from '@/lib/axios';
import useSWR from 'swr';

const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
    console.error('Error fetching data:', error);
    throw error;
});

export const ManageAccounts = () => {
    const { data: userRoles, error: userRolesError, mutate } = useSWR('/api/userroles', fetcher);
    const { data: roles, error: rolesError } = useSWR('/api/roles', fetcher);

    const [formData, setFormData] = useState({
        email: '',
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
                // Update existing user role
                await axios.put(`/api/userroles/${editingId}`, formData);
            } else {
                // Create a new user role
                await axios.post('/api/userroles', formData);
            }
            mutate(); // Re-fetch the data
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (userRole) => {
        setFormData({
            email: userRole.users.email,
            role_id: userRole.role_id,
        });
        setEditingId(userRole.id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/userroles/${id}`);
            mutate(); // Re-fetch the data
        } catch (error) {
            console.error('Error deleting user role:', error);
        }
    };

    const resetForm = () => {
        setFormData({ email: '', store_id: '', role_id: '' });
        setEditingId(null);
    };

    useEffect(() => {
        console.log('User Roles:', userRoles);
    }, [userRoles]);

    if (userRolesError) return <div>Failed to load user roles: {userRolesError.message}</div>;
    if (rolesError) return <div>Failed to load roles: {rolesError.message}</div>;
    if (!userRoles || !roles) return <div>Loading...</div>;

    return (
        <div>
            <h1>Manage Accounts</h1>
            <h2>User Roles</h2>
            {userRoles?.map((userRole) => (
                <div key={userRole.id}>
                    <p>Email: {userRole.users?.email || 'No user assigned'}</p>
                    <p>Role: {userRole.roles?.name || 'No role assigned'}</p>
                    <button onClick={() => handleEdit(userRole)}>Edit</button>
                    <button onClick={() => handleDelete(userRole.id)}>Delete</button>
                </div>
            ))}

            <h2>{editingId ? 'Edit' : 'Add'} User Role</h2>
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

export default ManageAccounts;

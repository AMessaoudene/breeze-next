'use client';

import { axios } from '@/lib/axios';
import useSWR from 'swr';
import { useState } from 'react';

const fetcher = url =>
    axios
        .get(url)
        .then(res => res.data)
        .catch(error => {
            if (error.response.status !== 409) throw error;
        });

export const DisplayRoles = () => {
    const { data: roles, error, mutate } = useSWR('/api/admin/roles', fetcher);
    const [loading, setLoading] = useState({});
    const [editingRoleId, setEditingRoleId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');

    const handleDelete = async (roleId) => {
        setLoading(prev => ({ ...prev, [roleId]: true }));
        try {
            await axios.delete(`/api/admin/roles/${roleId}`);
            mutate(); // Re-fetch the roles list after deletion
        } catch (error) {
            console.error(error);
        }
        setLoading(prev => ({ ...prev, [roleId]: false }));
    };

    const handleEdit = (role) => {
        setEditingRoleId(role.id);
        setEditName(role.name);
        setEditDescription(role.description);
    };

    const handleSave = async (roleId) => {
        setLoading(prev => ({ ...prev, [roleId]: true }));
        try {
            await axios.put(`/api/admin/roles/${roleId}`, {
                name: editName,
                description: editDescription,
            });
            mutate(); // Re-fetch the roles list after saving
            setEditingRoleId(null);
        } catch (error) {
            console.error(error);
        }
        setLoading(prev => ({ ...prev, [roleId]: false }));
    };

    const handleCancel = () => {
        setEditingRoleId(null);
    };

    if (error) return <div>Failed to load</div>;
    if (!roles) return <div>Loading...</div>;

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
                    {roles.map(role => (
                        <tr key={role.id}>
                            {editingRoleId === role.id ? (
                                <>
                                    <td>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <button onClick={() => handleSave(role.id)} disabled={loading[role.id]}>
                                            {loading[role.id] ? 'Saving...' : 'Save'}
                                        </button>
                                        <button onClick={handleCancel}>Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{role.name}</td>
                                    <td>{role.description}</td>
                                    <td>
                                        <button onClick={() => handleEdit(role)}>Edit</button>
                                        <button onClick={() => handleDelete(role.id)} disabled={loading[role.id]}>
                                            {loading[role.id] ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

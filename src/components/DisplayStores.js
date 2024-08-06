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

export const DisplayStores = () => {
    const { data: stores, error, mutate } = useSWR('/api/admin/stores', fetcher);
    const [loading, setLoading] = useState({});

    const handleDelete = async (storeId) => {
        setLoading(prev => ({ ...prev, [storeId]: true }));
        try {
            await axios.delete(`/api/admin/stores/${storeId}`);
            mutate(); // Re-fetch the stores list after deletion
        } catch (error) {
            console.error(error);
        }
        setLoading(prev => ({ ...prev, [storeId]: false }));
    };

    if (error) return <div>Failed to load</div>;
    if (!stores) return <div>Loading...</div>;

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Reports</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {stores && stores.length > 0 ? (
                        stores.map(store => (
                            <tr key={store.id}>
                                <td>{store.name}</td>
                                <td>
                                    <button onClick={() => handleDelete(store.id)} disabled={loading[store.id]}>
                                        {loading[store.id] ? 'Deleting...' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2">No stores available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

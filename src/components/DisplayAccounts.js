'use client'

import { useState } from 'react';
import {axios} from '@/lib/axios'
import useSWR from 'swr';
import Link from 'next/link';
import { Dialog } from '@headlessui/react';

const fetcher = url =>
    axios.get(url).then(res => res.data).catch(error => {
        if (error.response.status !== 409) throw error;
    });

const Modal = ({ isOpen, onClose, account }) => {
    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                <div className="bg-white rounded max-w-md mx-auto p-4 z-50">
                    <Dialog.Title className="text-lg font-bold">{account.name}</Dialog.Title>
                    <Dialog.Description className="mt-2">
                        <p>Email: {account.email}</p>
                        {/* Add other account details here */}
                    </Dialog.Description>
                    <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                        Close
                    </button>
                </div>
            </div>
        </Dialog>
    );
};

export const DisplayAccounts = () => {
    const { data, error, mutate } = useSWR('/api/admin/accounts', fetcher);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAccount, setCurrentAccount] = useState(null);

    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/admin/accounts/${id}`);
            mutate(); // Refresh the data after deletion
        } catch (error) {
            console.error('Failed to delete account:', error);
        }
    };

    const openModal = (account) => {
        setCurrentAccount(account);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentAccount(null);
    };

    return (
        <div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(account => (
                        <tr key={account.id}>
                            <td className="py-2 px-4 border-b">
                                <Link href={`/accounts/${account.id}`}>
                                    {account.name}
                                </Link>
                            </td>
                            <td className="py-2 px-4 border-b">{account.email}</td>
                            <td className="py-2 px-4 border-b">
                                <button 
                                    onClick={() => openModal(account)} 
                                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                >
                                    Show
                                </button>
                                <button 
                                    onClick={() => handleDelete(account.id)} 
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal} account={currentAccount} />
            )}
        </div>
    );
};

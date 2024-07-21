'use client'

import { useState } from 'react';
import axios from '@/lib/axios';
import useSWR from 'swr';
import Link from 'next/link';
import Modal from './Modal';

const fetcher = url =>
    axios.get(url).then(res => res.data).catch(error => {
        if (error.response.status !== 409) throw error;
    });

export const DisplayPackages = () => {

    const { data, error, mutate } = useSWR('/api/packages', fetcher);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [packageLines, setPackageLines] = useState([]);
    const [selectedPackageName, setSelectedPackageName] = useState('');

    const openModal = async (packageId, packageName) => {
        try {
            const response = await axios.get(`/api/packages/${packageId}/lines`);
            setPackageLines(response.data);
            setSelectedPackageName(packageName);
            setModalIsOpen(true);
        } catch (error) {
            console.error('Error fetching package lines:', error);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setPackageLines([]);
        setSelectedPackageName('');
    };

    const deletePackage = async (packageId) => {
        try {
            await axios.delete(`/api/packages/${packageId}`);
            mutate(); // Refresh the data after deletion
        } catch (error) {
            console.error('Error deleting package:', error);
        }
    };

    if (error) return <div>Failed to load</div>;

    if (!data) return <div>Loading...</div>;

    return (
        <div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">Name</th>
                        <th className="py-2">Description</th>
                        <th className="py-2">Price</th>
                        <th className="py-2">Actions</th>
                        <th className="py-2">Package Lines</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td className="py-2">{item.name}</td>
                            <td className="py-2">{item.description}</td>
                            <td className="py-2">{item.price}</td>
                            <td className="py-2">
                                <Link href={`/packages/${item.id}`} className="text-blue-500 hover:text-blue-700">Edit</Link>
                                <button onClick={() => deletePackage(item.id)} className="text-red-500 hover:text-red-700 ml-2">Delete</button>
                            </td>
                            <td className="py-2">
                                <button onClick={() => openModal(item.id, item.name)} className="text-blue-500 hover:text-blue-700">
                                    View Lines
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Package Lines"
                ariaHideApp={false}
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>{selectedPackageName} - Package Lines</h2>
                <button onClick={closeModal} className="close-modal">Close</button>
                {packageLines.length > 0 ? (
                    <ul>
                        {packageLines.map((line, index) => (
                            <li key={index}>
                                Product: {line.product ? line.product.name : 'Unknown'}, Quantity: {line.quantity}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No package lines found.</p>
                )}
            </Modal>
        </div>
    );
}

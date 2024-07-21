'use client';

import axios from '@/lib/axios';
import useSWR from 'swr';
import { useState } from 'react';
import Modal from './Modal'; // Import the Modal component

const fetcher = url =>
    axios
        .get(url)
        .then(res => res.data)
        .catch(error => {
            if (error.response.status !== 409) throw error;
        });

export const DisplayProducts = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const { data: products, error, mutate } = useSWR(`/api/products?per_page=${itemsPerPage}&page=${currentPage}`, fetcher);
    const [loading, setLoading] = useState({});
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = async (productId) => {
        setLoading(prev => ({ ...prev, [productId]: true }));
        try {
            await axios.delete(`/api/products/${productId}`);
            mutate(); // Re-fetch the products list after deletion
        } catch (error) {
            console.error(error);
        }
        setLoading(prev => ({ ...prev, [productId]: false }));
    };

    const handleNextPage = () => {
        if (products && products.next_page_url) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const openModal = (mediaLink) => {
        setSelectedMedia(mediaLink);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMedia(null);
    };

    if (error) return <div>Failed to load</div>;
    if (!products) return <div>Loading...</div>;

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Media</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.data.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>
                                {(product.medias || []).map(media => (
                                    <button key={media.id} onClick={() => openModal(media.link)}>
                                        <img src={media.link} alt="Product Media" style={{ width: '100px', height: 'auto' }} />
                                    </button>
                                ))}
                            </td>
                            <td>{product.status ? 'Active' : 'Inactive'}</td>
                            <td>
                                <button onClick={() => handleDelete(product.id)} disabled={loading[product.id]}>
                                    {loading[product.id] ? 'Deleting...' : 'Delete'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage}</span>
                <button onClick={handleNextPage} disabled={!products.next_page_url}>
                    Next
                </button>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <img src={selectedMedia} alt="Selected Media" style={{ width: '100%', height: 'auto' }} />
            </Modal>
        </div>
    );
};

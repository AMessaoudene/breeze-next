'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SuperSellerLayout from '@/components/SuperSellerLayout';
import CreateStoreModal from '@/components/CreateStoreModal';

const Stores = () => {
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchWebsites = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/superseller/stores', {
                    withCredentials: true
                });
                setWebsites(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWebsites();
    }, []);

    const handleCreateStore = async (storeData) => {
        try {
            const response = await axios.post('http://localhost:8000/api/superseller/stores', storeData, {
                withCredentials: true
            });
            setWebsites(prevWebsites => [...prevWebsites, response.data]);
            return { success: true };
        } catch (error) {
            if (error.response && error.response.data.errors) {
                return { success: false, errors: error.response.data.errors };
            } else {
                setError(error.message);
                return { success: false, errors: {} };
            }
        }
    };

    const handleDeleteStore = async (storeId) => {
        try {
            await axios.delete(`http://localhost:8000/api/superseller/stores/${storeId}`, {
                withCredentials: true
            });
            setWebsites(prevWebsites => prevWebsites.filter(website => website.id !== storeId));
        } catch (error) {
            setError(error.message);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <SuperSellerLayout>
            <h1 className="text-2xl font-bold mb-4">Your Stores</h1>
            {websites.length === 0 ? (
                <div>
                    <p>No stores found.</p>
                </div>
            ) : (
                <ul>
                    {websites.map(website => (
                        <li key={website.id} className="mb-4">
                            <h2 className="text-xl font-semibold">{website.name}</h2>
                            <p>{website.description}</p>
                            <ul className="ml-4">
                                {website.pages.map(page => (
                                    <li key={page.id}>{page.title}</li>
                                ))}
                            </ul>
                            <div className="mt-2">
                                <button 
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                                >
                                    Visit Store
                                </button>
                                <button 
                                    onClick={() => router.push(`/websites/${website.domain}/website-dashboard`)}
                                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                                >
                                    Website Dashboard
                                </button>
                                <button 
                                    onClick={() => handleDeleteStore(website.id)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Delete Store
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <button 
                onClick={openModal}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Create Store
            </button>
            <CreateStoreModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleCreateStore}
            />
        </SuperSellerLayout>
    );
};

export default Stores;

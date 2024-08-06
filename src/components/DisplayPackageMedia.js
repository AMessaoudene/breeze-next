import { useState } from 'react';
import { axios } from '@/lib/axios';
import useSWR from 'swr';
import Modal from './Modal'; // Import the Modal component

const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
    if (error.response.status !== 409) throw error;
});

export const DisplayPackageMedia = ({ packageId }) => {
    const { data: media, error } = useSWR(`/api/packages/${packageId}/media`, fetcher);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (mediaLink) => {
        setSelectedMedia(mediaLink);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMedia(null);
    };

    if (error) return <div>Failed to load</div>;
    if (!media) return <div>Loading...</div>;

    return (
        <div>
            {media.map((item) => (
                <button key={item.id} onClick={() => openModal(item.link)}>
                    {item.media_type && item.media_type.startsWith('image') ? (
                        <img src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${item.link}`} alt="Package Media" style={{ width: '100px', height: 'auto' }} />
                    ) : (
                        <span>Download {item.media_type || 'file'}</span>
                    )}
                </button>
            ))}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {selectedMedia && (
                    <div>
                        {selectedMedia.endsWith('.pdf') ? (
                            <embed src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${selectedMedia}`} type="application/pdf" width="100%" height="600px" />
                        ) : (
                            <img src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${selectedMedia}`} alt="Selected Media" style={{ width: '100%', height: 'auto' }} />
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

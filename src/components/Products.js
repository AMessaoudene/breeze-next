import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [currentProduct, setCurrentProduct] = useState({
        id: '',
        name: '',
        price: '',
        measure_id: '',
        unit: '',
        description: '',
        status: true,
        media: [], // To store media files
    });
    const [mediaFiles, setMediaFiles] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/products', {
                withCredentials: true
            });
            setProducts(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (type, product = {}) => {
        setModalType(type);
        setCurrentProduct({
            id: product.id || '',
            name: product.name || '',
            price: product.price || '',
            measure_id: product.measure_id || '',
            unit: product.unit || '',
            description: product.description || '',
            status: product.status || true,
            media: product.medias || [], // Initialize media files if editing
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        setCurrentProduct({ ...currentProduct, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setMediaFiles([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', currentProduct.name);
        formData.append('price', currentProduct.price);
        formData.append('measure_id', currentProduct.measure_id);
        formData.append('unit', currentProduct.unit);
        formData.append('description', currentProduct.description);
        formData.append('status', currentProduct.status ? '1' : '0');
        
        // Append media files
        mediaFiles.forEach(file => {
            formData.append('media[]', file);
        });

        try {
            let response;
            if (modalType === 'add') {
                response = await axios.post('http://localhost:8000/api/products', formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else if (modalType === 'edit') {
                response = await axios.put(`http://localhost:8000/api/products/${currentProduct.id}`, formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            fetchProducts();
            handleCloseModal();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/products/${id}`, {
                withCredentials: true
            });
            fetchProducts();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteMedia = async (productId, mediaId) => {
        try {
            await axios.delete(`http://localhost:8000/api/products/${productId}/media/${mediaId}`, {
                withCredentials: true
            });
            fetchProducts(); // Refresh the list to reflect changes
        } catch (error) {
            setError(error.message);
        }
    };

    const handleViewMedia = (mediaLink) => {
        window.open(`http://localhost:8000/storage/${mediaLink}`, '_blank');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Products CRUD</h1>
            <button onClick={() => handleOpenModal('add')}>Add Product</button>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <p>Price: {product.price}</p>
                        <p>Unit: {product.unit}</p>
                        <p>Status: {product.status ? 'Active' : 'Inactive'}</p>
                        <div>
                            <p>Media :</p>
                            {product.medias && product.medias.map(media => (
                                <div key={media.id}>
                                    <img src={`http://localhost:8000/storage/${media.link}`} alt="Product Media" style={{ width: '100px', height: 'auto' }} />
                                    <button onClick={() => handleViewMedia(media.link)}>View</button>
                                    <button onClick={() => handleDeleteMedia(product.id, media.id)}>Delete Media</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleOpenModal('edit', product)}>Edit</button>
                        <button onClick={() => handleDelete(product.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Product Modal"
            >
                <h2>{modalType === 'add' ? 'Add Product' : 'Edit Product'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={currentProduct.name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Price:
                        <input
                            type="number"
                            name="price"
                            value={currentProduct.price}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Measure ID:
                        <input
                            type="text"
                            name="measure_id"
                            value={currentProduct.measure_id}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Unit:
                        <input
                            type="text"
                            name="unit"
                            value={currentProduct.unit}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Description:
                        <input
                            type="text"
                            name="description"
                            value={currentProduct.description}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Status:
                        <input
                            type="checkbox"
                            name="status"
                            checked={currentProduct.status}
                            onChange={() => setCurrentProduct({ ...currentProduct, status: !currentProduct.status })}
                        />
                    </label>
                    <label>
                        Upload Media:
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                        />
                    </label>
                    <button type="submit">Submit</button>
                </form>
                <button onClick={handleCloseModal}>Close</button>
            </Modal>
        </div>
    );
};

export default Products;

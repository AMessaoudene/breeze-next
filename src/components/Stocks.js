import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const Stocks = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [currentStock, setCurrentStock] = useState({
        id: '',
        store_id: '',
        product_id: '',
        slug: '',
        quantity: '',
        minquantity: ''
    });

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/stocks', {
                withCredentials: true
            });
            setStocks(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (type, stock = {}) => {
        setModalType(type);
        setCurrentStock({
            id: stock.id || '',
            store_id: stock.store_id || '',
            product_id: stock.product_id || '',
            slug: stock.slug || '',
            quantity: stock.quantity || '',
            minquantity: stock.minquantity || ''
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        setCurrentStock({ ...currentStock, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let response;
            if (modalType === 'add') {
                response = await axios.post('http://localhost:8000/api/stocks', currentStock, {
                    withCredentials: true
                });
            } else if (modalType === 'edit') {
                response = await axios.put(`http://localhost:8000/api/stocks/${currentStock.id}`, currentStock, {
                    withCredentials: true
                });
            }
            fetchStocks();
            handleCloseModal();
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/stocks/${id}`, {
                withCredentials: true
            });
            fetchStocks();
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Stocks CRUD</h1>
            <button onClick={() => handleOpenModal('add')}>Add Stock</button>
            <ul>
                {stocks.map(stock => (
                    <li key={stock.id}>
                        <h2>{stock.slug}</h2>
                        <p>Store ID: {stock.store_id}</p>
                        <p>Product ID: {stock.product_id}</p>
                        <p>Quantity: {stock.quantity}</p>
                        <p>Min Quantity: {stock.minquantity}</p>
                        <button onClick={() => handleOpenModal('edit', stock)}>Edit</button>
                        <button onClick={() => handleDelete(stock.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Stock Modal"
            >
                <h2>{modalType === 'add' ? 'Add Stock' : 'Edit Stock'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Store ID:
                        <input
                            type="text"
                            name="store_id"
                            value={currentStock.store_id}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Product ID:
                        <input
                            type="text"
                            name="product_id"
                            value={currentStock.product_id}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Slug:
                        <input
                            type="text"
                            name="slug"
                            value={currentStock.slug}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Quantity:
                        <input
                            type="number"
                            name="quantity"
                            value={currentStock.quantity}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Min Quantity:
                        <input
                            type="number"
                            name="minquantity"
                            value={currentStock.minquantity}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <button type="submit">Submit</button>
                </form>
                <button onClick={handleCloseModal}>Close</button>
            </Modal>
        </div>
    );
};

export default Stocks;

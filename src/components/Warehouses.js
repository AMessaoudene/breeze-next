import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const Warehouses = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [currentWarehouse, setCurrentWarehouse] = useState({
        id: '',
        name: '',
        surface: '',
        capacity: '',
        address: ''
    });

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/warehouses', {
                withCredentials: true
            });
            setWarehouses(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (type, warehouse = {}) => {
        setModalType(type);
        setCurrentWarehouse({
            id: warehouse.id || '',
            name: warehouse.name || '',
            surface: warehouse.surface || '',
            capacity: warehouse.capacity || '',
            address: warehouse.address || ''
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        setCurrentWarehouse({ ...currentWarehouse, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let response;
            if (modalType === 'add') {
                response = await axios.post('http://localhost:8000/api/warehouses', currentWarehouse, {
                    withCredentials: true
                });
            } else if (modalType === 'edit') {
                response = await axios.put(`http://localhost:8000/api/warehouses/${currentWarehouse.id}`, currentWarehouse, {
                    withCredentials: true
                });
            }
            fetchWarehouses();
            handleCloseModal();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/warehouses/${id}`, {
                withCredentials: true
            });
            fetchWarehouses();
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Warehouses CRUD</h1>
            <button onClick={() => handleOpenModal('add')}>Add Warehouse</button>
            <ul>
                {warehouses.map(warehouse => (
                    <li key={warehouse.id}>
                        <h2>{warehouse.name}</h2>
                        <p>Surface: {warehouse.surface}</p>
                        <p>Capacity: {warehouse.capacity}</p>
                        <p>Address: {warehouse.address}</p>
                        <button onClick={() => handleOpenModal('edit', warehouse)}>Edit</button>
                        <button onClick={() => handleDelete(warehouse.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Warehouse Modal"
            >
                <h2>{modalType === 'add' ? 'Add Warehouse' : 'Edit Warehouse'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={currentWarehouse.name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Surface:
                        <input
                            type="number"
                            name="surface"
                            value={currentWarehouse.surface}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Capacity:
                        <input
                            type="number"
                            name="capacity"
                            value={currentWarehouse.capacity}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Address:
                        <input
                            type="text"
                            name="address"
                            value={currentWarehouse.address}
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

export default Warehouses;

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const FastOrder = () => {
    const [articles, setArticles] = useState([]);
    const [orderlines, setOrderlines] = useState([{ article_id: '', quantity: 1 }]);
    const [orderData, setOrderData] = useState({
        customer_id: '',
        transaction_id: '',
        orderdatetime: '',
        total: 0,
        note: '',
    });

    useEffect(() => {
        // Fetch articles for selection
        axios.get('/api/articles')
            .then(response => {
                setArticles(response.data);
            })
            .catch(error => {
                console.error('Error fetching articles:', error);
            });
    }, []);

    const handleOrderLineChange = (index, field, value) => {
        const newOrderlines = [...orderlines];
        newOrderlines[index][field] = value;
        setOrderlines(newOrderlines);
    };

    const handleOrderDataChange = (field, value) => {
        setOrderData(prevState => ({ ...prevState, [field]: value }));
    };

    const addOrderLine = () => {
        setOrderlines([...orderlines, { article_id: '', quantity: 1 }]);
    };

    const handleSubmit = async () => {
        try {
            const finalData = { ...orderData, orderlines };
            await axios.post('/api/store-orders', finalData);
            alert('Order created successfully!');
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    return (
        <div>
            <h1>Create Store Order</h1>
            <div>
                <label>Customer ID:</label>
                <input
                    type="text"
                    value={orderData.customer_id}
                    onChange={(e) => handleOrderDataChange('customer_id', e.target.value)}
                />
            </div>
            <div>
                <label>Transaction ID:</label>
                <input
                    type="text"
                    value={orderData.transaction_id}
                    onChange={(e) => handleOrderDataChange('transaction_id', e.target.value)}
                />
            </div>
            <div>
                <label>Order Date/Time:</label>
                <input
                    type="datetime-local"
                    value={orderData.orderdatetime}
                    onChange={(e) => handleOrderDataChange('orderdatetime', e.target.value)}
                />
            </div>
            <div>
                <label>Total:</label>
                <input
                    type="number"
                    value={orderData.total}
                    onChange={(e) => handleOrderDataChange('total', e.target.value)}
                />
            </div>
            <div>
                <label>Note:</label>
                <textarea
                    value={orderData.note}
                    onChange={(e) => handleOrderDataChange('note', e.target.value)}
                />
            </div>

            <h2>Order Lines</h2>
            {orderlines.map((orderline, index) => (
                <div key={index}>
                    <select
                        value={orderline.article_id}
                        onChange={(e) => handleOrderLineChange(index, 'article_id', e.target.value)}
                    >
                        <option value="">Select Article</option>
                        {articles.map(article => (
                            <option key={article.id} value={article.id}>{article.name}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={orderline.quantity}
                        onChange={(e) => handleOrderLineChange(index, 'quantity', e.target.value)}
                    />
                </div>
            ))}
            <button onClick={addOrderLine}>Add Another Line</button>
            <button onClick={handleSubmit}>Submit Order</button>
        </div>
    );
};

export default FastOrder;

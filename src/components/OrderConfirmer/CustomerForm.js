'use client';

import { useState, useEffect } from 'react';
import {axios} from '@/lib/axios';
import useSWR from 'swr';

const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
    console.error('Error fetching data:', error);
    throw error;
});

export const CustomerForm = () => {
    const { data: customers, error: customersError, mutate } = useSWR('/api/customers', fetcher);
    const { data: cities, error: citiesError } = useSWR('/api/cities', fetcher);

    const [customer, setCustomer] = useState({
        name: '',
        middlename: '',
        surname: '',
        email: '',
        phone: '',
        address: '',
        city_id: '',
        store_id: '',
        status: true,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({
            ...customer,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/customers', customer);
            mutate();  // Refresh customer data
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const resetForm = () => {
        setCustomer({
            name: '',
            middlename: '',
            surname: '',
            email: '',
            phone: '',
            address: '',
            city_id: '',
            store_id: '',
            status: true,
        });
    };

    useEffect(() => {
        console.log('Customers:', customers);
    }, [customers]);

    if (customersError) return <div>Failed to load customers: {customersError.message}</div>;
    if (citiesError) return <div>Failed to load cities: {citiesError.message}</div>;
    if (!customers || !cities) return <div>Loading...</div>;

    return (
        <div>
            <h1>Customer Form</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={customer.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Middle Name</label>
                    <input
                        type="text"
                        name="middlename"
                        value={customer.middlename}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Surname</label>
                    <input
                        type="text"
                        name="surname"
                        value={customer.surname}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={customer.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={customer.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Address</label>
                    <input
                        type="text"
                        name="address"
                        value={customer.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>City</label>
                    <select
                        name="city_id"
                        value={customer.city_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a city</option>
                        {cities.map(city => (
                            <option key={city.id} value={city.id}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Store ID</label>
                    <input
                        type="text"
                        name="store_id"
                        value={customer.store_id}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CustomerForm;

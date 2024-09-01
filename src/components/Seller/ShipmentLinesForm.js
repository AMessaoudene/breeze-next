'use client';

import { useState, useEffect } from 'react';
import { axios } from '@/lib/axios';
import useSWR from 'swr';
import Label from '@/components/Label';
import Input from '@/components/Input';

const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
    console.error('Error fetching data:', error);
    throw error;
});

export const ShipmentLinesForm = () => {
    const { data: stores, error: storesError } = useSWR('/api/getstores', fetcher);
    const { data: shipmentCompanies, error: shipmentCompaniesError } = useSWR('/api/shipmentcompanies', fetcher);

    const [shipmentLine, setShipmentLine] = useState({
        shipmentcompany_id: '',
        store_id: '',
        shipmentID: '',
        tokenid: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShipmentLine({
            ...shipmentLine,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/shipmentlines', shipmentLine);
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const resetForm = () => {
        setShipmentLine({
            shipmentcompany_id: '',
            store_id: '',
            shipmentID: '',
            tokenid: '',
        });
    };

    useEffect(() => {
        console.log('Stores:', stores);
        console.log('Shipment Companies:', shipmentCompanies);
    }, [stores, shipmentCompanies]);

    if (storesError || shipmentCompaniesError) return <div>Failed to load data: {storesError?.message || shipmentCompaniesError?.message}</div>;
    if (!stores || !shipmentCompanies) return <div>Loading...</div>;

    return (
        <div>
            <h1>Create Shipment Line</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <Label>Store</Label>
                    <select
                        name="store_id"
                        value={shipmentLine.store_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a Store</option>
                        {stores.map((store) => (
                            <option key={store.id} value={store.id}>
                                {store.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <Label>Shipment Company</Label>
                    <select
                        name="shipmentcompany_id"
                        value={shipmentLine.shipmentcompany_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a Shipment Company</option>
                        {shipmentCompanies.map((company) => (
                            <option key={company.id} value={company.id}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <Label>Shipment ID</Label>
                    <Input
                        type="text"
                        name="shipmentID"
                        value={shipmentLine.shipmentID}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <Label>Token ID</Label>
                    <Input
                        type="text"
                        name="tokenid"
                        value={shipmentLine.tokenid}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ShipmentLinesForm;

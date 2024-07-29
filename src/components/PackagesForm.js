'use client'

import { useState, useEffect } from "react";
import {axios} from '@/lib/axios'
import useSWR from 'swr';

const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
    console.error('Error fetching data:', error);
    throw error;
});

export const PackagesForm = () => {
    const { data: packages, error: packagesError, mutate } = useSWR('/api/packages', fetcher);
    const { data: productsData, error: productsError } = useSWR('/api/getproducts', fetcher);
    const { data: measuresData, error: measuresError } = useSWR('/api/measures', fetcher);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [measureId, setMeasureId] = useState('');
    const [unit, setUnit] = useState('');
    const [packageLines, setPackageLines] = useState([{ product_id: '', quantity: 1 }]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newPackage = {
                name,
                description,
                price,
                unit,
                measure_id: measureId,
                package_lines: packageLines
            };
            await axios.post('/api/packages', newPackage);
            mutate();
            setName('');
            setDescription('');
            setPrice('');
            setMeasureId('');
            setUnit('');
            setPackageLines([{ product_id: '', quantity: 1 }]);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handlePackageLineChange = (index, field, value) => {
        const newPackageLines = [...packageLines];
        newPackageLines[index][field] = value;
        setPackageLines(newPackageLines);
    };

    const handleAddPackageLine = () => {
        setPackageLines([...packageLines, { product_id: '', quantity: 1 }]);
    };

    const handleRemovePackageLine = (index) => {
        const newPackageLines = packageLines.filter((_, i) => i !== index);
        setPackageLines(newPackageLines);
    };

    useEffect(() => {
        console.log('Packages:', packages);
        console.log('Products:', productsData);
        console.log('Measures:', measuresData);
    }, [packages, productsData, measuresData]);

    if (packagesError) return <div>Failed to load packages: {packagesError.message}</div>;
    if (productsError) return <div>Failed to load products: {productsError.message}</div>;
    if (measuresError) return <div>Failed to load measures: {measuresError.message}</div>;

    const products = Array.isArray(productsData) ? productsData : [];
    const measures = Array.isArray(measuresData) ? measuresData : [];

    const getAvailableProducts = (currentIndex) => {
        const selectedProductIds = packageLines
            .map(line => line.product_id)
            .filter(id => id); // filter out empty strings
        return products.filter(product => {
            return !selectedProductIds.includes(product.id.toString()) || packageLines[currentIndex].product_id === product.id.toString();
        });
    };

    if (!packages || !Array.isArray(products) || !Array.isArray(measures)) return <div>Loading...</div>;

    return (
        <div>
            <h1>Packages CRUD</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                    />
                </div>
                <div>
                    <label>Measure</label>
                    <input
                        type="number"
                        value={unit}
                        onChange={e => setUnit(e.target.value)}
                    />
                    <select
                        value={measureId}
                        onChange={e => setMeasureId(e.target.value)}
                    >
                        <option value="">Select Unit</option>
                        {measures.map(measure => (
                            <option key={measure.id} value={measure.id}>{measure.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <h2>Package Lines</h2>
                    {packageLines.map((line, index) => (
                        <div key={index}>
                            <select
                                value={line.product_id}
                                onChange={e => handlePackageLineChange(index, 'product_id', e.target.value)}
                            >
                                <option value="">Select Product</option>
                                {getAvailableProducts(index).map(product => (
                                    <option key={product.id} value={product.id}>{product.name}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={line.quantity}
                                onChange={e => handlePackageLineChange(index, 'quantity', e.target.value)}
                            />
                            <button type="button" onClick={() => handleRemovePackageLine(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddPackageLine}>Add Package Line</button>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default PackagesForm;

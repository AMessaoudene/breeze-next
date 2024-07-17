'use client'

import axios from '@/lib/axios';
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = url => 
    axios
        .get(url)
        .then(res => res.data)
        .catch(error => {
            if (error.response.status !== 409) throw error;
        });

export const DisplayProducts = () => {
    const { data: products, error } = useSWR('/api/products', fetcher);

    if (error) return <div>Failed to load</div>;
    if (!products) return <div>Loading...</div>;

    return (
        <div>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        <Link href={`/products/${product.id}`}>
                            {product.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

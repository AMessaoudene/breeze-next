'use client'

import { useState, useEffect } from "react";
import { axios } from '@/lib/axios'
import useSWR from 'swr';

const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
    console.error('Error fetching data:', error);
    throw error;
});

export const PackageRatingsForm = () => {
    const { data: packagesData, error: packagesError } = useSWR('/api/getpackages', fetcher);
    const { mutate } = useSWR('/api/packageratings', fetcher);

    const [packageId, setPackageId] = useState('');
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newRating = {
                package_id: packageId,
                rating,
                comment,
            };
            await axios.post('/api/packageratings', newRating);
            mutate();
            setPackageId('');
            setRating('');
            setComment('');
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    useEffect(() => {
        console.log('Packages:', packagesData);
    }, [packagesData]);

    if (packagesError) return <div>Failed to load packages: {packagesError.message}</div>;
    if (!packagesData) return <div>Loading packages...</div>;

    return (
        <div>
            <h1>Package Ratings Form</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Package</label>
                    <select
                        value={packageId}
                        onChange={e => setPackageId(e.target.value)}
                        required
                    >
                        <option value="">Select a package</option>
                        {packagesData.map(pkg => (
                            <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Rating</label>
                    <input
                        type="number"
                        value={rating}
                        onChange={e => setRating(e.target.value)}
                        placeholder="Rating"
                        required
                    />
                </div>
                <div>
                    <label>Comment</label>
                    <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Comment"
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default PackageRatingsForm;

'use client'

import { useState, useEffect } from "react";
import { axios } from '@/lib/axios'
import useSWR from 'swr';

const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
    console.error('Error fetching data:', error);
    throw error;
});

export const PackageReportsForm = () => {
    const { data: packagesData, error: packagesError } = useSWR('/api/getpackages', fetcher);
    const { mutate } = useSWR('/api/packagereports', fetcher);

    const [packageId, setPackageId] = useState('');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [proof, setProof] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newReport = {
                package_id: packageId,
                subject,
                description,
                proof,
            };
            await axios.post('/api/packagereports', newReport);
            mutate();
            setPackageId('');
            setSubject('');
            setDescription('');
            setProof('');
        } catch (error) {
            console.error('Error submitting report:', error);
        }
    };

    useEffect(() => {
        console.log('Packages:', packagesData);
    }, [packagesData]);

    if (packagesError) return <div>Failed to load packages: {packagesError.message}</div>;
    if (!packagesData) return <div>Loading packages...</div>;

    return (
        <div>
            <h1>Package Reports Form</h1>
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
                    <label>Subject</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        placeholder="Subject"
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Description"
                    />
                </div>
                <div>
                    <label>Proof</label>
                    <input
                        type="text"
                        value={proof}
                        onChange={e => setProof(e.target.value)}
                        placeholder="Proof"
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default PackageReportsForm;

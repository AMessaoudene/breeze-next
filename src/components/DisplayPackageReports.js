'use client';

import { useState } from 'react';
import { axios } from '@/lib/axios';
import useSWR from 'swr';
import Link from 'next/link';
import Modal from './Modal';

const fetcher = url =>
    axios.get(url).then(res => res.data).catch(error => {
        if (error.response.status !== 409) throw error;
    });

export const DisplayPackageReports = () => {
    const { data, error, mutate } = useSWR('/api/packagereports', fetcher);

    const deletePackageReport = async (reportId) => {
        try {
            await axios.delete(`/api/packagereports/${reportId}`);
            mutate();
        } catch (error) {
            console.error('Error deleting package report:', error);
        }
    };

    if (error) return <div>Failed to load package reports</div>;
    if (!data) return <div>Loading package reports...</div>;

    return (
        <div>
            <h2 className="text-2xl mb-4">Package Reports</h2>
            <ul>
                {data.map(report => (
                    <li key={report.id} className="border rounded-lg p-4 shadow-md bg-white mb-4">
                        <h3 className="text-xl font-bold">{report.subject}</h3>
                        <p>{report.description}</p>
                        <button onClick={() => deletePackageReport(report.id)} className="text-red-500 hover:text-red-700 ml-2">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

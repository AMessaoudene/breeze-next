'use client';

import { useState } from 'react';
import { DisplayPackages } from './DisplayPackages'; // Import the DisplayPackages component
import { DisplayProducts } from './DisplayProducts'; // Import the DisplayProducts component

export default function Home() {
    const [selectedView, setSelectedView] = useState('products'); // Set products as default

    return (
        <div>
            <div className="flex justify-center space-x-4 mb-6">
                <button
                    onClick={() => setSelectedView('products')}
                    className={`px-4 py-2 ${selectedView === 'products' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded`}
                >
                    Products
                </button>
                <button
                    onClick={() => setSelectedView('packages')}
                    className={`px-4 py-2 ${selectedView === 'packages' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded`}
                >
                    Packages
                </button>
            </div>

            <div>
                {selectedView === 'products' && <DisplayProducts />} {/* Display Products by default */}
                {selectedView === 'packages' && <DisplayPackages />}
            </div>
        </div>
    );
}

'use client';

import Header from '@/app/(app)/Header';
import { Notifications } from '@/components/Notifications';

const AboutUsPage = () => {
    return (
        <>
            <Header title="Profile Page" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <Notifications />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutUsPage;

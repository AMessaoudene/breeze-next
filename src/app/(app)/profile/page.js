'use client';

import Header from '@/app/(app)/Header';
import UserComponent from '@/components/UserComponent';
import  Profile from '@/components/Profile';
import { DisplayAccounts } from '@/components/DisplayAccounts';
import { ContactsForm } from '@/components/ContactsForm';
import { DisplayContactsForm } from '@/components/DisplayContactsForm';
import { DisplayRoles } from '@/components/DisplayRoles';
import PaymentMethodsForm from '@/components/PaymentMethodsForm';
import { Notifications } from '@/components/Notifications';

const ProfilePage = () => {
    return (
        <>
            <Header title="Profile Page" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <Notifications />
                            <UserComponent />
                            <Profile />
                            <DisplayAccounts />
                            <ContactsForm />
                            <DisplayContactsForm />
                            <DisplayRoles />
                            <PaymentMethodsForm />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;

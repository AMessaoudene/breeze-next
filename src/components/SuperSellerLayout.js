'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth'

const SuperSellerLayout = ({ children }) => {
    const router = useRouter()
    const { logout } = useAuth({ middleware: 'auth' })

    const handleLogout = async (e) => {
        e.preventDefault()
        await logout()
        router.push('/login')
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-100 dark:text-black-200 leading-tight">
                        Super Seller Dashboard
                    </h2>
                    <div className="flex space-x-4">
                        <Link href="/super-seller/profile" className="text-gray-700 dark:text-gray-300">
                            <i className="fas fa-user"></i>
                        </Link>
                        <Link href="/super-seller/notifications" className="text-gray-700 dark:text-gray-300">
                            <i className="fas fa-bell"></i>
                        </Link>
                        <Link href="/super-seller/messages" className="text-gray-700 dark:text-gray-300">
                            <i className="fas fa-envelope"></i>
                        </Link>
                        <button 
                            onClick={handleLogout} 
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                <aside className="w-64 bg-gray-200 dark:bg-gray-900 shadow-md min-h-screen">
                    <div className="p-6">
                        <nav className="space-y-4">
                            <Link href="/super-seller-dashboard" className="block text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded-md">
                                Dashboard
                            </Link>
                            <Link href="/" className="block text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded-md">
                                Profile
                            </Link>
                            <Link href="/stores" className="block text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded-md">
                                Stores
                            </Link>
                        </nav>
                    </div>
                </aside>

                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>

            <footer className="bg-white dark:bg-gray-800 shadow mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} Your App Name. All rights reserved.
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Address: 123 Main Street, Anytown, USA
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Phone: (123) 456-7890 | Email: info@example.com
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default SuperSellerLayout

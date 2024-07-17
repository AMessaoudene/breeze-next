'use client'

import { useAuth } from '@/hooks/auth'
import { Children } from 'react'

const UserComponent = () => {

    const { user } = useAuth({ middleware: 'auth' })

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="mt-4 text-xl font-semibold text-center text-gray-800">
                {user?.name}
            </div>
            <div className="mt-4 text-xl font-semibold text-center text-gray-800">
                {user?.email}
            </div>
        </div>
    )
}

export default UserComponent
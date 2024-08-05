'use client';

import { useAuth } from '@/hooks/auth'
import SuperSellerLayout from '@/components/SuperSellerLayout'
import Products from '@/components/Products'
import Warehouses from '@/components/Warehouses';
import Stocks from '@/components/Stocks';
const SuperSellerDashboard = () => {
    const { user, token } = useAuth({ middleware: 'auth' })

    return (
        <SuperSellerLayout>
            <div>
                <h1>Welcome to the Super Seller Dashboard</h1>
            </div>

            <br></br>
            
            <div>
                <Products />
            </div>

            <br></br>
            
            <div>
                <Warehouses />
            </div>

            <br></br>

            <div>
                <Stocks/>
            </div>

        </SuperSellerLayout>
    )
}

export default SuperSellerDashboard

import Header from '@/app/(app)/Header'
import UserComponent from '@/components/UserComponent'
import { DisplayProducts } from '@/components/DisplayProducts'
import { DisplayOffers } from '@/components/DisplayOffers'
import { OffersForm } from '@/components/OffersForm'
import { OfferLinesForm } from '@/components/OfferLinesForm'
import { DisplayOfferLines } from '@/components/DisplayOfferLines'
import { OfferLinesStatusesForm } from '@/components/OfferLinesStatusesForm'

export const metadata = {
    title: 'Dashboard',
}

const Dashboard = () => {
    return (
        <>
            <Header title="Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <DisplayProducts/>
                            <UserComponent/>
                            <DisplayOffers/>
                            <OffersForm/>
                            <DisplayOfferLines/>
                            <OfferLinesForm/>
                            <OfferLinesStatusesForm/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
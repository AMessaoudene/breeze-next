import Header from '@/app/(app)/Header'
import UserComponent from '@/components/UserComponent'
import { DisplayProducts } from '@/components/DisplayProducts'
import { DisplayOffers } from '@/components/DisplayOffers'
import { OffersForm } from '@/components/OffersForm'
import { OfferLinesForm } from '@/components/OfferLinesForm'
import { DisplayOfferLines } from '@/components/DisplayOfferLines'
import { OfferLinesStatusesForm } from '@/components/OfferLinesStatusesForm'
import { DisplayOfferLinesStatuses } from '@/components/DisplayOfferLinesStatuses'
import { StoreCategoriesForm } from '@/components/StoreCategoriesForm'
import { DisplayAccounts } from '@/components/DisplayAccounts'
import { ContactsForm } from '@/components/ContactsForm'
import { DisplayContactsForm } from '@/components/DisplayContactsForm'
import { ProductsForm } from '@/components/ProductsForm'
import { PackagesForm } from '@/components/PackagesForm'
import { DisplayPackages } from '@/components/DisplayPackages'
import { MeasuresForm } from '@/components/MeasuresForm'
import { PackageRatingsForm } from '@/components/PackageRatingsForm'
import PackageReportsForm from '@/components/PackageReportsForm'
import { DisplayPackageReports } from '@/components/DisplayPackageReports'
import SocialMediasForm from '@/components/SocialMediasForm'
import { DisplayStores } from '@/components/DisplayStores'
import { DisplayRoles } from '@/components/DisplayRoles'
import PaymentMethodsForm from '@/components/PaymentMethodsForm'
import RolesForm from '@/components/RolesForm'
import { Notifications } from '@/components/Notifications'
import Profile from '@/components/Profile'

export const metadata = {
    title: 'Dashboard',
    description: 'Dashboard',
    keywords: 'Dashboard',
}

const Dashboard = () => {
    return (
        <>
            <Header title="Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <Notifications/>
                            <UserComponent/>
                            <DisplayOffers/>
                            <OffersForm/>
                            <DisplayOfferLines/>
                            <OfferLinesForm/>
                            <OfferLinesStatusesForm/>
                            <DisplayOfferLinesStatuses/>
                            <StoreCategoriesForm/>
                            <DisplayAccounts/>
                            <ContactsForm/>
                            <DisplayContactsForm/>
                            <ProductsForm/>
                            <PackagesForm/>
                            <DisplayPackages/>
                            <MeasuresForm/>
                            <PackageRatingsForm/>
                            <PackageReportsForm/>
                            <SocialMediasForm/>
                            <DisplayStores/>
                            <RolesForm/>
                            <DisplayRoles/>
                            <PaymentMethodsForm/>
                            <Profile/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
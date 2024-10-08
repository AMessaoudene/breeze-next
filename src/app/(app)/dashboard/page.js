import Header from '@/app/(app)/Header'
import UserComponent from '@/components/UserComponent'
import { DisplayOffers } from '@/components/DisplayOffers'
import { OffersForm } from '@/components/OffersForm'
import { OfferLinesForm } from '@/components/OfferLinesForm'
import { DisplayOfferLines } from '@/components/DisplayOfferLines'
import { OfferLinesStatusesForm } from '@/components/OfferLinesStatusesForm'
import { DisplayOfferLinesStatuses } from '@/components/DisplayOfferLinesStatuses'
import { DisplayAccounts } from '@/components/DisplayAccounts'
import { ContactsForm } from '@/components/ContactsForm'
import { DisplayContactsForm } from '@/components/DisplayContactsForm'
import { DisplayStores } from '@/components/SuperSeller/DisplayStores'
import { DisplayRoles } from '@/components/DisplayRoles'
import PaymentMethodsForm from '@/components/PaymentMethodsForm'
import RolesForm from '@/components/RolesForm'
import { Notifications } from '@/components/Notifications'
import Profile from '@/components/Profile'
import ManageAccounts from '@/components/SuperSeller/ManageAccounts'
import MembershipInvitations from '@/components/SuperSeller/MembersInvitations'
import ArticlesForm from '@/components/Seller/ArticlesForm'
import ArticleCategoriesForm from '@/components/Admin/ArticleCategoriesForm'
import StoreForm from '@/components/SuperSeller/StoreForm'
import DiscountForm from '@/components/Seller/DiscountsForm'
import { DisplayDiscounts } from '@/components/DisplayDiscounts'
import FastOrder from '@/components/OrderConfirmer/FastOrder'
import ShipmentLinesForm from '@/components/Seller/ShipmentLinesForm'
import { DisplayShipmentLines } from '@/components/Seller/DisplayShipmentLines'
import { ShipmentTypesForm } from '@/components/Admin/ShipmentTypesForm'
import { DisplayShipmentTypes } from '@/components/Admin/DisplayShipmentTypes'
import { ShipmentPricingForm } from '@/components/Seller/ShipmentPricingForm'
import { DisplayShipmentPricings } from '@/components/Seller/DisplayShipmentPricings'
import { BlogPostForm } from '@/components/Seller/BlogPostForm'

export const metadata = {
    title: 'Dashboard',
    description: 'Dashboard',
    keywords: 'Dashboard',
    author: 'Abdou',
    creator: 'Abdou',
    publisher: 'Abdou',
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
                            <DisplayAccounts/>
                            <ContactsForm/>
                            <DisplayContactsForm/>
                            <DisplayStores/>
                            <RolesForm/>
                            <DisplayRoles/>
                            <PaymentMethodsForm/>
                            <Profile/>
                            <ManageAccounts/>
                            <MembershipInvitations/>
                            <ArticlesForm/>
                            <ArticleCategoriesForm/>
                            <StoreForm/>
                            <DiscountForm/>
                            <DisplayDiscounts/>
                            <FastOrder/>
                            <ShipmentLinesForm/>
                            <DisplayShipmentLines/>
                            <ShipmentTypesForm/>
                            <DisplayShipmentTypes/>
                            <ShipmentPricingForm/>
                            <DisplayShipmentPricings/>
                            <BlogPostForm/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
'use client'

import { useState } from 'react'
import { axios } from '@/lib/axios'
import useSWR from 'swr'
import Label from './Label'
import Input from './Input'
import Button from './Button'
import Select from './Select'

const fetcher = url =>
    axios.get(url).then(res => res.data).catch(error => {
        if (error.response.status !== 409) throw error;
    });

export const OfferPricingsForm = () => {

    const { data: offerPricings, error, mutate } = useSWR('/api/offerpricings', fetcher)
    const { data: offers } = useSWR('/api/offers', fetcher)
    const { data: offerTimeTypes } = useSWR('/api/offertimetypes', fetcher)

    const [offerId, setOfferId] = useState('')
    const [offerTimeTypeId, setOfferTimeTypeId] = useState('')
    const [price, setPrice] = useState('')

    if (error) return <div>Failed to load</div>
    if (!offerPricings || !offers || !offerTimeTypes) return <div>Loading...</div>

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const newOfferPricing = {
                offer_id: offerId,
                offertimetype_id: offerTimeTypeId,
                price,
            }
            await axios.post('/api/offerpricings', newOfferPricing)
            setOfferId('')
            setOfferTimeTypeId('')
            setPrice('')
            mutate()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <Label
                    htmlFor="offer"
                    value="Offer"
                />
                <Select
                    id="offer"
                    value={offerId}
                    onChange={(e) => setOfferId(e.target.value)}
                    required
                >
                    <option value="">Select Offer</option>
                    {offers.map((offer) => (
                        <option key={offer.id} value={offer.id}>
                            {offer.name}
                        </option>
                    ))}
                </Select>
            </div>

            <div className="flex flex-col gap-1">
                <Label
                    htmlFor="offerTimeType"
                    value="Offer Time Type"
                />
                <Select
                    id="offerTimeType"
                    value={offerTimeTypeId}
                    onChange={(e) => setOfferTimeTypeId(e.target.value)}
                    required
                >
                    <option value="">Select Offer Time Type</option>
                    {offerTimeTypes.map((timeType) => (
                        <option key={timeType.id} value={timeType.id}>
                            {timeType.name}
                        </option>
                    ))}
                </Select>
            </div>

            <div className="flex flex-col gap-1">
                <Label
                    htmlFor="price"
                    value="Price"
                />
                <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </div>

            <Button
                type="submit"
            >
                Save
            </Button>
        </form>
    )
}

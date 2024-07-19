'use client'

import { useState } from 'react'
import axios from '@/lib/axios'
import useSWR from 'swr'

const fetcher = url =>
    axios.get(url).then(res => res.data).catch(error => {
        if (error.response.status !== 409) throw error;
    });

export const ProductsForm = () => {

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const [media, setMedia] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const newProduct = {
                name,
                price,
                description,
                media
            }
            await axios.post('/api/products', newProduct)
            setName('')
            setPrice(0)
            setDescription('')
            setMedia('')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <h1>Products CRUD</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Media</label>
                    <input
                        type="file"
                        value={media}
                        onChange={e => setMedia(e.target.value)}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
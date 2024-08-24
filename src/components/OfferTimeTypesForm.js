'use client'

import { useState } from 'react'
import { axios } from '@/lib/axios'
import useSWR from 'swr'
import Label from './Label'
import Input from './Input'
import Button from './Button'

const fetcher = url =>
    axios.get(url).then(res => res.data).catch(error => {
        if (error.response.status !== 409) throw error;
    });

export const OffertimeTypeForm = () => {

    const { data: offertimeTypes, error, mutate } = useSWR('/api/offertimetypes', fetcher)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    if (error) return <div>Failed to load</div>
    if (!offertimeTypes) return <div>Loading...</div>

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const newOffertimeType = {
                name,
                description,
            }
            await axios.post('/api/offertimetypes', newOffertimeType)
            setName('')
            setDescription('')
            mutate()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <Label
                    htmlFor="name"
                    value="Name"
                />
                <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div className="flex flex-col gap-1">
                <Label
                    htmlFor="description"
                    value="Description"
                />
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-textarea"
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

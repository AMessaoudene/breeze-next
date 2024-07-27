'use client'

import { useState } from 'react'
import {axios} from '@/lib/axios'
import useSWR from 'swr'
import Label from './Label'
import Input from './Input'
import Button from './Button'

const fetcher = url =>
    axios.get(url).then(res => res.data).catch(error => {
        if (error.response.status !== 409) throw error;
    });

export const ContactsForm = () => {

    const { data: contacts, error, mutate } = useSWR('/api/contactsform', fetcher)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')

    if (error) return <div>Failed to load</div>
    if (!contacts) return <div>Loading...</div>

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const newContact = {
                name,
                email,
                subject,
                message
            }
            await axios.post('/api/contactsform', newContact)
            setName('')
            setEmail('')
            setSubject('')
            setMessage('')
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
                    htmlFor="email"
                    value="Email"
                />
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="flex flex-col gap-1">
                <Label
                    htmlFor="subject"
                    value="Subject"
                />
                <Input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                />
            </div>

            <div className="flex flex-col gap-1">
                <Label
                    htmlFor="message"
                    value="Message"
                />
                <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
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

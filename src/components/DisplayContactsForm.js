'use client'

import { useState } from 'react'
import {axios} from '@/lib/axios'
import useSWR from 'swr'
import Link from 'next/link'

const fetcher = url =>
    axios.get(url).then(res => res.data).catch(error => {
        if (error.response.status !== 409) throw error;
    });

export const DisplayContactsForm = () => {
    const { data, error, mutate } = useSWR('/api/contactsform', fetcher)
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const deleteContactForm = async (id) => {
        try {
            await axios.delete(`/api/contactsform/${id}`)
            mutate() // Refresh the data after deletion
        } catch (error) {
            console.error('Failed to delete contact form', error)
        }
    }

    if (error) return <div>Failed to load</div>

    if (!data) return <div>Loading...</div>

    return (
        <div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">Subject</th>
                        <th className="py-2">Name</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(contactForm => (
                        <tr key={contactForm.id}>
                            <td className="border px-4 py-2">{contactForm.subject}</td>
                            <td className="border px-4 py-2">{contactForm.name}</td>
                            <td className="border px-4 py-2">{contactForm.email}</td>
                            <td className="border px-4 py-2">
                                <button
                                    className="text-blue-500 hover:text-blue-700"
                                    onClick={() => {
                                        setSelectedMessage(contactForm.message)
                                        setShowModal(true)
                                    }}
                                >
                                    View Message
                                </button>
                                <button
                                    className="text-red-500 hover:text-red-700 ml-4"
                                    onClick={() => deleteContactForm(contactForm.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Message</h2>
                        <p>{selectedMessage}</p>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                            onClick={() => setShowModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

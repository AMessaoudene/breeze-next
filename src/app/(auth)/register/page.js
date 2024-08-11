'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'

const Page = () => {
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [middlename, setMiddlename] = useState('')
    const [surname, setSurname] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [errors, setErrors] = useState({})

    const submitForm = event => {
        event.preventDefault()

        register({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            middlename,
            surname,
            phone,
            address,
            city,
            state,
            country,
            postal_code: postalCode,
            setErrors,
        })
    }

    return (
        <form onSubmit={submitForm}>
            {/* Name */}
            <div>
                <Label htmlFor="name">Name*</Label>
                <Input
                    id="name"
                    type="text"
                    value={name}
                    className="block mt-1 w-full"
                    onChange={event => setName(event.target.value)}
                    required
                    autoFocus
                />
                <InputError messages={errors.name || []} className="mt-2" />
            </div>

            {/* Middlename */}
            <div className="mt-4">
                <Label htmlFor="middlename">Middlename</Label>
                <Input
                    id="middlename"
                    type="text"
                    value={middlename}
                    className="block mt-1 w-full"
                    onChange={event => setMiddlename(event.target.value)}
                />
                <InputError
                    messages={errors.middlename || []}
                    className="mt-2"
                />
            </div>

            {/* Surname */}
            <div className="mt-4">
                <Label htmlFor="surname">Surname*</Label>
                <Input
                    id="surname"
                    type="text"
                    value={surname}
                    className="block mt-1 w-full"
                    onChange={event => setSurname(event.target.value)}
                    required
                />
                <InputError messages={errors.surname || []} className="mt-2" />
            </div>

            {/* Phone */}
            <div className="mt-4">
                <Label htmlFor="phone">Phone</Label>
                <Input
                    id="phone"
                    type="text"
                    value={phone}
                    className="block mt-1 w-full"
                    onChange={event => setPhone(event.target.value)}
                />
                <InputError messages={errors.phone || []} className="mt-2" />
            </div>

            {/* Address */}
            <div className="mt-4">
                <Label htmlFor="address">Address</Label>
                <Input
                    id="address"
                    type="text"
                    value={address}
                    className="block mt-1 w-full"
                    onChange={event => setAddress(event.target.value)}
                />
                <InputError messages={errors.address || []} className="mt-2" />
            </div>

            {/* Country */}
            <div className="mt-4">
                <Label htmlFor="country">Country*</Label>
                <Input
                    id="country"
                    type="text"
                    value={country}
                    className="block mt-1 w-full"
                    onChange={event => setCountry(event.target.value)}
                    required
                />
                <InputError messages={errors.country || []} className="mt-2" />
            </div>

            {/* State */}
            <div className="mt-4">
                <Label htmlFor="state">State*</Label>
                <Input
                    id="state"
                    type="text"
                    value={state}
                    className="block mt-1 w-full"
                    onChange={event => setState(event.target.value)}
                    required
                />
                <InputError messages={errors.state || []} className="mt-2" />
            </div>

            {/* City */}
            <div className="mt-4">
                <Label htmlFor="city">City*</Label>
                <Input
                    id="city"
                    type="text"
                    value={city}
                    className="block mt-1 w-full"
                    onChange={event => setCity(event.target.value)}
                    required
                />
                <InputError messages={errors.city || []} className="mt-2" />
            </div>

            {/* Postal Code */}
            <div className="mt-4">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                    id="postalCode"
                    type="text"
                    value={postalCode}
                    className="block mt-1 w-full"
                    onChange={event => setPostalCode(event.target.value)}
                />
                <InputError
                    messages={errors.postal_code || []}
                    className="mt-2"
                />
            </div>

            {/* Email */}
            <div className="mt-4">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    className="block mt-1 w-full"
                    onChange={event => setEmail(event.target.value)}
                    required
                />
                <InputError messages={errors.email || []} className="mt-2" />
            </div>

            {/* Password */}
            <div className="mt-4">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    className="block mt-1 w-full"
                    onChange={event => setPassword(event.target.value)}
                    required
                    autoComplete="new-password"
                />
                <InputError messages={errors.password || []} className="mt-2" />
            </div>

            {/* Confirm Password */}
            <div className="mt-4">
                <Label htmlFor="passwordConfirmation">Confirm Password</Label>
                <Input
                    id="passwordConfirmation"
                    type="password"
                    value={passwordConfirmation}
                    className="block mt-1 w-full"
                    onChange={event =>
                        setPasswordConfirmation(event.target.value)
                    }
                    required
                />
                <InputError
                    messages={errors.password_confirmation || []}
                    className="mt-2"
                />
            </div>

            <div className="flex items-center justify-end mt-4">
                <Link
                    href="/login"
                    className="underline text-sm text-gray-600 hover:text-gray-900">
                    Already registered?
                </Link>
                <Button className="ml-4">Register</Button>
            </div>
        </form>
    )
}

export default Page

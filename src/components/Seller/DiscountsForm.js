'use client';

import { useState, useEffect } from 'react';
import { axios } from '@/lib/axios';
import useSWR from 'swr';
import Label from '@/components/Label';
import Input from '@/components/Input'


const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
    console.error('Error fetching data:', error);
    throw error;
});

export const DiscountForm = () => {
    const { data: discounts, error: discountsError, mutate } = useSWR('/api/discounts', fetcher);

    const [discount, setDiscount] = useState({
        code: '',
        amount: '',
        percentage: '',
        usecounter: '',
        start_date: '',
        end_date: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDiscount({
            ...discount,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/discounts', discount);
            mutate(); // Refresh the list after creation
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const resetForm = () => {
        setDiscount({
            code: '',
            amount: '',
            percentage: '',
            usecounter: '',
            start_date: '',
            end_date: '',
        });
    };

    useEffect(() => {
        console.log('Discounts:', discounts);
    }, [discounts]);

    if (discountsError) return <div>Failed to load discounts: {discountsError.message}</div>;
    if (!discounts) return <div>Loading...</div>;

    return (
        <div>
            <h1>Create Discount</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <Label>Code</Label>
                    <Input
                        type="text"
                        name="code"
                        value={discount.code}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <Label>Amount</Label>
                    <Input
                        type="number"
                        name="amount"
                        value={discount.amount}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label>Percentage</Label>
                    <Input
                        type="number"
                        name="percentage"
                        value={discount.percentage}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label>Use Counter</Label>
                    <Input
                        type="number"
                        name="usecounter"
                        value={discount.usecounter}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label>Start Date</Label>
                    <Input
                        type="date"
                        name="startdate"
                        value={discount.start_date}
                        onChange={handleChange}  
                    />
                </div>
                <div>
                    <Label>End Date</Label>
                    <Input
                        type="date"
                        name="enddate"
                        value={discount.end_date}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default DiscountForm;

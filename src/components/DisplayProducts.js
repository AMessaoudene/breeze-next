import axios from '@/lib/axios'
import useSWR from 'swr'
import { useRouter } from 'next/router'

const fetcher = url => axios.get(url).then(res => res.data)

export default function DisplayProducts() {
    const router = useRouter()
    const { data: products, error } = useSWR('/api/products', fetcher)

    if (error) {
        if (error.response && error.response.status === 409) {
            router.push('/verify-email')
        } else {
            return <div>Failed to load products</div>
        }
    }

    if (!products) return <div>Loading...</div>

    return (
        <div>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>{product.name}</li>
                ))}
            </ul>
        </div>
    )
}

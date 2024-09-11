import LoginLinks from '@/app/LoginLinks'

export const metadata = {
    title: 'Laravel',
}

const Home = () => {
    return (
        <>
            <div className="relative flex items-top justify-center min-h-screen bg-white sm:items-center sm:pt-0">
                <LoginLinks />
            </div>
        </>
    )
}

export default Home

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const AllPackages = () => {
    const [packages, setPackages] = useState([])
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')

    const getPackages = async () => {
        setPackages([])
        try {
            setLoading(true)
            let url =
                filter === 'offer' //offer
                    ? `/api/package/get-packages?searchTerm=${search}&offer=true`
                    : filter === 'latest' //latest
                      ? `/api/package/get-packages?searchTerm=${search}&sort=createdAt`
                      : filter === 'top' //top rated
                        ? `/api/package/get-packages?searchTerm=${search}&sort=packageRating`
                        : `/api/package/get-packages?searchTerm=${search}` //all
            const res = await fetch(url)
            const data = await res.json()
            if (data?.success) {
                setPackages(data?.packages)
                setLoading(false)
            } else {
                setLoading(false)
                alert(data?.message || 'Something went wrong!')
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPackages()
    }, [filter, search])

    const handleDelete = async (packageId) => {
        try {
            setLoading(true)
            const res = await fetch(
                `/api/package/delete-package/${packageId}`,
                {
                    method: 'DELETE',
                }
            )
            const data = await res.json()
            alert(data?.message)
            getPackages()
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className='flex w-full flex-col justify-center gap-2 rounded-lg p-5 shadow-xl'>
                {loading && <h1 className='text-center text-lg'>Loading...</h1>}
                {packages && (
                    <>
                        <div>
                            <input
                                className='rounded border p-2'
                                type='text'
                                placeholder='Search'
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                }}
                            />
                        </div>
                        <div className='my-2 border-y-2 py-2'>
                            <ul className='flex w-full justify-around'>
                                <li
                                    className={`cursor-pointer rounded-xl border p-2 transition-all duration-300 hover:scale-95 ${
                                        filter === 'all' &&
                                        'bg-blue-500 text-white'
                                    }`}
                                    id='all'
                                    onClick={(e) => {
                                        setFilter(e.target.id)
                                    }}>
                                    All
                                </li>
                                <li
                                    className={`cursor-pointer rounded-xl border p-2 transition-all duration-300 hover:scale-95 ${
                                        filter === 'offer' &&
                                        'bg-blue-500 text-white'
                                    }`}
                                    id='offer'
                                    onClick={(e) => {
                                        setFilter(e.target.id)
                                    }}>
                                    Offer
                                </li>
                                <li
                                    className={`cursor-pointer rounded-xl border p-2 transition-all duration-300 hover:scale-95 ${
                                        filter === 'latest' &&
                                        'bg-blue-500 text-white'
                                    }`}
                                    id='latest'
                                    onClick={(e) => {
                                        setFilter(e.target.id)
                                    }}>
                                    Latest
                                </li>
                                <li
                                    className={`cursor-pointer rounded-xl border p-2 transition-all duration-300 hover:scale-95 ${
                                        filter === 'top' &&
                                        'bg-blue-500 text-white'
                                    }`}
                                    id='top'
                                    onClick={(e) => {
                                        setFilter(e.target.id)
                                    }}>
                                    Top
                                </li>
                            </ul>
                        </div>
                    </>
                )}
                {/* packages */}
                {packages ? (
                    packages.map((pack, i) => {
                        return (
                            <div
                                className='flex w-full items-center justify-between rounded-lg border p-3 transition-all duration-300 hover:scale-[1.02]'
                                key={i}>
                                <Link to={`/package/${pack._id}`}>
                                    <img
                                        src={pack?.packageImages[0]}
                                        alt='image'
                                        className='h-20 w-20 rounded'
                                    />
                                </Link>
                                <Link to={`/package/${pack._id}`}>
                                    <p className='font-semibold hover:underline'>
                                        {pack?.packageName}
                                    </p>
                                </Link>
                                <div className='flex flex-col'>
                                    <Link
                                        to={`/profile/admin/update-package/${pack._id}`}>
                                        <button
                                            disabled={loading}
                                            className='text-blue-600 hover:underline'>
                                            {loading ? 'Loading...' : 'Edit'}
                                        </button>
                                    </Link>
                                    <button
                                        disabled={loading}
                                        onClick={() => handleDelete(pack?._id)}
                                        className='text-red-600 hover:underline'>
                                        {loading ? 'Loading...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <h1 className='text-center text-2xl'>No Packages Yet!</h1>
                )}
            </div>
        </>
    )
}

export default AllPackages

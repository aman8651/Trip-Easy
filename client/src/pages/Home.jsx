import React, { useEffect, useState } from 'react'
import './styles/Home.css'
import { FaCalendar, FaSearch, FaStar } from 'react-icons/fa'
import { FaRankingStar } from 'react-icons/fa6'
import { LuBadgePercent } from 'react-icons/lu'
import PackageCard from './PackageCard'
import { useNavigate } from 'react-router'

const Home = () => {
    const navigate = useNavigate()
    const [topPackages, setTopPackages] = useState([])
    const [latestPackages, setLatestPackages] = useState([])
    const [offerPackages, setOfferPackages] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')

    const getTopPackages = async () => {
        try {
            setLoading(true)
            const res = await fetch(
                '/api/package/get-packages?sort=packageRating&limit=8'
            )
            const data = await res.json()
            if (data?.success) {
                setTopPackages(data?.packages)
                setLoading(false)
            } else {
                setLoading(false)
                alert(data?.message || 'Something went wrong!')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getLatestPackages = async () => {
        try {
            setLoading(true)
            const res = await fetch(
                '/api/package/get-packages?sort=createdAt&limit=8'
            )
            const data = await res.json()
            if (data?.success) {
                setLatestPackages(data?.packages)
                setLoading(false)
            } else {
                setLoading(false)
                alert(data?.message || 'Something went wrong!')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getOfferPackages = async () => {
        try {
            setLoading(true)
            const res = await fetch(
                '/api/package/get-packages?sort=createdAt&offer=true&limit=6'
            )
            const data = await res.json()
            if (data?.success) {
                setOfferPackages(data?.packages)
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
        getTopPackages()
        getLatestPackages()
        getOfferPackages()
    }, [])

    return (
        <div className='main w-full'>
            <div className='flex w-full flex-col'>
                <div className='backaground_image w-full'></div>
                <div className='top-part flex w-full flex-col gap-2'>
                    <h1 className='mb-2 text-center text-4xl font-bold text-white underline'>
                        Trip Easy
                    </h1>
                    <h1 className='xsm:text-lg text-center text-sm font-semibold text-white'>
                        Travel With Ease
                    </h1>
                    <div className='mt-8 flex w-full items-center justify-center gap-2'>
                        <input
                            type='text'
                            className='w-[230px] rounded-lg border border-black bg-white bg-opacity-40 p-2 font-semibold text-white outline-none placeholder:text-white sm:w-2/5'
                            placeholder='Search'
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                            }}
                        />
                        <button
                            onClick={() => {
                                navigate(`/search?searchTerm=${search}`)
                            }}
                            className='flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-semibold hover:scale-95'>
                            Go
                            {/* <FaSearch className="" /> */}
                        </button>
                    </div>
                    <div className='mt-10 flex w-[90%] max-w-xl justify-center'>
                        <button
                            onClick={() => {
                                navigate('/search?offer=true')
                            }}
                            className='xxsm:text-sm flex flex-1 items-center justify-around gap-x-1 rounded-s-full border-e border-white bg-slate-400 p-2 py-1 text-[8px] text-white transition-all duration-150 hover:scale-105 sm:text-lg'>
                            Best Offers
                            <LuBadgePercent className='text-2xl' />
                        </button>
                        <button
                            onClick={() => {
                                navigate('/search?sort=packageRating')
                            }}
                            className='xxsm:text-sm flex flex-1 items-center justify-around gap-x-1 border-x border-white bg-slate-400 p-2 py-1 text-[8px] text-white transition-all duration-150 hover:scale-105 sm:text-lg'>
                            Top Rated
                            <FaStar className='text-2xl' />
                        </button>
                        <button
                            onClick={() => {
                                navigate('/search?sort=createdAt')
                            }}
                            className='xxsm:text-sm flex flex-1 items-center justify-around gap-x-1 border-x border-white bg-slate-400 p-2 py-1 text-[8px] text-white transition-all duration-150 hover:scale-105 sm:text-lg'>
                            Latest
                            <FaCalendar className='text-lg' />
                        </button>
                        <button
                            onClick={() => {
                                navigate('/search?sort=packageTotalRatings')
                            }}
                            className='xxsm:text-sm flex flex-1 items-center justify-around gap-x-1 rounded-e-full border-s border-white bg-slate-400 p-2 py-1 text-[8px] text-white transition-all duration-150 hover:scale-105 sm:text-lg'>
                            Most Rated
                            <FaRankingStar className='text-2xl' />
                        </button>
                    </div>
                </div>
                {/* main page */}
                <div className='main flex flex-col gap-5 p-6'>
                    {loading && (
                        <h1 className='text-center text-2xl'>Loading...</h1>
                    )}
                    {!loading &&
                        topPackages.length === 0 &&
                        latestPackages.length === 0 &&
                        offerPackages.length === 0 && (
                            <h1 className='text-center text-2xl'>
                                No Packages Yet!
                            </h1>
                        )}
                    {/* Top Rated */}
                    {!loading && topPackages.length > 0 && (
                        <>
                            <h1 className='text-2xl font-semibold'>
                                Top Packages
                            </h1>
                            <div className='my-3 flex flex-wrap gap-2'>
                                {topPackages.map((packageData, i) => {
                                    return (
                                        <PackageCard
                                            key={i}
                                            packageData={packageData}
                                        />
                                    )
                                })}
                            </div>
                        </>
                    )}
                    {/* Top Rated */}
                    {/* latest */}
                    {!loading && latestPackages.length > 0 && (
                        <>
                            <h1 className='text-2xl font-semibold'>
                                Latest Packages
                            </h1>
                            <div className='my-3 flex flex-wrap gap-2'>
                                {latestPackages.map((packageData, i) => {
                                    return (
                                        <PackageCard
                                            key={i}
                                            packageData={packageData}
                                        />
                                    )
                                })}
                            </div>
                        </>
                    )}
                    {/* latest */}
                    {/* offer */}
                    {!loading && offerPackages.length > 0 && (
                        <>
                            <div className='offers_img'></div>
                            <h1 className='text-2xl font-semibold'>
                                Best Offers
                            </h1>
                            <div className='my-3 flex flex-wrap gap-2'>
                                {offerPackages.map((packageData, i) => {
                                    return (
                                        <PackageCard
                                            key={i}
                                            packageData={packageData}
                                        />
                                    )
                                })}
                            </div>
                        </>
                    )}
                    {/* offer */}
                </div>
            </div>
        </div>
    )
}

export default Home

import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    logOutStart,
    logOutSuccess,
    logOutFailure,
    deleteUserAccountStart,
    deleteUserAccountSuccess,
    deleteUserAccountFailure,
} from '../redux/user/userSlice'
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage'
import { app } from '../firebase'
import MyBookings from './user/MyBookings'
import UpdateProfile from './user/UpdateProfile'
import MyHistory from './user/MyHistory'

const Profile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const fileRef = useRef(null)
    const { currentUser, loading, error } = useSelector((state) => state.user)
    const [profilePhoto, setProfilePhoto] = useState(undefined)
    const [photoPercentage, setPhotoPercentage] = useState(0)
    const [activePanelId, setActivePanelId] = useState(1)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        address: '',
        phone: '',
        avatar: '',
    })

    useEffect(() => {
        if (currentUser !== null) {
            setFormData({
                username: currentUser.username,
                email: currentUser.email,
                address: currentUser.address,
                phone: currentUser.phone,
                avatar: currentUser.avatar,
            })
        }
    }, [currentUser])

    const handleProfilePhoto = (photo) => {
        try {
            dispatch(updateUserStart())
            const storage = getStorage(app)
            const photoname =
                new Date().getTime() + photo.name.replace(/\s/g, '')
            const storageRef = ref(storage, `profile-photos/${photoname}`) //profile-photos - folder name in firebase
            const uploadTask = uploadBytesResumable(storageRef, photo)

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = Math.floor(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    )
                    //   console.log(progress);
                    setPhotoPercentage(progress)
                },
                (error) => {
                    console.log(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        async (downloadUrl) => {
                            const res = await fetch(
                                `/api/user/update-profile-photo/${currentUser._id}`,
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': ' application/json',
                                    },
                                    body: JSON.stringify({
                                        avatar: downloadUrl,
                                    }),
                                }
                            )
                            const data = await res.json()
                            if (data?.success) {
                                alert(data?.message)
                                setFormData({
                                    ...formData,
                                    avatar: downloadUrl,
                                })
                                dispatch(updateUserSuccess(data?.user))
                                setProfilePhoto(null)
                                return
                            } else {
                                dispatch(updateUserFailure(data?.message))
                            }
                            dispatch(updateUserFailure(data?.message))
                            alert(data?.message)
                        }
                    )
                }
            )
        } catch (error) {
            console.log(error)
        }
    }

    const handleLogout = async () => {
        try {
            dispatch(logOutStart())
            const res = await fetch('/api/auth/logout')
            const data = await res.json()
            if (data?.success !== true) {
                dispatch(logOutFailure(data?.message))
                return
            }
            dispatch(logOutSuccess())
            navigate('/login')
            alert(data?.message)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteAccount = async (e) => {
        e.preventDefault()
        const CONFIRM = confirm(
            'Are you sure ? the account will be permenantly deleted!'
        )
        if (CONFIRM) {
            try {
                dispatch(deleteUserAccountStart())
                const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                    method: 'DELETE',
                })
                const data = await res.json()
                if (data?.success === false) {
                    dispatch(deleteUserAccountFailure(data?.message))
                    alert('Something went wrong!')
                    return
                }
                dispatch(deleteUserAccountSuccess())
                alert(data?.message)
            } catch (error) {}
        }
    }

    return (
        <div className='flex w-full flex-wrap p-2 max-sm:flex-col'>
            {currentUser ? (
                <>
                    <div className='w-[40%] p-3 max-sm:w-full'>
                        <div className='flex flex-col items-center gap-4 p-3'>
                            <div className='relative flex w-full flex-col items-center'>
                                <img
                                    src={
                                        (profilePhoto &&
                                            URL.createObjectURL(
                                                profilePhoto
                                            )) ||
                                        formData.avatar
                                    }
                                    alt='Profile photo'
                                    className='max-h-64 min-h-52 w-64 rounded-lg'
                                    onClick={() => fileRef.current.click()}
                                    onMouseOver={() => {
                                        document
                                            .getElementById('photoLabel')
                                            .classList.add('block')
                                    }}
                                    onMouseOut={() => {
                                        document
                                            .getElementById('photoLabel')
                                            .classList.remove('block')
                                    }}
                                />
                                <input
                                    type='file'
                                    name='photo'
                                    id='photo'
                                    hidden
                                    ref={fileRef}
                                    accept='image/*'
                                    onChange={(e) =>
                                        setProfilePhoto(e.target.files[0])
                                    }
                                />
                                <label
                                    htmlFor='photo'
                                    id='photoLabel'
                                    className='absolute bottom-0 w-64 rounded-b-lg bg-slate-300 p-2 text-center text-lg font-semibold text-white'
                                    hidden>
                                    Choose Photo
                                </label>
                            </div>
                            {profilePhoto && (
                                <div className='flex w-full justify-between gap-1'>
                                    <button
                                        onClick={() =>
                                            handleProfilePhoto(profilePhoto)
                                        }
                                        className='mt-3 flex-1 bg-green-700 p-2 text-white hover:opacity-90'>
                                        {loading
                                            ? `Uploading...(${photoPercentage}%)`
                                            : 'Upload'}
                                    </button>
                                </div>
                            )}
                            <p
                                style={{
                                    width: '100%',
                                    borderBottom: '1px solid black',
                                    lineHeight: '0.1em',
                                    margin: '10px',
                                }}>
                                <span
                                    className='font-semibold'
                                    style={{ background: '#fff' }}>
                                    Details
                                </span>
                            </p>
                            {/* <button
                onClick={handleLogout}
                className="text-red-600 text-lg font-semibold self-start border border-red-600 p-1 rounded-lg hover:bg-red-600 hover:text-white"
              >
                Log-out
              </button> */}
                            <div className='flex w-full justify-between px-1'>
                                <button
                                    onClick={handleLogout}
                                    className='self-start rounded-lg border border-red-600 p-1 text-lg font-semibold text-red-600 hover:bg-red-600 hover:text-white'>
                                    Log-out
                                </button>
                                <button
                                    onClick={() => setActivePanelId(3)}
                                    className='self-end rounded-lg bg-gray-500 p-1 text-lg text-white hover:bg-gray-700'>
                                    Edit Profile
                                </button>
                            </div>
                            <div className='w-full break-all rounded-lg p-3 shadow-2xl'>
                                <p className='m-1 text-3xl font-semibold'>
                                    Hi {currentUser.username} !
                                </p>
                                <p className='text-lg font-semibold'>
                                    Email:{currentUser.email}
                                </p>
                                <p className='text-lg font-semibold'>
                                    Phone:{currentUser.phone}
                                </p>
                                <p className='text-lg font-semibold'>
                                    Address:{currentUser.address}
                                </p>
                            </div>
                            <button
                                onClick={handleDeleteAccount}
                                className='text-red-600 hover:underline'>
                                Delete account
                            </button>
                        </div>
                    </div>
                    {/* ---------------------------------------------------------------------------------------- */}
                    <div className='w-[60%] max-sm:w-full'>
                        <div>
                            <nav className='w-full border-b-4 border-blue-500'>
                                <div className='flex w-full gap-2'>
                                    <button
                                        className={
                                            activePanelId === 1
                                                ? 'rounded-t bg-blue-500 p-1 text-white transition-all duration-300'
                                                : 'rounded-t p-1 transition-all duration-300'
                                        }
                                        id='bookings'
                                        onClick={() => setActivePanelId(1)}>
                                        Bookings
                                    </button>
                                    <button
                                        className={
                                            activePanelId === 2
                                                ? 'rounded-t bg-blue-500 p-1 text-white transition-all duration-300'
                                                : 'rounded-t p-1 transition-all duration-300'
                                        }
                                        id='updateProfile'
                                        onClick={() => setActivePanelId(2)}>
                                        History
                                    </button>
                                </div>
                            </nav>
                            {/* bookings */}
                            <div className='main flex flex-wrap'>
                                {activePanelId === 1 && <MyBookings />}
                                {/* History */}
                                {activePanelId === 2 && <MyHistory />}
                                {/* Update profile */}
                                {activePanelId === 3 && <UpdateProfile />}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div>
                    <p className='text-red-700'>Login First</p>
                </div>
            )}
        </div>
    )
}

export default Profile

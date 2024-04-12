// Import React and other necessary libraries
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetUserOrdersQuery } from '../slices/orderApiSlice'
import { useUpdateUserProfileMutation } from '../slices/userApiSlice'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import { setCredentials } from '../slices/userSlice'
import { Link } from 'react-router-dom';

// ProfileScreen component
export default function ProfileScreen() {
    // Dispatch and useSelector hooks
    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.user)

    // State variables for profile information
    const [name, setName] = useState(userInfo.name)
    const [email, setEmail] = useState(userInfo.email)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    // Queries and mutations
    const { data: userOrders, isLoading, error } = useGetUserOrdersQuery()
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserProfileMutation()

    // Function to handle profile update
    const handleUpdateProfile = async e => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        const res = await updateUser({ _id: userInfo._id, name, email, password }).unwrap()
        dispatch(setCredentials({ ...res }))
        toast.success("Updated Profile")
    }

    // If there's an error, display error message
    if (error) {
        return toast.error(error.message)
    }

    // If data is loading, display spinner
    if (isLoading) {
        return <Spinner />
    }

    // Render the ProfileScreen component
    return (
        <div className="flex">
            {/* Profile Information */}
            <div className="w-1/4 p-4">
                <h1 className="text-xl font-semibold mb-4">Profile</h1>
                <form className="mb-6" onSubmit={handleUpdateProfile}>
                    {/* Input fields for name, email, password, and confirm password */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="border p-2 w-full rounded-md"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="border p-2 w-full rounded-md"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="border p-2 w-full rounded-md"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="border p-2 w-full rounded-md"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    {/* Button to update profile */}
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-md" onClick={handleUpdateProfile}>
                        Update Profile
                    </button>
                    {isUpdating && <Spinner />}
                </form>
            </div>
            {/* User Orders */}
            <div className="w-3/4 p-4">
                <h2 className="text-xl font-semibold mb-4">My Request</h2>
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border p-2">Product Name</th>
                            <th className="border p-2">Quantity</th>
                            <th className="border p-2">Borrow Date</th>
                            <th className="border p-2">Return Date</th>
                            <th className="border p-2">Request Date</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Iterate over userOrders and display order details */}
                        {userOrders?.map(order => (
                            <tr key={order._id} className='text-center'>
                                <td className='border p-2'>{order.orderItems.map(item => item.name).join(", ")}</td> {/* Product Name */}
                                <td className='border p-2'>{order.orderItems.map(item => item.qty).join(", ")}</td> {/* Quantity */}
                                <td className='border p-2'>{new Date(order.shippingAddress.borrowingDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                                <td className='border p-2'>{new Date(order.shippingAddress.returnDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                                <td className='border p-2'>{new Date(order.createdAt).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                                <td className='border p-2'>{order.isDelivered ? "Confirmed" : "Not confirmed"}</td> {/* Status */}
                                <td className='border p-2'>
                                    <Link to={`/order/${order._id}`} className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'>
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Display message if no orders */}
                {userOrders.length === 0 && <p className='text-gray-400 text-xl text-center mt-5'>No Orders</p>}
            </div>
        </div>
    )
}

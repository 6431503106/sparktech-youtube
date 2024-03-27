import React from 'react'
import Spinner from "../../components/Spinner"
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { useGetOrdersQuery } from '../../slices/orderApiSlice'

export default function OrderListScreen() {
  const { data: orders, isLoading, error } = useGetOrdersQuery()

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    toast.error(error.message)
  }

  return (
    <div className="mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Request List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Product ID</th>
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">User</th>
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Product Name</th>
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Quantity</th>
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Status</th>
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Reason</th>
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Date of Request</th>
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Date of Return</th>
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map(order => (
              <tr key={order._id} className='text-center'>
                <td className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>{order._id}</td>
                <td className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>{order.user?.name}</td>
                <td className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>{order.productName}</td>
                <td className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>{order.Quantity}</td>
                <td className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>{order.status}</td>
                <td className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>{order.reason}</td>
                <td className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>{order.dateOfRequest}</td>
                <td className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>{order.dateOfReturn}</td>
                <td className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  )
}

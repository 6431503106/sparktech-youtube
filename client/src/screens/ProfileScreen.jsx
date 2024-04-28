// Import React and other necessary libraries
import React, { useState, } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetUserOrdersQuery,useUpdateOrderStatusMutation} from '../slices/orderApiSlice'
import { useUpdateUserProfileMutation } from '../slices/userApiSlice'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import { setCredentials } from '../slices/userSlice'
import Modal from 'react-modal';
import { RxCross2 } from "react-icons/rx";

export default function ProfileScreen() {

    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.user)

    const [name, setName] = useState(userInfo.name)
    const [email, setEmail] = useState(userInfo.email)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")


    const { data: userOrders, isLoading, error,refetch } = useGetUserOrdersQuery()
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserProfileMutation()

    
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

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updateOrderStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    toast.error(error.message)
  }

  const handleUpdateStatus = () => {
    if (!selectedOrder) {
      toast.error('Please select an order.');
      return;
    }
    
    updateOrderStatusHandler(selectedOrder._id, "Cancel");
  };
  
  const updateOrderStatusHandler = async (orderId, status) => {
    try {
      await updateOrderStatus({ orderId, status });
      toast.success(`Status updated to ${status}`);
      refetch();
      closeModal(); 
    } catch (error) {
      toast.error(error.message);
    }
  };
  

  const openModal = (order) => {
    setSelectedOrder(order); // Set selected order
    setIsOpen(true); // Open modal
  };

  const closeModal = () => {
    setSelectedOrder(null); // Reset selected order
    setIsOpen(false); // Close modal
  };

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
            <div className="w-3/4 p-4">
                <h2 className="text-xl font-semibold mb-4">My Request</h2>
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border p-2">Product name</th>
                            <th className="border p-2">Product ID</th>
                            <th className="border p-1">Quantity</th>
                            <th className="border p-2">Borrowing Date</th>
                            <th className="border p-2">Return Date</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {userOrders?.map(order => (
                        <tr key={order._id} className='text-center'>
                            <td className='border p-2'>{order.orderItems.map(item => item.name).join(", ")}</td>
                            <td  className='border p-2'>{order._id}</td>
                            <td className='border p-2'>{order.orderItems.map(item => item.qty).join(", ")}</td>
                            <td className='border p-2'>{new Date(order.shippingAddress.borrowingDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                            <td className='border p-2'>{new Date(order.shippingAddress.returnDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                            <td className={`border border-gray-300 py-2 px-4 sm:px-6 md:px-8 ${order.status === 'Cancel' ? 'text-red-500' : ''}`}>
                                {order.status}
                            </td>
                            <td className='border p-2'>
                                <button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded' onClick={() => openModal(order)}>View</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {userOrders.length === 0 && <p className='text-gray-400 text-xl text-center mt-5'>No items</p>}
            </div>
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                contentLabel="Order Details Modal"
                appElement={document.getElementById('root')}
                style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000
                },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: '800px' // Increase the max width to match OrderScreen
                }
                }}
            >
                <div className="flex">
                <div className="ml-auto">
                    <button onClick={closeModal} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mt-2 hover:bg-gray-400">
                    <RxCross2 />
                    </button>
                </div>
                </div>
                {/* Render selected order details */} 
                {selectedOrder && (
                <div className="flex flex-col md:flex-row justify-center items-start">
                    <div className="md:w-1/3 p-4">
                    <h2 className="text-3xl font-semibold mb-4">Details</h2>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Student Name:</h3>
                        <p>{selectedOrder.user?.name}</p>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Information:</h3>
                        <p>Date of request: {new Date(selectedOrder.createdAt).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                        <p>Reason: {selectedOrder.shippingAddress.reason}</p>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Date:</h3>
                        <p>Borrow Date:{new Date(selectedOrder.shippingAddress.borrowingDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                        <p>Return Date:{new Date(selectedOrder.shippingAddress.returnDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                        </div>
                        
                        <div className="mb-4">
                        {selectedOrder && selectedOrder.status !== 'Cancel' && (
                        <div className="mb-4">
                            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mt-2 rounded mr-2" onClick={() => handleUpdateStatus("Cancel")}>Cancel Request</button>  
                        </div>
                    )}
                        </div>
                         
                    </div>
                    <div className="md:w-2/3 bg-gray-100 p-5 mt-5" style={{ maxHeight: '450px', overflowY: 'auto'}}>
                    <h3 className="text-xl font-semibold mb-4">Summary</h3>
                        <table className="w-full border-collapse">
                        <thead>
                            <tr>
                            <th className="text-left">Product</th>
                            <th className="text-right">Quantity</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedOrder.orderItems?.map(item => (
                            <tr key={item._id} className="border-b border-gray-400">
                            <td className='px-7 py-3 whitespace-nowrap'>
                                <img src={item.image} alt={item.name} className="w-20 h-15 object-cover mr-4" />
                                <td className="text-left">{item.name}</td>
                            </td>
                            <td className="text-right">{item.qty}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
                )}
            </Modal>


        </div>
    )
    
}

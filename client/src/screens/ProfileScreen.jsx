import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserOrdersQuery } from '../slices/orderApiSlice';
import { useUpdateUserProfileMutation } from '../slices/userApiSlice';
import { useUpdateOrderItemStatusMutation } from '../slices/orderApiSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { setCredentials } from '../slices/userSlice';
import Modal from 'react-modal';
<<<<<<< HEAD
import { RxCross2 } from "react-icons/rx";
import { FaRegEye } from "react-icons/fa";
import '../Header.css'; // เพิ่มไฟล์ CSS
=======
import { AiOutlineMore } from "react-icons/ai";
import TablePagination from '@mui/material/TablePagination';
>>>>>>> 823203878becbd0a4ccb34da099ae7c8865cb07e

export default function ProfileScreen() {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.user);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [name, setName] = useState(userInfo.name);
    const [email, setEmail] = useState(userInfo.email);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [keyword, setKeyword] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [filteredOrders, setFilteredOrders] = useState([]);

    const { data: userOrders, isLoading, error, refetch } = useGetUserOrdersQuery();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
    const [updateOrderStatus] = useUpdateOrderItemStatusMutation();

    useEffect(() => {
        if (userOrders) {
            handleSearchFilter();
        }
    }, [keyword, userOrders]);

    const handleSearchFilter = () => {
        const searchValue = keyword.toLowerCase();
        const filtered = userOrders.flatMap(order =>
            order.orderItems.filter(item =>
                item.name.toLowerCase().includes(searchValue) || item._id.toLowerCase().includes(searchValue)
            ).map(item => ({
                ...item,
                order: order
            }))
        );
        setFilteredOrders(filtered);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const indexOfLastItem = (page + 1) * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const paginatedOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    const handleUpdateProfile = async e => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const res = await updateUser({ _id: userInfo._id, name, email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            toast.success("Updated Profile");
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedOrder || !selectedItem) {
            toast.error('Please select an order and item.');
            return;
        }

        try {
            await updateOrderStatus({
                orderId: selectedOrder._id,
                itemId: selectedItem._id,
                status: "Cancel"
            });
            toast.success(`Status updated to Cancel`);
            refetch();
            closeModal();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const openModal = (order, item) => {
        setSelectedOrder(order);
        setSelectedItem(item);
        setIsOpen(true);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setIsOpen(false);
    };

    return (
        <div class="content-wrapper">
            
            {/* Profile Information */}
            <div className="w-1/4 p-4">
                <h1 className="text-xl font-semibold mb-4">Profile</h1>
                <form className="mb-6" onSubmit={handleUpdateProfile}>
                    {/* Input fields for name, email, password, and confirm password */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="border p-2 w-full rounded-md"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="border p-2 w-full rounded-md"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="border p-2 w-full rounded-md"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="border p-2 w-full rounded-md"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    {/* Button to update profile */}
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                        Update Profile
                    </button>
                    {isUpdating && <Spinner />}
                </form>
            </div>
            <div className="w-3/4 p-4 overflow-x-auto">
                {/* Search and Filter Section */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center mb-2">
                        <input
                            type="text"
                            placeholder="Search"
                            className="border p-2 w-full rounded-md"
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                        />
                        <button
                            onClick={handleSearchFilter}
                            className="bg-red-500 text-white p-2 rounded-md ml-2">
                            Search
                        </button>
                    </div>
                </div>
                <h2 className="text-xl font-semibold mb-4">My Request</h2>
                <table className="min-w-full divide-y divide-gray-200 border">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Product name</th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Borrow Date</th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
<<<<<<< HEAD
                    {userOrders?.map(order => (
                        <tr key={order._id} className='bg-white divide-y divide-gray-200 border'>
                            <td className='px-7 py-3 text-center '>{order.orderItems.map(item => item.name).join(", ")}</td>
                            <td  className='px-7 py-3 whitespace-nowrap '>{order._id.slice(-3)}</td>
                            <td className='px-7 py-3 whitespace-nowrap  text-center'>{order.orderItems.map(item => item.qty).join(", ")}</td>
                            <td className='px-7 py-3 whitespace-nowrap '>{new Date(order.shippingAddress.borrowingDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                            <td className='px-7 py-3 whitespace-nowrap '>{new Date(order.shippingAddress.returnDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                            <td className={`px-7 py-3 whitespace-nowrap  sm:px-6 md:px-8 ${order.status === 'Cancel' ? 'text-red-500' : ''}`}>
                                {order.status}
                            </td>
                            <td className='text-back-500 '>
                                <button className=' font-bold py-2 px-10 whitespace-nowrap' onClick={() => openModal(order)}>
                                <FaRegEye />
                                </button>
                            </td>
                        </tr>
                    ))}
=======
                        {paginatedOrders.map(item => (
                            <tr key={`${item.order._id}-${item._id}`} className="my-4">
                                <td className='px-7 py-3 whitespace-nowrap'>{item.order._id.slice(-3)}</td>
                                <td className='px-7 py-3 text-center'>{item.name}</td>
                                <td className='px-7 py-3 whitespace-nowrap text-center'>{item.qty}</td>
                                <td className='px-7 py-3 whitespace-nowrap'>
                                    {new Date(item.order.shippingAddress.borrowingDate).toLocaleDateString('us', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                </td>
                                <td className='px-7 py-3 whitespace-nowrap'>
                                    {new Date(item.order.shippingAddress.returnDate).toLocaleDateString('us', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                </td>
                                <td className={`px-7 py-3 whitespace-nowrap ${item.status === 'Cancel' ? 'text-red-500' : ''}`}>{item.status}</td>
                                <td className='text-back-500'>
                                    <button className='py-2 px-10 whitespace-nowrap' onClick={() => openModal(item.order, item)}>
                                    <AiOutlineMore />
                                    </button>
                                </td>
                            </tr>
                        ))}
>>>>>>> 823203878becbd0a4ccb34da099ae7c8865cb07e
                    </tbody>
                </table>

                {/* Pagination Component */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredOrders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                {filteredOrders.length === 0 && <p className='text-gray-400 text-xl text-center mt-5'>No items in your list</p>}
            </div>

            {/* Modal for Order Details */}
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                contentLabel="Order Details Modal"
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
                        maxWidth: '800px'
                    }
                }}
            >
                {selectedOrder && selectedItem && (
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 bg-white p-5 rounded-md">
                            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                            <strong><span className="font-semibold">Item Name:</span> {selectedItem.name}</strong>
                            <p>{selectedOrder.user?.name}</p>
                            <p><span className="font-semibold">Status:</span> {selectedItem.status}</p>
                            <p><span className="font-semibold">Borrow Date:</span> {selectedOrder.shippingAddress?.borrowingDate ? new Date(selectedOrder.shippingAddress.borrowingDate).toLocaleDateString('us', { year: 'numeric', month: 'long', day: '2-digit' }) : 'N/A'}</p>
                            <p><span className="font-semibold">Return Date:</span> {selectedOrder.shippingAddress?.returnDate ? new Date(selectedOrder.shippingAddress.returnDate).toLocaleDateString('us', { year: 'numeric', month: 'long', day: '2-digit' }) : 'N/A'}</p>
                            <div className="mt-4">
                            {selectedItem.status !== 'Cancel' && selectedItem.status !== 'Confirm' ? (
                            <button
                                onClick={handleUpdateStatus}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mt-2 rounded"
                            >
                                Cancel Request
                            </button>
                            ) : null}
                            </div>
                        </div>
                        <div className="md:w-2/3 bg-gray-100 p-5 mt-5 rounded-md" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                            <h3 className="text-xl font-semibold mb-4">Summary</h3>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="text-left px-10">Product</th>
                                        <th className="text-center">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedItem && (
                                        <tr key={selectedItem._id} className="border-b border-gray-400">
                                            <td className='px-7 py-3 whitespace-nowrap'>
                                                <img src={selectedItem.image} alt={selectedItem.name} className="w-20 h-15 object-cover mr-4" />
                                                <span className="text-center px-3">{selectedItem.name}</span>
                                            </td>
                                            <td className="text-center">{selectedItem.qty}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

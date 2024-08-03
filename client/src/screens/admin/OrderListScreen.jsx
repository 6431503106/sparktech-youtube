import React, { useState, useEffect } from 'react';
import Spinner from "../../components/Spinner";
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
<<<<<<< HEAD
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../../slices/orderApiSlice';
import { RxCross2 } from "react-icons/rx";
import Modal from 'react-modal';
import TablePagination from '@mui/material/TablePagination';
import { CiEdit } from "react-icons/ci";
import '../../Header.css'; // เพิ่มไฟล์ CSS

export default function OrderListScreen() {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
=======
import { useGetOrdersQuery, useUpdateOrderItemStatusMutation,useDeleteOrderMutation} from '../../slices/orderApiSlice';
import Modal from 'react-modal';
import TablePagination from '@mui/material/TablePagination';
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";

Modal.setAppElement('#root');

export default function OrderListScreen() {
>>>>>>> 823203878becbd0a4ccb34da099ae7c8865cb07e
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [filteredOrders, setFilteredOrders] = useState([]);
<<<<<<< HEAD
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");

  useEffect(() => {
    refetch();
  }, [orders]);
=======

  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrderItemStatus] = useUpdateOrderItemStatusMutation();
>>>>>>> 823203878becbd0a4ccb34da099ae7c8865cb07e

  useEffect(() => {
    if (!isLoading && orders) {
      handleSearchFilter();
    }
  }, [keyword, orders]);

<<<<<<< HEAD
  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    toast.error(error?.data?.message || error?.error);
  }

  const handleSearchFilter = () => {
    const filteredOrders = orders.filter(order =>
      order.status.toLowerCase() === 'pending' && // Filter by status 'Pending'
      (
        order._id.toLowerCase().includes(keyword.toLowerCase()) ||
        order.user.name.toLowerCase().includes(keyword.toLowerCase()) ||
        order.status.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    setFilteredOrders(filteredOrders);
=======
  const handleSearchFilter = () => {
    const searchValue = keyword.toLowerCase();
    const filtered = orders.flatMap(order =>
      order.orderItems.filter(item =>
        item.name.toLowerCase().includes(searchValue) || item._id.toLowerCase().includes(searchValue)
      ).map(item => ({
        ...item,
        order: order
      }))
    );
    setFilteredOrders(filtered);
>>>>>>> 823203878becbd0a4ccb34da099ae7c8865cb07e
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUpdateStatus = () => {
    if (!selectedOrder || !selectedStatus) {
      toast.error('Please select an order and a status.');
      return;
    }

    updateOrderStatusHandler(selectedOrder._id, selectedStatus);
  };

  const updateOrderStatusHandler = async (orderId, status) => {
    try {
      await updateOrderStatus({ orderId, status });
<<<<<<< HEAD
      toast.success(`Status updated to ${status}`);
=======
      toast.success(`Order status updated to ${status}`);
>>>>>>> 823203878becbd0a4ccb34da099ae7c8865cb07e
      refetch();
      closeModal();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateItemStatus = async (itemId, status) => {
    try {
      await updateOrderItemStatus({ orderId: selectedOrder._id, itemId, status });
      toast.success(`Order item status updated to ${status}`);
      refetch();
      closeModal();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(orderId);
        toast.success('Order deleted successfully');
        refetch();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const openModal = (order, item) => {
    setSelectedOrder(order);
    setSelectedItem(item);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setSelectedItem(null);
    setSelectedStatus(null);
    setIsOpen(false);
  };

  // Calculate indexes
<<<<<<< HEAD
  const indexOfLastOrder = (page + 1) * rowsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - rowsPerPage;
  const visibleOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - filteredOrders.length);

  return (
    <div>
      <div className="content-wrapper justify-start">
        <h2 className="text-3xl font-semibold mb-3">Pending Order List</h2>
      </div>
      <div className="content-menu flex justify-between mb-2">
        <div className="flex">
          <input
            type="text"
            placeholder="Search"
            className="ml-2 px-5 rounded-md bg-gray-100 text-back"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
          <button className="bg-red-500 text-white py-2 px-4 rounded-md ml-2" onClick={handleSearchFilter}>
=======
  const indexOfLastItem = (page + 1) * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const paginatedOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Request List</h2>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center mb-2">
          <input
            type="text"
            placeholder="Search"
            className="border p-2 rounded-md"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
          <button
            onClick={handleSearchFilter}
            className="bg-red-500 text-white p-2 rounded-md ml-2">
>>>>>>> 823203878becbd0a4ccb34da099ae7c8865cb07e
            Search
          </button>
        </div>
      </div>
      <div className="content-table">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Product Name</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">User Name</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Request Date</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Borrow Date</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Return Date</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Status</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">Actions</th>
            </tr>
          </thead>
          <tbody>
<<<<<<< HEAD
            {/* Visible Orders */}
            {visibleOrders.map((order) => (
              <tr key={order._id} className='text-center'>
                <td className='px-7 py-3 whitespace-nowrap border'>{order._id}</td>
                <td className='px-7 py-3 whitespace-nowrap border'>{order.user?.name}</td>
                <td className='px-7 py-3 whitespace-nowrap border'>{new Date(order.createdAt).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                <td className='px-7 py-3 whitespace-nowrap border'>{new Date(order.shippingAddress.borrowingDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                <td className='px-7 py-3 whitespace-nowrap border'>{new Date(order.shippingAddress.returnDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                <td className={`px-7 py-3 whitespace-nowrap border ${order.status === 'Pending' ? 'text-yellow-500' : ''}`}>{order.status}</td>
                <td className='px-7 py-3 whitespace-nowrap border'>
                  <button className='size-100 font-bold py-2 px-4' onClick={() => openModal(order)}>
                    <CiEdit />
=======
            {paginatedOrders.map(item => (
              <tr key={`${item.order._id}-${item._id}`} className='text-center'>
                <td className='px-7 py-3 whitespace-nowrap border'>{item.name}</td>
                <td className='px-7 py-3 whitespace-nowrap border'>{item.order.user?.name}</td>
                <td className='px-7 py-3 whitespace-nowrap'>
                  {new Date(item.order.createdAt).toLocaleDateString('us', { year: 'numeric', month: 'long', day: '2-digit' })}
                </td>
                <td className='px-7 py-3 whitespace-nowrap'>
                  {new Date(item.order.shippingAddress.borrowingDate).toLocaleDateString('us', { year: 'numeric', month: 'long', day: '2-digit' })}
                </td>
                <td className='px-7 py-3 whitespace-nowrap'>
                  {new Date(item.order.shippingAddress.returnDate).toLocaleDateString('us', { year: 'numeric', month: 'long', day: '2-digit' })}
                </td>
                <td className={`px-7 py-3 whitespace-nowrap border ${item.status === 'Cancel' ? 'text-red-500' : ''}`}>{item.status}</td>
                <td className='px-7 py-3 whitespace-nowrap border'>
                  <button
                    onClick={() => openModal(item.order, item)}
                    className=' text-back rounded-md px-3 py-1 mx-1 hover:bg-yellow-500'>
                    <CiEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(item.order._id)}
                    className=' text-back rounded-md px-3 py-1 mx-1 hover:bg-red-700'>
                    <MdOutlineDelete />
>>>>>>> 823203878becbd0a4ccb34da099ae7c8865cb07e
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={7} className='text-gray-400 text-xl text-center'>No items in your list</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
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
            maxWidth: '800px',
            className: 'content-wrapper'
          }
        }}
      >
<<<<<<< HEAD
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
            <div className="md:w-2/3 p-4">
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
                <p>Borrow Date: {new Date(selectedOrder.shippingAddress.borrowingDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                <p>Return Date: {new Date(selectedOrder.shippingAddress.returnDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Status:</h3>
                <select
                  value={selectedOrder.status}
                  onChange={handleStatusChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="Confirm">Confirm</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancel">Cancel</option>
                </select>
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 mt-2 rounded mr-2" onClick={handleUpdateStatus}>Update Status</button>
              </div>
            </div>
            <div className="md:w-1/2 bg-gray-100 p-5 mt-5 rounded-md" style={{ maxHeight: '450px', overflowY: 'auto' }}>
              <h3 className="text-xl font-semibold mb-4">Summary</h3>
              <table className="w-full border-collapse">
=======
         {selectedOrder && selectedItem && (
        <div className="flex flex-col md:flex-row justify-center items-start">
            <div className="md:w-1/3 p-4">
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
      <strong><span className="font-semibold">Item Name:</span> {selectedItem.name}</strong>
      <p><span className="font-semibold">Order ID:</span> {selectedOrder._id}</p>
      <p><span className="font-semibold">User Name:</span> {selectedOrder.user?.name}</p>
      <p><span className="font-semibold">Status:</span> {selectedItem.status}</p>
      <p><span className="font-semibold">Request Date:</span> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString('us', { year: 'numeric', month: 'long', day: '2-digit' }) : 'N/A'}</p>
      <p><span className="font-semibold">Borrow Date:</span> {selectedOrder.shippingAddress?.borrowingDate ? new Date(selectedOrder.shippingAddress.borrowingDate).toLocaleDateString('us', { year: 'numeric', month: 'long', day: '2-digit' }) : 'N/A'}</p>
      <p><span className="font-semibold">Return Date:</span> {selectedOrder.shippingAddress?.returnDate ? new Date(selectedOrder.shippingAddress.returnDate).toLocaleDateString('us', { year: 'numeric', month: 'long', day: '2-digit' }) : 'N/A'}</p>
      <div className="mt-4">
              <div className="mb-4">
                <h3><span className="font-semibold">Status: </span>
                  <select
                    className="px-3 py-1 border rounded-md"
                    value={selectedItem.status}
                    onChange={(e) => handleUpdateItemStatus(selectedItem._id, e.target.value)}>
                    <option value="Confirm">Confirm</option>
                    <option value="Cancel">Cancel</option>
                    <option value="Pending">Pending</option>
                  </select>
                </h3>
              </div>
            </div>
            </div>
            <div className="md:w-2/3 bg-gray-100 p-5 mt-5 rounded-md" style={{ maxHeight: '450px', overflowY: 'auto' }}>
              <h3 className="text-xl font-semibold mb-4">Summary</h3>
              <table className="w-full border-collapse ">
>>>>>>> 823203878becbd0a4ccb34da099ae7c8865cb07e
                <thead>
                  <tr>
                    <th className="text-left px-10">Product</th>
                    <th className="text-center">Quantity</th>
                  </tr>
                </thead>
                <tbody>
<<<<<<< HEAD
                  {selectedOrder.orderItems?.map(item => (
                    <tr key={item._id} className="border-b border-gray-400">
                      <td className='px-7 py-3 whitespace-nowrap'>
                        <img src={item.image} alt={item.name} className="w-20 h-15 object-cover mr-4" />
                        <span className="text-center px-3">{item.name}</span>
                      </td>
                      <td className="text-center">{item.qty}</td>
=======
                  {selectedOrder && selectedItem && (
                    <tr key={selectedItem._id} className="border-b border-gray-400">
                      <td className='px-7 py-3 whitespace-nowrap'>
                        <img src={selectedItem.image} alt={selectedItem.name} className="w-20 h-15 object-cover mr-4" />
                        <span className="text-center px-3">{selectedItem.name}</span>
                      </td>
                      <td className="text-center">{selectedItem.qty}</td>
>>>>>>> 823203878becbd0a4ccb34da099ae7c8865cb07e
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

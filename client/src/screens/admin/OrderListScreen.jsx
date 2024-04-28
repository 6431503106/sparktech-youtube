import React, { useState, useEffect } from 'react';
import Spinner from "../../components/Spinner";
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useGetOrdersQuery, useUpdateOrderStatusMutation} from '../../slices/orderApiSlice';
import { RxCross2 } from "react-icons/rx";
import Modal from 'react-modal';
import TablePagination from '@mui/material/TablePagination';

export default function OrderListScreen() {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery()
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");
 
  useEffect(() => {
    refetch();
  }, [orders]);

  useEffect(() => {
    if (!isLoading && orders) {
      handleSearchFilter();
    }
  }, [keyword, orders]);

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
      toast.error(error?.data?.message || error?.error)
  }

  const handleSearchFilter = () => {
    const filteredOrders = orders.filter(order =>
      order._id.toLowerCase().includes(keyword.toLowerCase()) ||
      order.user.name.toLowerCase().includes(keyword.toLowerCase()) ||
      order.status.toLowerCase().includes(keyword.toLowerCase())
    );
  
    setFilteredOrders(filteredOrders);
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value; 
    setSelectedStatus(newStatus); 

    setSelectedOrder(prevState => ({
      ...prevState,
      status: newStatus
    }));
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
      toast.success(`Status updated to ${status}`);
      refetch()
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
    setSelectedStatus(null); // Reset selected status
  };

  // Calculate indexes
  const indexOfLastOrder = (page + 1) * rowsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - rowsPerPage;
  const visibleOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - orders.length);

  return (
    <div className="mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Request List</h2>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex justify-between mb-2 sm:flex">
            <input
              type="text"
              placeholder="Search"
              className="ml-2 px-5 rounded-md bg-gray-100 text-back"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
            <button className="bg-red-500 text-white py-1 px-4 rounded-md ml-2" onClick={handleSearchFilter}>
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          {/* Table Header */}
          <thead>
            {/* Table Header Rows */}
            <tr className="bg-gray-200">
              <th className="px-6 py-1 bg-gray-200 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border">ID</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border">User</th>
              <th className="px-6 py-3 bg-red-100 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border">Request Date</th>
              <th className="px-6 py-3 bg-red-100 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border">Borrow Date</th>
              <th className="px-6 py-3 bg-red-100 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border">Return Date</th>
              <th className="px-6 py-3 bg-gray-100 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border">Status</th>
              <th className="px-6 py-3 bg-gray-200 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider border">Actions</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {/* Visible Orders */}
            {visibleOrders.map((order) => (
              <tr key={order._id} className='text-center'>
                <td  className='px-7 py-3 whitespace-nowrap border'>{order._id}</td>
                <td  className='px-7 py-3 whitespace-nowrap border'>{order.user?.name}</td>
                <td  className='px-7 py-3 whitespace-nowrap border'>{new Date(order.createdAt).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                <td  className='px-7 py-3 whitespace-nowrap border'>{new Date(order.shippingAddress.borrowingDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                <td  className='px-7 py-3 whitespace-nowrap border'>{new Date(order.shippingAddress.returnDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                <td className={`px-7 py-3 whitespace-nowrap border ${order.status === 'Cancel' ? 'text-red-500' : ''}`}>{order.status}</td>
                <td  className='px-7 py-3 whitespace-nowrap border'>
                  <button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded' onClick={() => openModal(order)}>Edit</button>
                </td>
              </tr>
            ))}
            {/* Empty Rows */}
            {emptyRows > 0 && (
              <tr style={{ height: 53 * emptyRows }}>
                <td colSpan={7} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {/* Modal for editing order */}
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
                <p>Borrow Date:{new Date(selectedOrder.shippingAddress.borrowingDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                <p>Return Date:{new Date(selectedOrder.shippingAddress.returnDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
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
            <div className="md:w-1/2 bg-gray-100 p-5 mt-5" style={{ maxHeight: '450px', overflowY: 'auto'}}>
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

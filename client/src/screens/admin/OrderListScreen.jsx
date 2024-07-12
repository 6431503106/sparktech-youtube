import React, { useState, useEffect } from 'react';
import Spinner from "../../components/Spinner";
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useGetOrdersQuery, useUpdateOrderItemStatusMutation,useDeleteOrderMutation} from '../../slices/orderApiSlice';
import Modal from 'react-modal';
import TablePagination from '@mui/material/TablePagination';
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";

Modal.setAppElement('#root');

export default function OrderListScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrderItemStatus] = useUpdateOrderItemStatusMutation();

  useEffect(() => {
    if (!isLoading && orders) {
      handleSearchFilter();
    }
  }, [keyword, orders]);

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
      toast.success(`Order status updated to ${status}`);
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
            Search
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
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
            maxWidth: '800px' // Increase the max width to match OrderScreen
          }
        }}
      >
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
                <thead>
                  <tr>
                    <th className="text-left px-10">Product</th>
                    <th className="text-center">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder && selectedItem && (
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

import React, { useState } from 'react';
import Spinner from "../../components/Spinner";
import { toast } from 'react-toastify';
import { useGetOrdersQuery, useUpdateOrderStatusMutation} from '../../slices/orderApiSlice';
import { RxCross2 } from "react-icons/rx";
import Modal from 'react-modal';

export default function OrderListScreen() {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
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
    if (!selectedOrder || !selectedStatus) {
      // ในกรณีที่ไม่ได้เลือกคำสั่งหรือสถานะ
      toast.error('Please select an order and a status.');
      return;
    }
  
    // เรียกใช้งานฟังก์ชันอัปเดตสถานะ
    updateOrderStatusHandler(selectedOrder._id, selectedStatus);
  };
  
  const updateOrderStatusHandler = async (orderId, status) => {
    try {
      await updateOrderStatus({ orderId, status });
      toast.success(`Order status updated to ${status}`);
      refetch();
      closeModal(); // เมื่ออัปเดตสถานะเสร็จสิ้น ปิด Modal
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

  return (
    <div className="mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Request List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">ID</th>
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">User</th>
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Request Date</th>
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Borrow Date</th>
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Return Date</th>
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Status</th>
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map(order => (
              <tr key={order._id} className='text-center'>
              <td className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>{order._id}</td>
              <td className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>{order.user?.name}</td>
              <td className='border p-2'>{new Date(order.createdAt).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
              <td className='border p-2'>{new Date(order.shippingAddress.borrowingDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
              <td className='border p-2'>{new Date(order.shippingAddress.returnDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
              <td className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>{order.status}</td>
              <td className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>
                {/* Use arrow function to pass order to openModal */}
                <button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded' onClick={() => openModal(order)}>Edit</button>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
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
        value={selectedOrder.status} // ให้ค่าเริ่มต้นเป็นสถานะปัจจุบันของคำสั่งซื้อ
        onChange={(e) => {
          const newStatus = e.target.value; // รับค่าที่ผู้ใช้เลือก
          updateOrderStatus({ orderId: selectedOrder._id, status: newStatus }); // เรียกใช้งาน mutation เพื่ออัปเดตสถานะ
        }}
        className="w-full border border-gray-300 rounded-md px-3 py-2"
      >
        <option value="Confirm">Confirm</option>
        <option value="Pending">Pending</option>
        <option value="Cancel">Cancel</option>
      </select>
      <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2" onClick={handleUpdateStatus}>Update Status</button>
              </div>
            </div>
            <div className="md:w-1/2 bg-gray-100 p-5" style={{ maxHeight: '450px', overflowY: 'auto', marginTop: '10px'}}>
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
        {/* Close button */}
        

      </Modal>
    </div>
  );
}
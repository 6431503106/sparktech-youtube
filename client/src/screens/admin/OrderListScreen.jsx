import React, { useState } from 'react';
import Spinner from "../../components/Spinner";
import { toast } from 'react-toastify';
import { useGetOrdersQuery } from '../../slices/orderApiSlice';
import Modal from 'react-modal'; // Import Modal component

export default function OrderListScreen() {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [isOpen, setIsOpen] = useState(false); // Define isOpen state
  const [selectedOrder, setSelectedOrder] = useState(null); // State to keep track of selected order
  const [selectedStatus, setSelectedStatus] = useState(null); // State to keep track of selected status

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    toast.error(error.message);
  }

  const openModal = (order) => {
    setSelectedOrder(order); // Set selected order
    setIsOpen(true); // Open modal
  };

  const closeModal = () => {
    setSelectedOrder(null); // Reset selected order
    setIsOpen(false); // Close modal
    setSelectedStatus(null); // Reset selected status
  };
  

  const updateOrderStatus = async (orderId) => {
    try {
      if (!selectedStatus) {
        toast.error("Please select a status");
        return;
      }
  
      const updatedOrder = {
        id: orderId,
        status: selectedStatus
      };
  
      await updateOrderStatusMutation(updatedOrder).unwrap();
      
      closeModal(); // ปิด Modal หลังจากทำการอัปเดตสถานะเสร็จสิ้น
      toast.success(`Status updated to ${selectedStatus}`);
    } catch (error) {
      // กรณีที่เกิดข้อผิดพลาดในการอัปเดตสถานะ
      toast.error("Failed to update status");
    }
  };
  

  return (
    <div className="mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Request List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">ID</th>
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">Request Date</th>
              <th className="border border-gray-300 py-2 px-4 sm:px-6 md:px-8">User</th>
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
                <td className='border p-2'>{new Date(order.createdAt).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                <td className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>{order.user?.name}</td>
                <td className='border p-2'>{new Date(order.shippingAddress.borrowingDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                <td className='border p-2'>{new Date(order.shippingAddress.returnDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                <td className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>{selectedStatus}</td>
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
        {/* Render selected order details */}
        {selectedOrder && (
          <div className="flex flex-col md:flex-row justify-center items-start">
            <div className="md:w-2/3 p-4">
              <h2 className="text-3xl font-semibold mb-4">Details</h2>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Request ID:</h3>
                <p>{selectedOrder._id}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Request Date:</h3>
                <p>{new Date(selectedOrder.createdAt).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Information:</h3>
                <p>Username: {selectedOrder.user?.name}</p>
                {/* <p>Email: {selectedOrder.user?.email}</p> แสดง email ที่นี่ */}
                <p>Reason:{selectedOrder.shippingAddress.reason}</p>
                <p>Borrow Date:{new Date(selectedOrder.shippingAddress.borrowingDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                <p>Return Date:{new Date(selectedOrder.shippingAddress.returnDate).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Status:</h3>
                <form className="w-full max-w-sm" onSubmit={(e) => { e.preventDefault(); updateOrderStatus(); }}>
                    <label className="inline-flex items-center mt-3">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-5 w-5 text-green-500" 
                        onChange={() => setSelectedStatus("Confirmed")} 
                        checked={selectedStatus === "Confirmed"}  // ตรวจสอบว่า selectedStatus เป็น "confirm" หรือไม่
                      />
                      <span className="ml-2 text-blue-500 font-bold">Confirm</span>
                    </label>
                    <label className="inline-flex items-center mt-3">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-5 w-5 text-yellow-500" 
                        onChange={() => setSelectedStatus("Borrowed")} 
                        checked={selectedStatus === "Borrowed"}  // ตรวจสอบว่า selectedStatus เป็น "borrow" หรือไม่
                      />
                      <span className="ml-2 text-green-700 font-bold">Borrowed</span>
                    </label>
                    <label className="inline-flex items-center mt-3">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-5 w-5 text-blue-500" 
                        onChange={() => setSelectedStatus("Returned")} 
                        checked={selectedStatus === "Returned"}  // ตรวจสอบว่า selectedStatus เป็น "return" หรือไม่
                      />
                      <span className="ml-2 text-gray-400 font-bold">Returned</span>
                    </label>
                    <label className="inline-flex items-center mt-3">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-5 w-5 text-red-500" 
                        onChange={() => setSelectedStatus("Cancel")} 
                        checked={selectedStatus === "Cancel"}  // ตรวจสอบว่า selectedStatus เป็น "cancel" หรือไม่
                      />
                      <span className="ml-2 text-red-500 font-bold">Cancel</span>
                    </label>
                      <div className="flex">
                      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2">Update Status</button>
                      <div className="ml-auto">
                        <button onClick={closeModal} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mt-2 hover:bg-gray-400">Close</button>
                      </div>
                  </div>

                </form>

              </div>
            </div>
            <div className="md:w-1/2 bg-gray-100 p-5">
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

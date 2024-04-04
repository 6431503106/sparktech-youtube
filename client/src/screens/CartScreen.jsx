import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { removeFromCart } from '../slices/cartSlice'
import { saveShippingAddress } from '../slices/cartSlice'
import { toast } from 'react-toastify'
import { clearCartItems } from '../slices/cartSlice'
import { useCreateOrderMutation } from '../slices/orderApiSlice';


export default function CartScreen() {
    const cart = useSelector(state => state.cart)
    const { cartItems } = cart;
    const { shippingAddress } = cart
    const [address, setAddress] = useState(shippingAddress?.address || "")
    const [reason, setReason] = useState(shippingAddress?.address || "")
    const [city, setCity] = useState(shippingAddress?.city || "")
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "")
    const [country, setCountry] = useState(shippingAddress?.country || "")
    const [borrowingDate, setBorrowingDate] = useState("")

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [createOrder, { isLoading }] = useCreateOrderMutation()

    const totalItems = cartItems.reduce((acc, item) => acc + +item.qty, 0);

    const handleDeleteItem = id => {
        dispatch(removeFromCart(id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // กำหนด borrowingDateObject จาก borrowingDate ที่ผู้ใช้เลือก
        const borrowingDateObject = new Date(borrowingDate);
    
        // กำหนด returnDateObject โดยใช้ borrowingDateObject และเพิ่ม 7 วัน
        const returnDateObject = new Date(borrowingDateObject);
        returnDateObject.setDate(returnDateObject.getDate() + 7);
    
        // สร้าง Object ของ shippingAddress โดยรวมทุกข้อมูลที่ผู้ใช้กรอกและ returnDate ที่คำนวณได้
        const shippingAddressData = {
            address,
            city,
            postalCode,
            country,
            borrowingDate,
            returnDate: returnDateObject,
            reason
        };
    
        try {
            // เรียกใช้งาน mutation เพื่อสร้างคำสั่งซื้อ
            const res = await createOrder({
                orderItems: cartItems,
                shippingAddress: shippingAddressData,
            }).unwrap();
    
            // ล้างรายการสินค้าในตะกร้า
            dispatch(clearCartItems());
    
            // แสดงข้อความ "Order Placed!"
            toast.success("The loan request is complete!");
    
            // นำผู้ใช้ไปยังหน้ารายละเอียดคำสั่งซื้อที่สร้างขึ้นใหม่
            navigate("/profile");
        } catch (err) {
            // แสดงข้อความผิดพลาดหากมีข้อผิดพลาดเกิดขึ้น
            toast.error(err?.data?.message || err.error);
        }
    };
    
    const handleCancel = () => {
        navigate("/")
    }
    return (
        <div className="flex flex-col md:flex-row justify-center items-start mx-auto">
            <div>
                <Link to={'/'}>
                    <button className="bg-gray-800 text-white px-4 py-2 rounded-md mb-4">Back</button>
                </Link>
            </div>
            <div className="md:w-2/3 p-4">
                <h2 className="text-2xl font-semibold mb-4">Cart</h2>
                {cartItems.length !== 0 ?
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cartItems.map(item => (
                            <div className='border border-gray-300 p-4 flex items-center' key={item._id}>
                                <div>
                                    <img src={item.image} alt={item.name} className='w-16 h-16 object-contain mr-4' />
                                    <h3 className='text-lg font-semibold'>{item.name}</h3>
                                    <p className='text-gray-600'>Quantity: {item.qty}</p>
                                    <button className='text-red-500 hover:text-red-700' onClick={() => handleDeleteItem(item._id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div> : (
                        <p className='text-gray-400 text-xl'>Your Cart is empty.</p>
                    )}
            </div>

                <div className="md:w-1/3 bg-gray-100 p-4 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Subtotal</h2>
                    <p className="text-gray-600">Total Items: {totalItems} </p>
                </div>
                <div className="container mx-auto mt-8 mb-28 p-4 max-w-md">
                    <h3 className="text-xl font-semibold">Information</h3>
                    <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                <label htmlFor="reason" className="text-gray-700">
                    Reason:
                </label>
                <input
                    type="text"
                    id="reason"
                    className="bg-white border border-gray-300 p-2 rounded-md mt-2 w-full"
                    placeholder="Enter your reason"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                />
                </div>

                <div className="mb-4">
                    <label htmlFor="borrowingDate" className="text-gray-700">
                        Borrowing Date:
                    </label>
                    <input
                        type="date"
                        id="borrowingDate"
                        className="bg-white border border-gray-300 p-2 rounded-md mt-2 w-full"
                        value={borrowingDate}
                        onChange={e => setBorrowingDate(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                <label htmlFor="returnDate" className="text-gray-700">
                    Return Date:
                </label>
                <p>{borrowingDate ? new Date(new Date(borrowingDate).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''}</p>
                </div>

                <div className="flex justify-between">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-6000"
                        onClick={handleSubmit}
                    >
                        Continue
                    </button>
                    <button
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
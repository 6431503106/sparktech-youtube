import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCartItems } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import { useCreateOrderMutation } from '../slices/orderApiSlice';
<<<<<<< HEAD
import '../Header.css'; // เพิ่มไฟล์ CSS
=======
import { v4 as uuidv4 } from 'uuid';
import { useGetProductsQuery } from '../slices/productsApiSlice';
>>>>>>> 823203878becbd0a4ccb34da099ae7c8865cb07e


export default function CartScreen() {
    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;
    const { shippingAddress } = cart;
    const [reason, setReason] = useState(shippingAddress?.address || "");
    const [borrowingDate, setBorrowingDate] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [createOrder, { isLoading }] = useCreateOrderMutation();

    const totalItems = cartItems.reduce((acc, item) => acc + +item.qty, 0);
    const { data: products } = useGetProductsQuery(); // Fetch products

    const handleDeleteItem = id => {
        dispatch(removeFromCart(id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            toast.error("Your cart is empty.");
            return;
        }
        if (!reason) {
            toast.error("Please fulfill your reason.");
            return;
        }
        if (!borrowingDate) {
            toast.error("Please fulfill borrowing date.");
            return;
        }

        const borrowingDateObject = new Date(borrowingDate);
        const returnDateObject = new Date(borrowingDateObject);
        returnDateObject.setDate(returnDateObject.getDate() + 7);

        const shippingAddressData = {
            borrowingDate,
            returnDate: returnDateObject,
            reason
        };

        // Check stock availability
        const orderItems = cartItems.map(item => {
            const product = products.find(p => p._id === item._id);
            if (product && item.qty > product.countInStock) {
                toast.error(`Not enough stock for ${product.name}. Available: ${product.countInStock}`);
                throw new Error(`Not enough stock for ${product.name}`);
            }
            return {
                ...item,
                itemId: uuidv4() // Generate a new UUID for each item
            };
        });

        try {
            const res = await createOrder({
                orderItems,
                shippingAddress: shippingAddressData,
            }).unwrap();

            // Update stock after creating order
            orderItems.forEach(async item => {
                const product = products.find(p => p._id === item._id);
                if (product) {
                    await updateProductStock(product._id, product.countInStock - item.qty);
                }
            });

            dispatch(clearCartItems());
            toast.success("The loan request is complete!");
            navigate("/profile");
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const updateProductStock = async (id, newStock) => {
        // Call your update product mutation or API here
        // For example:
        // await updateProduct({ id, countInStock: newStock });
    };

    const handleCancel = () => {
        navigate("/");
    }
    
    return (
        <div class="content-wrapper flex justify-between">
            <div>
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

                <div >
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
                        Borrowing Date: DD/MM/YY
                    </label>
                    <input
                        type="date"
                        id="borrowingDate"
                        className="bg-white border border-gray-300 p-2 rounded-md mt-2 w-full uppercase"
                        value={borrowingDate}
                        onChange={e => setBorrowingDate(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                <label htmlFor="returnDate" className="text-gray-700">
<<<<<<< HEAD
                    Return Date: DD/MM/YY
=======
                    Return Date: -
>>>>>>> 823203878becbd0a4ccb34da099ae7c8865cb07e
                </label>
                <p>{borrowingDate ? new Date(new Date(borrowingDate).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('th', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''}</p>
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
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { removeFromCart } from '../slices/cartSlice'
import { Link } from 'react-router-dom'


export default function CartScreen() {
    const { cartItems, taxPrice, shippingPrice, totalPrice, itemsPrice } = useSelector(state => state.cart)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    

    const totalItems = cartItems.reduce((acc, item) => acc + +item.qty, 0)

    const handleDeleteItem = id => {
        dispatch(removeFromCart(id))
    }

    const checkoutHandler = () => {
        navigate("/login?redirect=/shipping")
    }
    const handleCancel = () => {
        // ยกเลิกการกรอกข้อมูลและกลับไปยังหน้าหลักหรือหน้าก่อนหน้านี้
        navigate("/")
    }

    return (
        <div className="flex flex-col md:flex-row justify-center items-start">
           <Link to ={'/'}>
                <button className="bg-gray-800 text-white px-4 py-2 rounded-md mb-4">Go Back</button>
            </Link>
            <div className="md:w-2/3 p-4">
<<<<<<< HEAD
                <h2 className="text-2xl font-semibold mb-4">Cart</h2>
=======
                <h2 className="text-2xl font-semibold mb-4">List Of Products</h2>
>>>>>>> 805094443f821ece5007225c3edc000b6e568771
                {cartItems.length !== 0 ?
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cartItems.map(item => (
                            <div className='border border-gray-300 p-4 flex items-center' key={item._id}
                            >
                                <div>
                                    <img src={item.image} alt={item.name} className='w-16 h-16 object-contain mr-4' />
                                    <h3 className='text-lg font-semibold'>{item.name}</h3>
<<<<<<< HEAD
=======
                                    {/*<p className='text-gray-600'>${item.price.toFixed(2)}</p>*/}
>>>>>>> 805094443f821ece5007225c3edc000b6e568771
                                    <p className='text-gray-600'>Quantity: {item.qty}</p>
                                    <button className='text-red-500 hover:text-red-700' onClick={() => handleDeleteItem(item._id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div> : (
                        <p className='text-gray-400 text-xl'>Your Cart is empty.</p>
                    )}
            </div>
            {cartItems.length !== 0 &&
<<<<<<< HEAD
                <div className="md:w-1/3 bg-gray-100 p-4 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Subtotal</h2>
                        <p className="text-gray-600">Total Items: {totalItems} </p>
                    </div>
                    <div>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600 mr-2"
                            onClick={checkoutHandler}
                            disabled={cartItems.length === 0}
                        >
                            Continue
                        </button>
                        <button
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mt-2 hover:bg-gray-400"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
=======
                <div className="md:w-1/3 bg-gray-100 p-4">
                    <h2 className="text-xl font-semibold"></h2>
                   <p className="text-gray-600">Total Items: {totalItems} </p>
                    {/*<p className="text-gray-600">Items Items: {itemsPrice} </p>
                    <p className="text-gray-600">Tax: ${taxPrice} </p>
                    <p className="text-gray-600">ShippingPrice: ${shippingPrice} </p>
                    <p className="text-gray-600">Total Price: ${totalPrice} </p>*/}
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
                        onClick={checkoutHandler}
                        disabled={cartItems.length === 0}
                    >
                        Add to Cart
                    </button>
>>>>>>> 805094443f821ece5007225c3edc000b6e568771
                </div>}
        </div>
    )
}

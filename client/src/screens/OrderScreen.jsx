import React from 'react'
import { useDeliverOrderMutation, useGetOrderDetailsQuery, usePayWithStripeMutation } from '../slices/orderApiSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'

export default function OrderScreen() {
    const navigate = useNavigate()
    const { id: orderId } = useParams()
    const { userInfo } = useSelector(state => state.user)
    const { data: order, isLoading, error, refetch } = useGetOrderDetailsQuery(orderId)

    const [payWithStripe, { isLoading: loadingStripe }] = usePayWithStripeMutation()
    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation()

    if (error) {
        return toast.error(error.message)
    }

    if (isLoading) {
        return <Spinner />
    }


    const { shippingAddress, user, isDelivered, orderItems, shippingPrice, taxPrice } = order

    const calculateTotal = orderItems => {
        return orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0)
    }

    const handleStripePayment = async (orderItems) => {
        try {
            const res = await payWithStripe(orderItems).unwrap()
            window.location.href = res.url
        } catch (error) {
            toast.error(error?.data?.message || error?.error)
        }
    }

    const deliverOrderHandler = async (orderId) => {
        await deliverOrder(orderId)
        refetch()
    }

    return (
        <div className="flex flex-col md:flex-row justify-center items-start">
            <div className="md:w-2/3 p-4">
                <h2 className="text-3xl font-semibold mb-4">Details</h2>
                <div className="mb-4">
<<<<<<< HEAD
                    <h3 className="text-lg font-semibold mb-2">Request ID:</h3>
                    <p>{orderId}</p>
                </div>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Borrowing information:</h3>
=======
                    <h3 className="text-lg font-semibold mb-2">Order Number:</h3>
                    <p>{orderId}</p>
                </div>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Shipping Details:</h3>
                    <p>Name: {user.name}</p>
>>>>>>> 805094443f821ece5007225c3edc000b6e568771
                    <p>Email: {user.email}</p>
                    <p>Username: {user.name}</p>
                    <p>Reason: {shippingAddress.address}</p>
                </div>
                <div className="mb-4">
<<<<<<< HEAD
                    <h3 className="text-lg font-semibold mb-2">Borrowing Status:</h3>
                    <p className={isDelivered ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>{isDelivered ? "Confirm to Borrowed" : "Not Confirm"}</p>
=======
                    <h3 className="text-lg font-semibold mb-2">Order Status:</h3>
                    <p className={isDelivered ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>{isDelivered ? "Delivered" : "Not Delivered"}</p>
>>>>>>> 805094443f821ece5007225c3edc000b6e568771
                </div>
            </div>

            <div className="md:w-1/3 bg-gray-100 p-4">
                <h3 className="text-xl font-semibold mb-4">Borrowing Summary</h3>
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left">Product</th>
                            <th className="text-right">Quantity</th>
                            <th className="text-right">Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItems?.map(item => (
                            <tr key={item._id} className="border-b border-gray-400">
                                <td className="text-left">{item.name}</td>
                                <td className="text-right">{item.qty}</td>
                                <td className="text-right">${(item.price * item.qty).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
                <div className="mt-4">
                    <p className="text-right font-semibold">Total: ${+calculateTotal(orderItems).toFixed(2) + +shippingPrice + +taxPrice}</p>
                </div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600 mr-3"
                    onClick={() => handleStripePayment(orderItems)}
                >
                    Pay with Stripe
                </button>
                {userInfo.isAdmin && !order.isDelivered && <button
                    className="bg-gray-800 text-white px-4 py-2 rounded-md mt-4 hover:bg-gray-950"
                    onClick={() => deliverOrderHandler(orderId)}
                >
                    Mark as Delivered
                </button>}
                {loadingStripe && <Spinner />}
            </div>
        </div >
    )
}
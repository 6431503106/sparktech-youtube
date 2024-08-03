import mongoose from "mongoose"
import Order from "../models/orderModel.js"
import asyncHandler from "express-async-handler"

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    borrowingDate,
    reason,
    returnDate,
    
  } = req.body

  if (orderItems?.length === 0) {
    res.status(400)
    throw new Error("No Order Items")
  } else {
    const order = new Order({
      orderItems: orderItems.map(item => ({
        ...item,
        product: item._id,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      borrowingDate,
      reason,
      returnDate,
    })
    const createdOrder = await order.save()

    res.status(201).json(createdOrder)
  }
})

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  )

  if (order) {
    res.status(200).json(order)
  } else {
    res.status(404)
    throw new Error("Order not found")
  }
})

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("user")
  res.json(orders)
})

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "id name")
  res.send(orders)
})

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  }
  res.status(404)
  throw new Error("Order Not Found")
})

const deleteOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  const order = await Order.findById(orderId);

  if (order) {
    await Order.deleteOne({ _id: order._id });
    res.status(204).json({ message: "Order Deleted" });
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});


const borrowProduct = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    order.borrowingDate = new Date()
    // คำนวณวันที่คืนโดยเพิ่ม 7 วัน
    const returnDate = new Date()
    returnDate.setDate(returnDate.getDate() + 7)
    order.returnDate = returnDate

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error("Order Not Found")
  }
})

const updateOrderItemStatus = asyncHandler(async (req, res) => {
  const { orderId, itemId } = req.params;
  const { status } = req.body;

  try {
    // Find the order and update the status of the specified item
    const order = await Order.findOneAndUpdate(
      { 
        _id: orderId,
        'orderItems._id': itemId
      },
      {
        $set: {
          'orderItems.$.status': status
        }
      },
      { new: true } // To return the updated order
    );

    if (!order) {
      return res.status(404).json({ message: 'Order or item not found' });
    }

    res.json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

export {
  addOrderItems,
  getOrderById,
  getUserOrders,
  getOrders,
  updateOrderToDelivered,
  borrowProduct,
  deleteOrder,
  updateOrderItemStatus,
}
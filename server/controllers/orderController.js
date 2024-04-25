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

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export {
  addOrderItems,
  getOrderById,
  getUserOrders,
  getOrders,
  updateOrderToDelivered,
  borrowProduct,
  updateOrderStatus,
}
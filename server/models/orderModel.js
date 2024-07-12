import mongoose from "mongoose"
import { v4 as uuidv4 } from 'uuid';

const OrderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        itemId: { type: String, required: true, default: uuidv4 },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        status: { type: String, enum: ["Confirm", "Pending", "Cancel"], default: "Pending", require:true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    shippingAddress: {
      
      borrowingDate: { type: Date, required: true },
      returnDate: { type: Date, required: true },
      reason: { type: String, required: true } 
  },
  },
  {
    timestamps: true,
  }
)

const Order = mongoose.model("Order", OrderSchema)

export default Order

import { apiSlice } from "./apiSlice";
import { BACKEND_URL, ORDERS_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createOrder: builder.mutation({
      query: order => {
        // Extract borrowingDate from order object
        const { borrowingDate, ...rest } = order;

        // Calculate returnDate by adding 7 days to borrowingDate
        const returnDate = new Date(borrowingDate);
        returnDate.setDate(returnDate.getDate() + 7);

        return {
          url: ORDERS_URL,
          method: "POST",
          body: {
            ...rest,
            borrowingDate,
            returnDate,
          },
        };
      },
    }),
    getOrderDetails: builder.query({
      query: id => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getUserOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/user-orders`,
      }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    payWithStripe: builder.mutation({
      query: orderItems => ({
        url: `${BACKEND_URL}/create-checkout-session`,
        method: "POST",
        body: orderItems,
      }),
    }),
    deliverOrder: builder.mutation({
      query: orderId => ({
        url: `${ORDERS_URL}/deliver/${orderId}`,
        method: "PATCH",
      }),
    }),
    updateOrderStatus: builder.mutation({
      query: order => ({
        url: `${ORDERS_URL}/update/${order.id}`, // แก้ตรงนี้เป็น url ที่รองรับการรับข้อมูลด้วย id
        method: "PUT",
        body: order,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useGetUserOrdersQuery,
  usePayWithStripeMutation,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useUpdateOrderStatusMutation, // เปลี่ยนชื่อนี้เป็น useUpdateOrderMutation
} = orderApiSlice;
import Order from "@/models/order.model";

export const createOrderService = async (data: any) => {
  const order = await Order.create(data);
  return order.toObject();
};

export const getUserOrdersService = async (userId: string) => {
  const orders = await Order.find({ user: userId })
    .populate("products")
    .populate("user", "name email")
    .lean();
  return orders;
};

export const changeOrderStatusService = async (orderId: string, status: string) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  ).populate("products").lean();

  if (!order) throw new Error("Order not found");

  return order;
};

export const getAllOrdersService = async () => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("products")
    .lean();
  return orders;
};

export const getOrderByIdService = async (orderId: string) => {
  const order = await Order.findById(orderId).lean();

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

export const deleteOrderService = async (orderId: string) => {
  const order = await Order.findByIdAndDelete(orderId).lean();

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};


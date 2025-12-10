import { Request, Response } from "express";
import {
  createOrderService,
  getUserOrdersService,
  changeOrderStatusService,
  getAllOrdersService,
  getOrderByIdService,
  deleteOrderService
} from "@/services/order.service";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = await createOrderService(req.body);
    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ msg: err.message });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId!;
    const orders = await getUserOrdersService(userId);
    res.json(orders);
  } catch (err: any) {
    res.status(400).json({ msg: err.message });
  }
};

export const changeOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId!;
    const { status } = req.body;

    const order = await changeOrderStatusService(orderId, status);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ msg: err.message });
  }
};

export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await getAllOrdersService();
    res.json(orders);
  } catch (err: any) {
    res.status(400).json({ msg: err.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId!;

    const order = await getOrderByIdService(orderId);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ msg: err.message });
  }
};


export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId!;

    const deleted = await deleteOrderService(orderId);
    res.json({
      msg: "Order deleted successfully",
      deleted,
    });
  } catch (err: any) {
    res.status(400).json({ msg: err.message });
  }
};

import { Request, Response } from "express";
import {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService
} from "@/services/user.service";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await getUserByIdService(req.params.id!);
    res.json(user);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await updateUserService(req.params.id!, req.body);
    res.json(user);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deleted = await deleteUserService(req.params.id!);
    res.json({ message: "User deleted", deleted });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

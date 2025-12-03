import { Request, Response } from "express";
import {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService
} from "@/services/product.service";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await createProductService(req.body);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await getAllProductsService();
    res.json(products);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await getProductByIdService(req.params.id!);
    res.json(product);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await updateProductService(req.params.id!, req.body);
    res.json(product);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deleted = await deleteProductService(req.params.id!);
    res.json({ message: "Product deleted", deleted });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

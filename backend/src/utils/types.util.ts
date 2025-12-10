import mongoose, { Schema, Document } from 'mongoose';

export interface IPerson extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}
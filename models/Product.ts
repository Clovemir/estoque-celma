import mongoose, { Schema, models, model } from "mongoose";
// departments and related type live in a separate module that can safely
// be imported by client components. importing mongoose in a client bundle
// was causing runtime errors during hydration (see admin login bug).
import { DEPARTAMENTOS, Departamento } from "./ProductMeta";

export interface IProduct extends mongoose.Document {
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  departamento: Departamento;
  imagemUrl?: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    preco: { type: Number, required: true },
    estoque: { type: Number, required: true },
    departamento: {
      type: String,
      enum: DEPARTAMENTOS,
      required: true,
    },
    imagemUrl: { type: String },
    ativo: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Product =
  (models.Product as mongoose.Model<IProduct>) ||
  model<IProduct>("Product", ProductSchema);


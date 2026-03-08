import mongoose, { Schema, models, model } from "mongoose";

export const DEPARTAMENTOS = [
  "Estrutura",
  "Acabamento",
  "Hidráulica",
  "Elétrica",
  "Ferramentas",
  "Iluminação",
] as const;

export type Departamento = (typeof DEPARTAMENTOS)[number];

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


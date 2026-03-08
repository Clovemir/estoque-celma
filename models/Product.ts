// this module defines the mongoose `Product` model and associated types.
// in dev the client bundle was accidentally pulling in the entire file
// (and therefore `mongoose`) because a sibling module imported from
// `models/ProductMeta`. to avoid hydration errors we ensure that mongoose is
// only required on the server and that the browser can import this file
// without executing any of the database logic.

import type mongoose from "mongoose";
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

// helper to lazily create/return the model. the conditional check ensures the
// body is never executed in the browser; importing `mongoose` inside the
// branch prevents webpack from pulling it into a client bundle.
function getProductModel(): mongoose.Model<IProduct> {
  if (typeof window !== "undefined") {
    // running on client: return a dummy object so imports still succeed
    // but nothing attempts to call mongoose.
    return ({} as any) as mongoose.Model<IProduct>;
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mongoose = require("mongoose") as typeof import("mongoose");
  const { Schema, models, model } = mongoose;

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

  return (models.Product as mongoose.Model<IProduct>) ||
    model<IProduct>("Product", ProductSchema);
}

export const Product = getProductModel();


import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { productSchema } from "../schema";

interface Params {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "Banco de dados não configurado (MONGODB_URI ausente)." },
      { status: 500 }
    );
  }

  await connectToDatabase();
  const product = await Product.findById(params.id).lean();
  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "Banco de dados não configurado (MONGODB_URI ausente)." },
      { status: 500 }
    );
  }

  await connectToDatabase();
  const json = await req.json();

  const parsed = productSchema
    .partial({
      nome: true,
      descricao: true,
      preco: true,
      estoque: true,
      departamento: true,
      imagemUrl: true,
      ativo: true,
    })
    .safeParse({
      ...json,
      preco:
        typeof json.preco === "number" || json.preco === undefined
          ? json.preco
          : Number(json.preco),
      estoque:
        typeof json.estoque === "number" || json.estoque === undefined
          ? json.estoque
          : Number(json.estoque),
    });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updated = await Product.findByIdAndUpdate(params.id, parsed.data, {
    new: true,
  });

  if (!updated) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "Banco de dados não configurado (MONGODB_URI ausente)." },
      { status: 500 }
    );
  }

  await connectToDatabase();
  const deleted = await Product.findByIdAndDelete(params.id);
  if (!deleted) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}


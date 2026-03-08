import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { productSchema } from "./schema";

export async function GET() {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "Banco de dados não configurado (MONGODB_URI ausente)." },
      { status: 500 }
    );
  }

  await connectToDatabase();
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "Banco de dados não configurado (MONGODB_URI ausente)." },
      { status: 500 }
    );
  }

  await connectToDatabase();
  const json = await req.json();

  const parsed = productSchema.safeParse({
    ...json,
    preco: Number(json.preco),
    estoque: Number(json.estoque),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const created = await Product.create({
    ...data,
    imagemUrl: data.imagemUrl || undefined,
    ativo: data.ativo ?? true,
  });

  return NextResponse.json(created, { status: 201 });
}


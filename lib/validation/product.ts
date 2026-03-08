import { z } from "zod";
import { DEPARTAMENTOS } from "@/models/ProductMeta";

export const productSchema = z.object({
  nome: z.string().min(2, "Informe pelo menos 2 caracteres"),
  descricao: z.string().min(2, "Informe pelo menos 2 caracteres"),
  preco: z
    .number({
      invalid_type_error: "Preço deve ser um número",
    })
    .nonnegative("Preço não pode ser negativo"),
  estoque: z
    .number({
      invalid_type_error: "Estoque deve ser um número inteiro",
    })
    .int("Estoque deve ser inteiro")
    .nonnegative("Estoque não pode ser negativo"),
  departamento: z.enum(DEPARTAMENTOS, {
    errorMap: () => ({ message: "Selecione um departamento válido" }),
  }),
  imagemUrl: z
    .string()
    .url("Informe uma URL válida")
    .optional()
    .or(z.literal("")),
  ativo: z.boolean().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;


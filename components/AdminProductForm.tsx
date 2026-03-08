"use client";

import { useEffect, useState, FormEvent } from "react";
import { DEPARTAMENTOS } from "@/models/ProductMeta";
import { productSchema } from "@/lib/validation/product";
import type { ZodFormattedError } from "zod";

type Product = {
  _id?: string;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  departamento: string;
  imagemUrl?: string;
  ativo: boolean;
};

type Props = {
  initial?: Product | null;
  onSaved: () => void;
};

export function AdminProductForm({ initial, onSaved }: Props) {
  const [form, setForm] = useState<Product>({
    _id: initial?._id,
    nome: initial?.nome || "",
    descricao: initial?.descricao || "",
    preco: initial?.preco || 0,
    estoque: initial?.estoque || 0,
    departamento: initial?.departamento || DEPARTAMENTOS[0],
    imagemUrl: initial?.imagemUrl || "",
    ativo: initial?.ativo ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    ZodFormattedError<
      {
        nome: string;
        descricao: string;
        preco: number;
        estoque: number;
        departamento: string;
        imagemUrl?: string | undefined;
        ativo?: boolean | undefined;
      },
      string
    > | null
  >(null);

  useEffect(() => {
    if (initial) {
      setForm({
        _id: initial._id,
        nome: initial.nome,
        descricao: initial.descricao,
        preco: initial.preco,
        estoque: initial.estoque,
        departamento: initial.departamento,
        imagemUrl: initial.imagemUrl || "",
        ativo: initial.ativo,
      });
    }
  }, [initial]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const target = e.target;
    const { name, value } = target;
    const isCheckbox =
      target instanceof HTMLInputElement && target.type === "checkbox";

    setForm((prev) => ({
      ...prev,
      [name]:
        isCheckbox
          ? target.checked
          : name === "preco" || name === "estoque"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setFieldErrors(null);

    try {
      const parsed = productSchema.safeParse({
        nome: form.nome,
        descricao: form.descricao,
        preco: Number(form.preco),
        estoque: Number(form.estoque),
        departamento: form.departamento as (typeof DEPARTAMENTOS)[number],
        imagemUrl: form.imagemUrl,
        ativo: form.ativo,
      });

      if (!parsed.success) {
        setFieldErrors(parsed.error.format());
        setSaving(false);
        return;
      }

      const payload = {
        ...form,
      };

      const res = await fetch(
        form._id ? `/api/products/${form._id}` : "/api/products",
        {
          method: form._id ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Erro ao salvar produto");
        return;
      }

      onSaved();
      if (!form._id) {
        setForm((prev) => ({
          ...prev,
          _id: undefined,
          nome: "",
          descricao: "",
          preco: 0,
          estoque: 0,
          departamento: DEPARTAMENTOS[0],
          imagemUrl: "",
          ativo: true,
        }));
      }
    } catch (err) {
      console.error(err);
      setError("Erro inesperado ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Erro no upload da imagem");
        return;
      }

      const json = await res.json();
      setForm((prev) => ({ ...prev, imagemUrl: json.url }));
    } catch (err) {
      console.error(err);
      setError("Erro inesperado no upload da imagem");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1">Nome</label>
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Departamento</label>
          <select
            name="departamento"
            value={form.departamento}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            {DEPARTAMENTOS.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Descrição</label>
        <textarea
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1 text-sm min-h-[60px]"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1">Preço (R$)</label>
          <input
            type="number"
            step="0.01"
            name="preco"
            value={form.preco}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Estoque</label>
          <input
            type="number"
            name="estoque"
            value={form.estoque}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
            required
          />
        </div>
        <div className="flex items-center gap-2 mt-5">
          <input
            type="checkbox"
            id="ativo"
            name="ativo"
            checked={form.ativo}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label htmlFor="ativo" className="text-xs">
            Ativo (aparece no catálogo)
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium mb-1">
          Imagem (upload ou URL)
        </label>
        <div className="flex flex-col md:flex-row gap-2 items-start">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="text-xs"
          />
          <input
            type="url"
            name="imagemUrl"
            placeholder="https://..."
            value={form.imagemUrl || ""}
            onChange={handleChange}
            className="flex-1 border rounded px-2 py-1 text-sm"
          />
        </div>
        {form.imagemUrl && (
          <img
            src={form.imagemUrl}
            alt="Pré-visualização"
            className="h-20 w-20 object-cover rounded border"
          />
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-2 py-1">
          {error}
        </p>
      )}

      {fieldErrors && (
        <div className="space-y-1 text-xs text-red-600">
          {fieldErrors.nome?._errors?.[0] && (
            <p>Nome: {fieldErrors.nome._errors[0]}</p>
          )}
          {fieldErrors.descricao?._errors?.[0] && (
            <p>Descrição: {fieldErrors.descricao._errors[0]}</p>
          )}
          {fieldErrors.preco?._errors?.[0] && (
            <p>Preço: {fieldErrors.preco._errors[0]}</p>
          )}
          {fieldErrors.estoque?._errors?.[0] && (
            <p>Estoque: {fieldErrors.estoque._errors[0]}</p>
          )}
          {fieldErrors.departamento?._errors?.[0] && (
            <p>Departamento: {fieldErrors.departamento._errors[0]}</p>
          )}
          {fieldErrors.imagemUrl?._errors?.[0] && (
            <p>Imagem: {fieldErrors.imagemUrl._errors[0]}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 bg-primary text-secondary font-medium rounded-md px-4 py-2 text-sm hover:bg-primary-dark transition"
      >
        {saving && (
          <span className="h-4 w-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
        )}
        <span>{saving ? "Salvando..." : form._id ? "Salvar edição" : "Cadastrar"}</span>
      </button>
    </form>
  );
}


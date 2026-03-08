"use client";

import { useEffect, useState } from "react";
import { AdminProductForm } from "@/components/AdminProductForm";

type Product = {
  _id: string;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  departamento: string;
  imagemUrl?: string;
  ativo: boolean;
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [reloading, setReloading] = useState(false);

  async function load() {
    setReloading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (!res.ok) {
        // the API may respond with an error if the database is misconfigured
        setError(data.error || "Falha ao carregar produtos");
      } else {
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
      setError("Erro de rede ao consultar produtos");
    } finally {
      setLoading(false);
      setReloading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja remover este produto? Essa ação não pode ser desfeita."
    );
    if (!confirmDelete) return;

    try {
      await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      await load();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-secondary">
          Painel de Produtos
        </h2>
        <button
          onClick={() => setSelected(null)}
          className="text-sm underline text-primary"
        >
          Novo produto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1 bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3 text-secondary">
            {selected ? "Editar produto" : "Cadastrar novo produto"}
          </h3>
          <AdminProductForm initial={selected} onSaved={load} />
        </div>

        <div className="md:col-span-2 bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-secondary">
              Produtos cadastrados
            </h3>
            {reloading && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <span className="h-3 w-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                <span>Atualizando...</span>
              </div>
            )}
          </div>
          {error ? (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded p-4">
          {error}
        </p>
      ) : loading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-slate-100 rounded animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-2 py-2 text-left border-b">Nome</th>
                    <th className="px-2 py-2 text-left border-b">Departamento</th>
                    <th className="px-2 py-2 text-right border-b">Preço</th>
                    <th className="px-2 py-2 text-right border-b">Estoque</th>
                    <th className="px-2 py-2 text-center border-b">Ativo</th>
                    <th className="px-2 py-2 text-right border-b">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-b last:border-0">
                      <td className="px-2 py-2">{p.nome}</td>
                      <td className="px-2 py-2">{p.departamento}</td>
                      <td className="px-2 py-2 text-right">
                        R$ {p.preco.toFixed(2)}
                      </td>
                      <td className="px-2 py-2 text-right">{p.estoque}</td>
                      <td className="px-2 py-2 text-center">
                        <span
                          className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            p.ativo
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {p.ativo ? "Ativo" : "Oculto"}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-right space-x-1">
                        <button
                          onClick={() => setSelected(p)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-2 py-4 text-center text-slate-500"
                      >
                        Nenhum produto cadastrado ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


import { connectToDatabase } from "@/lib/mongodb";
import { Product, DEPARTAMENTOS } from "@/models/Product";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Permitir que a aplicação rode mesmo antes de configurar o banco
  if (!process.env.MONGODB_URI) {
    return (
      <div className="bg-white border border-dashed border-slate-300 rounded-lg p-6 text-sm text-slate-700">
        <p className="font-semibold mb-2">
          Banco de dados ainda não configurado.
        </p>
        <p>
          Defina a variável de ambiente{" "}
          <code className="px-1 py-0.5 rounded bg-slate-100">
            MONGODB_URI
          </code>{" "}
          para conectar ao MongoDB Atlas e exibir o catálogo dinâmico.
        </p>
      </div>
    );
  }

  try {
    await connectToDatabase();
  } catch (err: any) {
    return (
      <div className="bg-white border border-dashed border-slate-300 rounded-lg p-6 text-sm text-slate-700">
        <p className="font-semibold mb-2">Falha ao conectar no MongoDB.</p>
        <p className="text-slate-600">
          Verifique se o usuário/senha do Atlas estão corretos e se o acesso de rede
          está liberado no Atlas (Network Access).
        </p>
        {err?.message && (
          <p className="mt-3 text-xs text-slate-500 break-words">
            Detalhe: {String(err.message)}
          </p>
        )}
      </div>
    );
  }

  const productsByDepartamento: Record<string, any[]> = {};
  DEPARTAMENTOS.forEach((d) => (productsByDepartamento[d] = []));

  const products = await Product.find({ ativo: true }).lean();
  for (const p of products) {
    if (productsByDepartamento[p.departamento]) {
      productsByDepartamento[p.departamento].push(p);
    }
  }

  return (
    <div className="space-y-8">
      {DEPARTAMENTOS.map((dep) => {
        const list = productsByDepartamento[dep] || [];
        if (list.length === 0) return null;

        return (
          <section key={dep}>
            <h2 className="text-lg font-semibold mb-3 text-secondary">{dep}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {list.map((p) => (
                <article
                  key={String(p._id)}
                  className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden flex flex-col"
                >
                  {p.imagemUrl && (
                    <img
                      src={p.imagemUrl}
                      alt={p.nome}
                      className="h-40 w-full object-cover"
                    />
                  )}
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-semibold text-sm mb-1">{p.nome}</h3>
                    <p className="text-xs text-slate-600 mb-2">
                      {p.descricao}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="font-bold text-primary">
                        R$ {p.preco.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Estoque: {p.estoque}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}


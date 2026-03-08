import { Suspense } from "react";
import AdminLoginClient from "./AdminLoginClient";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-600">Carregando...</div>}>
      <AdminLoginClient />
    </Suspense>
  );
}


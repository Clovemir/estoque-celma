// shared constants and types that are safe to use in client bundles

export const DEPARTAMENTOS = [
  "Estrutura",
  "Acabamento",
  "Hidráulica",
  "Elétrica",
  "Ferramentas",
  "Iluminação",
] as const;

export type Departamento = (typeof DEPARTAMENTOS)[number];

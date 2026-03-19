export const formatCurrency = (n: number | undefined | null) => 
  (n ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatInt = (n: number | undefined | null) => 
  Math.round(n ?? 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 });

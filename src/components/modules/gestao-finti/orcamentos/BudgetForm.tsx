"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveBudgets } from "@/app/admin/modules/gestao-finti/orcamentos/actions";
import { Save, Loader2 } from "lucide-react";

interface Category {
  id: number;
  nome: string;
}

interface Budget {
  categoryId: number;
  amount: number;
}

interface BudgetFormProps {
  categories: Category[];
  initialBudgets: Budget[];
  year: number;
  month: number;
}

export function BudgetForm({ categories, initialBudgets, year, month }: BudgetFormProps) {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(year);
  const [selectedMonth, setSelectedMonth] = useState(month);
  
  // Initialize state with initialBudgets
  const [budgets, setBudgets] = useState<Record<number, number>>({});

  // Update local state when initialBudgets changes
  useEffect(() => {
    const map: Record<number, number> = {};
    categories.forEach(cat => {
      const existing = initialBudgets.find(b => b.categoryId === cat.id);
      map[cat.id] = existing ? Number(existing.amount) : 0;
    });
    setBudgets(map);
  }, [initialBudgets, categories]);

  const handleFilter = () => {
    const url = `/admin/modules/gestao-finti/orcamentos?year=${selectedYear}&month=${selectedMonth}`;
    router.push(url);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const items = Object.entries(budgets).map(([categoryId, amount]) => ({
        categoryId: Number(categoryId),
        amount,
      }));
      
      await saveBudgets(selectedYear, selectedMonth, items);
      // alert("Orçamento salvo com sucesso!"); // Removed alert to use toast or just feedback via button state if needed
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar orçamento.");
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (catId: number, value: string) => {
    // Allow empty string to be 0 or handle it
    const val = parseFloat(value);
    setBudgets(prev => ({
      ...prev,
      [catId]: isNaN(val) ? 0 : val
    }));
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-end gap-4 rounded-lg border bg-white p-4 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700">Ano</label>
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="mt-1 block w-32 rounded-md border border-slate-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            {[2024, 2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700">Mês</label>
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="mt-1 block w-48 rounded-md border border-slate-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>
                {new Date(2000, m - 1, 1).toLocaleString('pt-BR', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleFilter}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Filtrar
        </button>
      </div>

      {/* Budget Table */}
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <h2 className="text-lg font-semibold text-slate-800">Categorias</h2>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar Alterações
          </button>
        </div>

        <div className="p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={category.id} className="rounded-md border border-slate-200 p-4 bg-slate-50">
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  {category.nome}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={budgets[category.id] || ""}
                    onChange={(e) => handleValueChange(category.id, e.target.value)}
                    className="block w-full rounded-md border border-slate-300 p-2 pl-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="0,00"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

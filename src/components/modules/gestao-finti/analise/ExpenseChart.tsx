"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

interface BarChartProps {
  data: {
    name: string;
    fixed: number;
    occasional: number;
  }[];
}

export function ExpenseBarChart({ data }: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 w-full bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex items-center justify-center text-slate-400">
        Sem dados para exibir
      </div>
    );
  }

  return (
    <div className="h-80 w-full bg-white p-4 rounded-lg shadow-sm border border-slate-100">
      <h3 className="text-lg font-medium mb-4 text-slate-800">Evolução Mensal</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => `R$ ${value.toFixed(2)}`}
          />
          <Legend />
          <Bar dataKey="fixed" name="Recorrente" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="occasional" name="Eventual" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface PieChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

export function ExpensePieChart({ data }: PieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 w-full bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex items-center justify-center text-slate-400">
        Sem dados para exibir
      </div>
    );
  }

  return (
    <div className="h-80 w-full bg-white p-4 rounded-lg shadow-sm border border-slate-100">
      <h3 className="text-lg font-medium mb-4 text-slate-800">Despesas por Categoria</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => `R$ ${value.toFixed(2)}`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

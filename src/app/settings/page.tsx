"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [checklistTemplate, setChecklistTemplate] = useState("Item 1\nItem 2\nItem 3");
  const [reportHeader, setReportHeader] = useState("Relatórios CMMS - Cartonificio");

  const save = () => {
    // Stub: salvaria em uma tabela/config via API.
    alert("Configurações salvas (stub). Integração com API pendente.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <p className="text-gray-600">Templates e permissões (stub).</p>
      </div>

      <div className="bg-white shadow rounded p-4 space-y-4">
        <div>
          <div className="font-semibold mb-2">Template de checklist</div>
          <textarea className="w-full border rounded p-2 h-32" value={checklistTemplate} onChange={(e) => setChecklistTemplate(e.target.value)} />
        </div>
        <div>
          <div className="font-semibold mb-2">Cabeçalho de relatórios</div>
          <input className="w-full border rounded px-3 py-2" value={reportHeader} onChange={(e) => setReportHeader(e.target.value)} />
        </div>
        <div>
          <button className="px-4 py-2 bg-gray-800 text-white rounded" onClick={save}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
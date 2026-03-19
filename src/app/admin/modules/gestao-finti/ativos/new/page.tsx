import { AssetForm } from "@/components/modules/gestao-finti/ativos/AssetForm";
import { getCostCenters } from "@/app/admin/modules/gestao-finti/ativos/actions";

export default async function NewAssetPage({
  searchParams,
}: {
  searchParams: Promise<{ isTi?: string }>;
}) {
  const params = await searchParams;
  const isTi = params.isTi === "true";
  const costCenters = await getCostCenters();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        {isTi ? "Novo Ativo (TI)" : "Novo Ativo"}
      </h1>
      <AssetForm costCenters={costCenters} isTi={isTi} />
    </div>
  );
}

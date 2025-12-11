export type CnpjLookupResult = {
  name?: string;
  logradouro?: string;
  numero?: string | number;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  raw?: any;
};

// Fetch company name from a configurable public API. Default is a commonly used endpoint.
// Set `CNPJ_API_URL` to override (must return JSON). The code tries common field names.
export async function lookupCnpj(cnpj: string): Promise<CnpjLookupResult | null> {
  const onlyDigits = (cnpj || '').replace(/\D/g, '');
  if (onlyDigits.length !== 14) return null;
  // Define endpoints to try, preferred first
  const endpoints: string[] = [];
  if (process.env.CNPJ_API_URL) {
    endpoints.push(process.env.CNPJ_API_URL);
  }
  // BrasilAPI (recommended, free)
  endpoints.push('https://brasilapi.com.br/api/cnpj/v1');
  // ReceitaWS (fallback)
  endpoints.push('https://www.receitaws.com.br/v1/cnpj');

  const tryFetch = async (base: string): Promise<CnpjLookupResult | null> => {
    const url = base.endsWith('/') ? `${base}${onlyDigits}` : `${base}/${onlyDigits}`;
    try {
      const r = await fetch(url, {
        method: 'GET',
        // Avoid caching and add a User-Agent to improve compatibility with some providers
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36',
        },
      });
      if (!r.ok) return null;
      const j = await r.json();
      // Normalize fields from different providers
      const name = j?.nome || j?.razao_social || j?.razaosocial || j?.fantasia || j?.name || undefined;
      const logradouro = j?.logradouro || j?.street || j?.address?.street || undefined;
      const numero = j?.numero || j?.number || j?.address?.number || undefined;
      const bairro = j?.bairro || j?.district || j?.address?.district || undefined;
      const cidade = j?.municipio || j?.cidade || j?.city || j?.address?.city || undefined;
      const estado = j?.uf || j?.estado || j?.state || j?.address?.state || undefined;
      const cep = j?.cep || j?.postal_code || j?.address?.cep || undefined;
      return { name, logradouro, numero, bairro, cidade, estado, cep, raw: j };
    } catch {
      return null;
    }
  };

  for (const base of endpoints) {
    const res = await tryFetch(base);
    if (res) return res;
  }
  return null;
}
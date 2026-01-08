"use client";
import { useRef, useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotDigits, setForgotDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (res?.error) {
      setError("Credenciais inválidas");
      return;
    }
    if (res?.ok) {
      // Após login, garantir que a entidade ativa esteja definida com base nos vínculos do usuário
      try {
        const r = await fetch('/api/permissions', { cache: 'no-store' });
        const j = await r.json();
        if (!j?.activeEntityId && Array.isArray(j?.entities) && j.entities.length > 0) {
          await fetch('/api/session/entity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ entityId: Number(j.entities[0].id) })
          });
        }
      } catch {}
      window.location.href = res.url ?? "/";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white shadow rounded p-6">
        <div className="flex flex-col items-center mb-4">
          <img src="/icons/logo cartonificio.png" alt="Cartonifício Valinhos" className="w-24 max-h-20 object-contain mb-2" />
          <h1 className="text-xl font-semibold">Seja bem vindo</h1>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">E-mail</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Senha</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}
          <button
            type="submit"
            className="w-full px-3 py-2 bg-gray-800 text-white rounded"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <div className="flex justify-end mt-2">
            <button
              type="button"
              className="text-sm text-blue-700 hover:underline"
              onClick={() => {
                setShowForgot(true);
                setForgotStep(1);
                setForgotEmail("");
                setForgotDigits(["", "", "", "", "", ""]);
                setForgotMsg(null);
                setForgotError(null);
              }}
            >
              Esqueci Minha Senha
            </button>
          </div>
        </form>
      </div>

      {showForgot && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="w-full max-w-sm bg-white shadow rounded p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold">Recuperar Senha</div>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowForgot(false);
                  setForgotStep(1);
                  setForgotMsg(null);
                  setForgotError(null);
                  setForgotDigits(["", "", "", "", "", ""]);
                }}
              >
                ✕
              </button>
            </div>

            {forgotStep === 1 && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setForgotLoading(true);
                  setForgotMsg(null);
                  setForgotError(null);
                  try {
                    const res = await fetch('/api/auth/forgot', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: forgotEmail })
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      setForgotError(data?.message || 'Falha ao enviar código');
                    } else {
                      setForgotMsg('Código enviado para o seu e-mail.');
                      setForgotStep(2);
                    }
                  } catch (err) {
                    setForgotError('Erro de rede. Tente novamente.');
                  } finally {
                    setForgotLoading(false);
                  }
                }}
                className="space-y-2"
              >
                <label className="block text-sm text-gray-600">Informe seu e-mail</label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
                {forgotError && <div className="text-sm text-red-600">{forgotError}</div>}
                {forgotMsg && <div className="text-sm text-green-700">{forgotMsg}</div>}
                <button
                  type="submit"
                  className="w-full px-3 py-2 bg-blue-700 text-white rounded"
                  disabled={forgotLoading}
                >
                  {forgotLoading ? 'Enviando...' : 'Enviar código'}
                </button>
              </form>
            )}

            {forgotStep === 2 && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setForgotLoading(true);
                  setForgotMsg(null);
                  setForgotError(null);
                  const code = forgotDigits.join("");
                  if (code.length !== 6) {
                    setForgotError('Informe os 6 dígitos.');
                    setForgotLoading(false);
                    return;
                  }
                  try {
                    const res = await fetch('/api/auth/forgot/verify', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: forgotEmail, code })
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      setForgotError(data?.message || 'Código inválido ou expirado');
                    } else {
                      setForgotMsg('Código verificado com sucesso.');
                    }
                  } catch (err) {
                    setForgotError('Erro de rede. Tente novamente.');
                  } finally {
                    setForgotLoading(false);
                  }
                }}
                className="space-y-2"
              >
                <label className="block text-sm text-gray-600">Digite o código de 6 dígitos</label>
                <div className="grid grid-cols-6 gap-2">
                  {[0,1,2,3,4,5].map((i) => (
                    <input
                      key={i}
                      ref={(el) => { inputsRef.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="border rounded px-0 text-center py-2 text-lg tracking-widest"
                      value={forgotDigits[i]}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9]/g, '').slice(0,1);
                        const next = [...forgotDigits];
                        next[i] = v;
                        setForgotDigits(next);
                        if (v && i < 5) inputsRef.current[i+1]?.focus();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !forgotDigits[i] && i > 0) {
                          inputsRef.current[i-1]?.focus();
                        }
                      }}
                      onPaste={(e) => {
                        const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0,6);
                        if (!text) return;
                        e.preventDefault();
                        const next = [...forgotDigits];
                        for (let j = 0; j < text.length && j < 6; j++) next[j] = text[j];
                        setForgotDigits(next);
                        const lastIndex = Math.min(text.length, 6) - 1;
                        inputsRef.current[lastIndex]?.focus();
                      }}
                      required
                    />
                  ))}
                </div>
                {forgotError && <div className="text-sm text-red-600">{forgotError}</div>}
                {forgotMsg && <div className="text-sm text-green-700">{forgotMsg}</div>}
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-3 py-2 border rounded"
                    onClick={() => {
                      setForgotStep(1);
                      setForgotDigits(["", "", "", "", "", ""]);
                    }}
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-3 py-2 bg-blue-700 text-white rounded"
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? 'Verificando...' : 'Verificar código'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
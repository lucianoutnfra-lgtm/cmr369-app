"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      
      if (data.token) {
        // Guardar la cookie globalmente
        document.cookie = `auth_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        router.push("/inbox");
        router.refresh(); // Refrescar para que el layout relea las cookies si es necesario
      }
    } catch (err: any) {
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">CMR369</h1>
          <p className="text-sm text-text-muted mt-1">Ingresa para administrar tu CRM</p>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded bg-background border border-border px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded bg-background border border-border px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-primary py-2.5 text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Autenticando..." : "Iniciar Sesión"}
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-text-muted">
          Unitary Marketing AI &copy; 2026
        </div>
      </div>
    </div>
  );
}

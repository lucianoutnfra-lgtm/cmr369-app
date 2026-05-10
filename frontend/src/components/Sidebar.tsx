"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

export default function Sidebar() {
  const router = useRouter();
  const [globalAiDeactivated, setGlobalAiDeactivated] = useState(false);

  useEffect(() => {
    const fetchGlobalAi = async () => {
      try {
        const res = await apiFetch('/api/dashboard/global-ai');
        setGlobalAiDeactivated(res.globalAiDeactivated);
      } catch (err) {
        console.error('Error fetching global AI status', err);
      }
    };
    fetchGlobalAi();
  }, []);

  const handleToggleGlobalAi = async () => {
    try {
      const newState = !globalAiDeactivated;
      await apiFetch('/api/dashboard/global-ai', {
        method: 'PATCH',
        body: JSON.stringify({ globalAiDeactivated: newState })
      });
      setGlobalAiDeactivated(newState);
    } catch (err) {
      console.error('Error toggling global AI', err);
    }
  };

  const handleLogout = () => {
    // Limpiar la cookie auth_token y el estado local
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.clear();
    // Redirigir al login usando window.location para forzar recarga de estado completo
    window.location.href = '/login';
  };

  return (
    <nav className="w-64 h-screen bg-surface border-r border-border shrink-0 flex flex-col justify-between">
      <div>
        <div className="p-6 border-b border-border">
          <Link href="/inbox">
            <h1 className="text-2xl font-bold text-white tracking-widest text-center cursor-pointer">CMR<span className="text-primary">369</span></h1>
          </Link>
          <p className="text-xs text-text-muted text-center mt-1">AI-Powered CRM</p>
        </div>
        
        <ul className="flex flex-col gap-2 p-4">
          <li>
            <Link href="/inbox" className="block px-4 py-3 rounded-xl transition-all font-medium hover:bg-surface-hover text-text-muted hover:text-white">
              💬 Bandeja de Entrada
            </Link>
          </li>
          <li>
            <Link href="/kanban" className="block px-4 py-3 rounded-xl transition-all font-medium hover:bg-surface-hover text-text-muted hover:text-white">
              📊 Embudo de Ventas
            </Link>
          </li>
          <li>
            <Link href="/catalog" className="block px-4 py-3 rounded-xl transition-all font-medium hover:bg-surface-hover text-text-muted hover:text-white">
              🛍️ Catálogo
            </Link>
          </li>
          <li className="mt-4 pt-4 border-t border-border/50">
            <Link href="/settings" className="block px-4 py-3 rounded-xl transition-all font-medium hover:bg-surface-hover text-text-muted hover:text-white">
              ⚙️ Configuración
            </Link>
          </li>
        </ul>

        <div className="px-4 mt-6">
          <div className="bg-surface-hover rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white">IA Global</span>
              <button 
                onClick={handleToggleGlobalAi}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${globalAiDeactivated ? 'bg-red-500' : 'bg-whatsapp'}`}
                title={globalAiDeactivated ? 'IA Desactivada para todos' : 'IA Activada'}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${globalAiDeactivated ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <p className="text-xs text-text-muted">
              {globalAiDeactivated 
                ? 'La IA está apagada para TODOS los chats.' 
                : 'La IA está activa (excepto donde se pause individualmente).'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <button 
          onClick={handleLogout}
          className="w-full py-2 px-4 rounded-lg border border-border text-text-muted hover:text-white hover:border-text-muted transition-colors text-sm"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

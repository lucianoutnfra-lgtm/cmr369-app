"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    // Limpiar la cookie auth_token
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Redirigir al login
    router.push('/login');
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
            <Link href="/settings/team" className="block px-4 py-3 rounded-xl transition-all font-medium hover:bg-surface-hover text-text-muted hover:text-white">
              👥 Configuración de Equipo
            </Link>
          </li>
        </ul>
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

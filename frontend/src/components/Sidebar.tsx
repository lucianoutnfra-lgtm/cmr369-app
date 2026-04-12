import Link from 'next/link';

export default function Sidebar() {
  return (
    <nav className="w-64 h-screen bg-surface border-r border-border shrink-0 flex flex-col justify-between">
      <div>
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-white tracking-widest text-center">CMR<span className="text-primary">369</span></h1>
          <p className="text-xs text-text-muted text-center mt-1">AI-Powered CRM</p>
        </div>
        
        <ul className="flex flex-col gap-2 p-4">
          <li>
            <Link href="/inbox" className="block px-4 py-3 rounded-xl transition-all font-medium hover:bg-surface-hover hover:text-white bg-primary text-white shadow-lg shadow-primary/20">
              💬 Bandeja de Entrada
            </Link>
          </li>
          <li>
            <Link href="/kanban" className="block px-4 py-3 rounded-xl transition-all font-medium hover:bg-surface-hover text-text-muted hover:text-white">
              📊 Embudo Kanban
            </Link>
          </li>
          <li>
            <Link href="/catalog" className="block px-4 py-3 rounded-xl transition-all font-medium hover:bg-surface-hover text-text-muted hover:text-white">
              🛍️ Catálogo
            </Link>
          </li>
        </ul>
      </div>

      <div className="p-4 border-t border-border">
        <button className="w-full py-2 px-4 rounded-lg border border-border text-text-muted hover:text-white hover:border-text-muted transition-colors text-sm">
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

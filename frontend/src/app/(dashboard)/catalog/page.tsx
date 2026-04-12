export default function CatalogManagerPage() {
  return (
    <div className="flex flex-col h-full w-full bg-[#0a101f]">
      {/* Header */}
      <header className="h-[72px] shrink-0 border-b border-border bg-surface flex items-center justify-between px-6 z-10 shadow-sm">
        <div>
          <h1 className="font-bold text-white text-xl">Gestor de Catálogo</h1>
          <a href="/c/demo" className="text-sm text-primary hover:underline mt-1 block" target="_blank">
            Enlace público: /c/demo ↗
          </a>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm shadow-lg">
          + Nuevo Producto
        </button>
      </header>
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mock Product Card */}
          <div className="bg-surface rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors">
            <div className="aspect-video bg-background flex items-center justify-center text-text-muted">
              [ Imagen del Producto ]
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white">Servicio Premium</h3>
                <span className="bg-primary/20 text-primary-light px-2 py-0.5 rounded text-sm font-semibold">$50.00</span>
              </div>
              <p className="text-sm text-text-muted mb-4 line-clamp-2">Accede a las mejores herramientas de automatización de marketing.</p>
              <div className="flex justify-end gap-2">
                <button className="text-text-muted hover:text-white text-sm px-3 py-1 bg-background rounded border border-border">Editar</button>
                <button className="text-stop-ai hover:text-red-400 text-sm px-3 py-1 bg-stop-ai/10 rounded">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

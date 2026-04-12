// Vista Pública del Catálogo
// Se accede usando la URL del Tenant (es slug, ej: /c/unitary-marketing)

export default function PublicCatalogPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      {/* Public Header */}
      <header className="bg-white border-b border-stone-200 py-8 text-center shrink-0 shadow-sm">
        <h1 className="text-3xl font-bold text-stone-800 uppercase tracking-widest">{params.slug}</h1>
        <p className="text-stone-500 text-sm mt-2">Catálogo Oficial</p>
      </header>

      {/* Products Grid */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
           {/* Public Product Card */}
           <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all border border-stone-100 group cursor-pointer">
            <div className="aspect-[4/3] bg-stone-100 flex items-center justify-center text-stone-400 overflow-hidden relative">
              <div className="absolute inset-0 bg-stone-200 group-hover:scale-105 transition-transform duration-700 ease-in-out"></div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg mb-1 text-stone-900">Servicio Premium</h3>
              <p className="text-stone-500 text-sm mb-4 line-clamp-2">Desbloquea IA y automatización para hacer crecer tu negocio.</p>
              <div className="flex justify-between items-center mt-auto">
                <span className="font-bold text-xl text-stone-800">$50.00</span>
                <button className="bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors shadow-md shadow-green-500/20">
                  Consultar
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* CRITICAL: Mandatory Footer */}
      <footer className="bg-stone-950 text-stone-400 text-center py-6 text-xs mt-auto">
        <p>Unitary Marketing AI Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

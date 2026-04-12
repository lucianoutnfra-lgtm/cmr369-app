import KanbanBoard from '@/components/KanbanBoard';

export default function KanbanPage() {
  return (
    <div className="flex flex-col h-full w-full bg-[#0a101f]">
      {/* Header */}
      <header className="h-[72px] shrink-0 border-b border-border bg-surface flex items-center justify-between px-6 z-10 shadow-sm">
        <h1 className="font-bold text-white text-xl">Embudo de Ventas</h1>
        <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm shadow-lg">
          + Nueva Columna
        </button>
      </header>
      
      {/* Kanban Scroll Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 relative z-0">
        <KanbanBoard />
      </div>
    </div>
  );
}

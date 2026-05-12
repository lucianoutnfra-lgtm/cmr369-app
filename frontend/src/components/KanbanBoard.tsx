"use client";
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface LeadCard {
  id: string;
  name: string;
  phone: string;
}

interface Column {
  id: string;
  name: string;
  leads: LeadCard[];
}

export default function KanbanBoard() {
  const router = useRouter();
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKanban = async () => {
    try {
      const data = await apiFetch('/api/dashboard/kanban');
      setColumns(data);
    } catch (err) {
      console.error('Error fetching kanban:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKanban();
    const interval = setInterval(fetchKanban, 2000); // Polling cada 2s para el Kanban
    return () => clearInterval(interval);
  }, []);

  const handleEditStage = async (stageId: string, currentName: string) => {
    const newName = prompt("Nuevo nombre de la etapa:", currentName);
    if (!newName || newName === currentName) return;

    try {
      await apiFetch(`/api/dashboard/kanban/stages/${stageId}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: newName })
      });
      fetchKanban();
    } catch (err) {
      console.error('Error editing stage:', err);
      alert('Error al editar etapa');
    }
  };

  const handleDeleteStage = async (stageId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta etapa? Los leads quedarán sin etapa asignada.')) return;

    try {
      await apiFetch(`/api/dashboard/kanban/stages/${stageId}`, {
        method: 'DELETE'
      });
      fetchKanban();
    } catch (err) {
      console.error('Error deleting stage:', err);
      alert('Error al eliminar etapa');
    }
  };

  // Drag and Drop Logic
  const onDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("leadId", leadId);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = async (e: React.DragEvent, stageId: string) => {
    const leadId = e.dataTransfer.getData("leadId");
    if (!leadId) return;

    // Optimistic update
    const oldColumns = [...columns];
    try {
      await apiFetch(`/api/dashboard/kanban/leads/${leadId}/stage`, {
        method: 'PATCH',
        body: JSON.stringify({ stageId })
      });
      fetchKanban();
    } catch (err) {
      console.error('Error moving lead:', err);
      setColumns(oldColumns);
      alert('Error al mover el lead');
    }
  };

  if (loading) return <div className="p-6 text-text-muted">Cargando tablero...</div>;

  return (
    <div className="flex gap-6 h-full items-start overflow-x-auto pb-4">
      {columns.length === 0 ? (
        <div className="p-12 text-center text-text-muted w-full border border-dashed border-border rounded-xl">
          No has configurado etapas del embudo aún.
        </div>
      ) : (
        columns.map(col => (
          <div 
            key={col.id} 
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, col.id)}
            className="min-w-[300px] w-[300px] bg-surface rounded-xl flex flex-col max-h-full border border-border"
          >
            <div className="p-4 border-b border-border flex justify-between items-center bg-surface-hover/50 rounded-t-xl shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">{col.name}</h3>
                <span className="bg-background text-text-muted text-[10px] px-2 py-0.5 rounded-full font-semibold border border-border">
                  {col.leads?.length || 0}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditStage(col.id, col.name)} className="text-[10px] text-text-muted hover:text-white">✏️</button>
                <button onClick={() => handleDeleteStage(col.id)} className="text-[10px] text-text-muted hover:text-red-400">🗑️</button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 min-h-[250px]">
              {col.leads?.map((card: any) => (
                <div 
                  key={card.id} 
                  draggable
                  onDragStart={(e) => onDragStart(e, card.id)}
                  onClick={() => card.chat?.id ? router.push(`/inbox?chatId=${card.chat.id}`) : alert('Este lead aún no tiene chat asociado')}
                  className="bg-background p-3 rounded-lg border border-border shadow-sm cursor-pointer hover:border-primary transition-colors group active:cursor-grabbing"
                >
                  <h4 className="font-semibold text-white text-xs mb-1 truncate">{card.name}</h4>
                  <p className="text-[10px] text-text-muted flex items-center gap-1">
                    <span className="text-whatsapp">📱</span> {card.phone}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

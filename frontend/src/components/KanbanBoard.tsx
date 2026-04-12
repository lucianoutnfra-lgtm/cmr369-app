"use client";
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

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
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchKanban();
  }, []);

  if (loading) return <div className="p-6 text-text-muted">Cargando tablero...</div>;

  return (
    <div className="flex gap-6 h-full items-start overflow-x-auto pb-4">
      {columns.length === 0 ? (
        <div className="p-12 text-center text-text-muted w-full border border-dashed border-border rounded-xl">
          No has configurado etapas del embudo aún.
        </div>
      ) : (
        columns.map(col => (
          <div key={col.id} className="min-w-[300px] w-[300px] bg-surface rounded-xl flex flex-col max-h-full border border-border">
            <div className="p-4 border-b border-border flex justify-between items-center bg-surface-hover/50 rounded-t-xl shrink-0">
              <h3 className="font-bold text-white text-sm">{col.name}</h3>
              <span className="bg-background text-text-muted text-[10px] px-2 py-0.5 rounded-full font-semibold border border-border">
                {col.leads?.length || 0}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 min-h-[150px]">
              {col.leads?.map(card => (
                <div key={card.id} className="bg-background p-3 rounded-lg border border-border shadow-sm cursor-pointer hover:border-primary transition-colors group">
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

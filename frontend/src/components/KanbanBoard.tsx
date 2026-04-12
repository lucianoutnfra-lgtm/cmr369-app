"use client";
import { useState } from 'react';

// Interfaces mockups
interface LeadCard {
  id: string;
  name: string;
  phone: string;
  value?: string;
}

interface Column {
  id: string;
  title: string;
  cards: LeadCard[];
}

export default function KanbanBoard() {
  // Datos mock para visualización del tablero drag & drop (simplificada)
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'col-1',
      title: 'Nuevo Lead',
      cards: [
        { id: 'lead-1', name: 'Laura Gómez', phone: '+54 9 11 2233-4455' },
        { id: 'lead-2', name: '+54 9 11 9876-5432', phone: '+54 9 11 9876-5432' },
      ]
    },
    {
      id: 'col-2',
      title: 'En Conversación',
      cards: [
        { id: 'lead-3', name: 'Juan Pérez', phone: '+54 9 11 5566-7788' }
      ]
    },
    {
      id: 'col-3',
      title: 'Cotización',
      cards: []
    },
    {
      id: 'col-4',
      title: 'Cierre',
      cards: [
        { id: 'lead-4', name: 'Marta Díaz', phone: '+54 9 11 4433-2211', value: '$1200' }
      ]
    }
  ]);

  return (
    <div className="flex gap-6 h-full items-start">
      {columns.map(col => (
        <div key={col.id} className="min-w-[320px] w-[320px] bg-surface rounded-xl flex flex-col max-h-full border border-border">
          <div className="p-4 border-b border-border flex justify-between items-center bg-surface-hover/50 rounded-t-xl shrink-0">
            <h3 className="font-bold text-white">{col.title}</h3>
            <span className="bg-background text-text-muted text-xs px-2 py-1 rounded-full font-semibold border border-border">
              {col.cards.length}
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-[150px]">
            {col.cards.map(card => (
              <div key={card.id} className="bg-background p-4 rounded-lg border border-border shadow-sm cursor-grab hover:border-primary transition-colors hover:shadow-primary/5 group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white text-sm">{card.name}</h4>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="text-text-muted hover:text-white">⋮</button>
                  </div>
                </div>
                <p className="text-xs text-text-muted mb-3 flex items-center gap-1">
                  <span className="w-4 h-4 text-whatsapp">📱</span> {card.phone}
                </p>
                {card.value && (
                  <span className="inline-block bg-primary/20 text-primary-light text-xs font-semibold px-2 py-1 rounded-md">
                    {card.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function ChatList() {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await apiFetch('/api/dashboard/chats');
        setChats(data);
      } catch (err) {
        console.error('Error fetching chats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  if (loading) return <div className="p-4 text-text-muted">Cargando chats...</div>;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border bg-surface">
        <h2 className="text-lg font-bold text-white mb-3">Chats</h2>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="w-full bg-background border border-border rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-sm">No hay chats activos.</div>
        ) : (
          chats.map(chat => (
            <div key={chat.id} className="p-4 border-b border-border hover:bg-surface-hover cursor-pointer transition-colors flex gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                {(chat.lead?.name || 'L').substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-white truncate text-sm">{chat.lead?.name || chat.lead?.phone}</span>
                  <span className="text-xs text-text-muted shrink-0 text-[10px]">
                    {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted truncate">
                    {chat.messages?.[0]?.content || 'Sin mensajes'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

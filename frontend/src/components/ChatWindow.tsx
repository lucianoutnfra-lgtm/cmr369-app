"use client";
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function ChatWindow({ chatId }: { chatId?: string }) {
  const [stopAi, setStopAi] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!chatId) return;

    const fetchChatData = async () => {
      setLoading(true);
      try {
        const msgs = await apiFetch(`/api/dashboard/chats/${chatId}/messages`);
        setMessages(msgs);
        // El lead info viene usualmente en el chat, pero aquí simplificamos
      } catch (err) {
        console.error('Error fetching chat data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChatData();
  }, [chatId]);

  const handleToggleAi = async () => {
    if (!chatId) return;
    const newState = !stopAi;
    try {
      await apiFetch(`/api/dashboard/chats/${chatId}/toggle-ai`, {
        method: 'PATCH',
        body: JSON.stringify({ stopAi: newState })
      });
      setStopAi(newState);
    } catch (err) {
      console.error('Error toggling AI:', err);
    }
  };

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a101f] text-text-muted italic">
        Selecciona un chat para comenzar
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#0a101f] relative">
      <header className="h-[72px] shrink-0 border-b border-border bg-surface flex items-center justify-between px-6 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {lead?.name?.[0] || 'C'}
          </div>
          <div>
            <h3 className="font-bold text-white text-base">{lead?.name || lead?.phone || 'Cliente'}</h3>
            <p className="text-xs text-whatsapp">Activo</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-text-muted">
            {stopAi ? 'IA Pausada' : 'IA Activa'}
          </span>
          <button 
            onClick={handleToggleAi}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${stopAi ? 'bg-red-500' : 'bg-whatsapp'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${stopAi ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.source === 'LEAD' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[70%] rounded-2xl p-3 shadow-sm border ${
              msg.source === 'LEAD' 
                ? 'bg-surface border-border rounded-tl-sm' 
                : 'bg-primary/10 border-primary/20 text-blue-100 rounded-tr-sm'
            }`}>
              {msg.source === 'AI' && (
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wide">🤖 IA Agent</span>
                </div>
              )}
              <p className="text-sm text-white">{msg.content}</p>
              <span className="text-[10px] text-text-muted block text-right mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-surface border-t border-border shrink-0">
        <div className="flex items-center gap-2 max-w-4xl mx-auto w-full bg-background rounded-full p-1 pl-4 border border-border focus-within:border-primary transition-colors">
          <input 
            type="text" 
            placeholder="Escribe un mensaje..." 
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white h-10"
          />
          <button className="bg-primary hover:bg-primary-hover text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors">
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

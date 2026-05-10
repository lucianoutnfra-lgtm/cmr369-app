"use client";
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function ChatWindow({ chatId }: { chatId?: string }) {
  const [stopAi, setStopAi] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [chatName, setChatName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    if (!chatId) return;

    const fetchChatData = async () => {
      setLoading(true);
      try {
        const [chatData, msgs] = await Promise.all([
          apiFetch(`/api/dashboard/chats/${chatId}`),
          apiFetch(`/api/dashboard/chats/${chatId}/messages`)
        ]);
        setLead(chatData.lead);
        setStopAi(chatData.stopAi);
        setChatName(chatData.name || chatData.lead?.name || chatData.lead?.phone || 'Cliente');
        setMessages(msgs);
      } catch (err) {
        console.error('Error fetching chat data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChatData();
  }, [chatId]);

  const handleUpdateName = async () => {
    if (!chatId || !chatName.trim()) return;
    try {
      await apiFetch(`/api/dashboard/chats/${chatId}/name`, {
        method: 'PATCH',
        body: JSON.stringify({ name: chatName.trim() })
      });
      setIsEditingName(false);
    } catch (err) {
      console.error('Error updating name:', err);
    }
  };

  const handleDeleteChat = async () => {
    if (!chatId || !confirm('¿Estás seguro de que deseas eliminar este chat?')) return;
    try {
      await apiFetch(`/api/dashboard/chats/${chatId}`, { method: 'DELETE' });
      window.location.href = '/inbox';
    } catch (err) {
      console.error('Error deleting chat:', err);
    }
  };

  const handleClearMessages = async () => {
    if (!chatId || !confirm('¿Estás seguro de que deseas vaciar este chat?')) return;
    try {
      await apiFetch(`/api/dashboard/chats/${chatId}/messages`, { method: 'DELETE' });
      setMessages([]);
    } catch (err) {
      console.error('Error clearing messages:', err);
    }
  };

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || sending) return;

    setSending(true);
    try {
      const msg = await apiFetch(`/api/dashboard/chats/${chatId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content: newMessage.trim() })
      });
      setMessages([...messages, msg]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
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
            {chatName?.[0]?.toUpperCase() || 'C'}
          </div>
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={chatName} 
                  onChange={(e) => setChatName(e.target.value)}
                  className="bg-background border border-border text-white text-sm rounded px-2 py-1 focus:outline-none focus:border-primary"
                  autoFocus
                />
                <button onClick={handleUpdateName} className="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary-hover">Guardar</button>
                <button onClick={() => setIsEditingName(false)} className="text-xs bg-surface-hover text-white px-2 py-1 rounded">Cancelar</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">{chatName}</h3>
                <button onClick={() => setIsEditingName(true)} className="text-text-muted hover:text-white text-xs">✏️</button>
              </div>
            )}
            <p className="text-xs text-whatsapp">Activo</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-border pr-4">
            <button onClick={handleClearMessages} className="text-xs bg-surface-hover hover:bg-red-500/20 text-text-muted hover:text-red-400 px-3 py-1.5 rounded transition-colors" title="Vaciar chat">
              Vaciar
            </button>
            <button onClick={handleDeleteChat} className="text-xs bg-surface-hover hover:bg-red-500/20 text-text-muted hover:text-red-400 px-3 py-1.5 rounded transition-colors" title="Eliminar chat">
              Eliminar
            </button>
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
        <form 
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 max-w-4xl mx-auto w-full bg-background rounded-full p-1 pl-4 border border-border focus-within:border-primary transition-colors"
        >
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..." 
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white h-10"
            disabled={sending}
          />
          <button 
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:hover:bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          >
            {sending ? '...' : '➤'}
          </button>
        </form>
      </div>
    </div>
  );
}

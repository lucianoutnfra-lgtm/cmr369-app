export default function ChatList() {
  // Mockup records
  const chats = [
    { id: '1', name: '+54 9 11 1234-5678', lastMessage: 'Hola, me interesa el servicio', time: '10:45 AM', unread: 2 },
    { id: '2', name: 'Juan Garcia', lastMessage: 'Gracias por la cotización', time: 'Ayer', unread: 0 },
  ];

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
        {chats.map(chat => (
          <div key={chat.id} className="p-4 border-b border-border hover:bg-surface-hover cursor-pointer transition-colors flex gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
              {chat.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-white truncate text-sm">{chat.name}</span>
                <span className="text-xs text-text-muted shrink-0">{chat.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-muted truncate">{chat.lastMessage}</span>
                {chat.unread > 0 && (
                  <span className="bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

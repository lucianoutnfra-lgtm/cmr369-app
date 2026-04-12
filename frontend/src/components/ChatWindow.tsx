"use client";
import { useState } from 'react';

export default function ChatWindow() {
  const [stopAi, setStopAi] = useState(false);

  return (
    <div className="flex flex-col h-full w-full bg-[#0a101f] relative">
      {/* Header */}
      <header className="h-[72px] shrink-0 border-b border-border bg-surface flex items-center justify-between px-6 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            +5
          </div>
          <div>
            <h3 className="font-bold text-white text-base">+54 9 11 1234-5678</h3>
            <p className="text-xs text-whatsapp">En línea</p>
          </div>
        </div>

        {/* CRITICAL: Stop AI Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-text-muted">
            {stopAi ? 'IA Pausada' : 'IA Activa'}
          </span>
          <button 
            onClick={() => setStopAi(!stopAi)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${stopAi ? 'bg-stop-ai' : 'bg-whatsapp'}`}
          >
            <span 
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${stopAi ? 'translate-x-6' : 'translate-x-1'}`} 
            />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Mockup message from lead */}
        <div className="flex justify-start">
          <div className="max-w-[70%] rounded-2xl rounded-tl-sm bg-surface p-3 shadow-sm border border-border">
            <p className="text-sm text-text">Hola, me interesa el servicio, ¿dónde puedo ver los precios?</p>
            <span className="text-[10px] text-text-muted block text-right mt-1">10:45 AM</span>
          </div>
        </div>

        {/* Mockup automated AI message */}
        <div className="flex justify-end relative group">
          <div className="max-w-[70%] rounded-2xl rounded-tr-sm bg-primary/10 border border-primary/20 p-3 shadow-sm text-blue-100">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wide">🤖 IA Agent</span>
            </div>
            <p className="text-sm text-white">¡Hola! Qué gusto saludarte. Puedes revisar nuestra lista de precios accediendo a nuestro catálogo en línea.</p>
            <span className="text-[10px] text-primary/60 block text-right mt-1">10:46 AM</span>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface border-t border-border shrink-0">
        <div className="flex items-center gap-2 max-w-4xl mx-auto w-full bg-background rounded-full p-1 pl-4 border border-border focus-within:border-primary transition-colors">
          <input 
            type="text" 
            placeholder="Escribe un mensaje humano..." 
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white h-10"
          />
          <button className="bg-primary hover:bg-primary-hover text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors shadow-lg">
            ➤
          </button>
        </div>
        <p className="text-center text-xs text-text-muted mt-2">
          Al enviar un mensaje humano, la IA se pausará automáticamente para este contacto.
        </p>
      </div>
    </div>
  );
}

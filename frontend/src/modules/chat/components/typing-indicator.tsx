'use client'

import { Bot } from 'lucide-react'

/**
 * Indicador visual de "digitando..." no estilo WhatsApp/iMessage.
 * Exibido enquanto o backend está gerando a resposta da IA.
 */
export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5">
      {/* Avatar do bot */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
        <Bot size={14} />
      </div>

      <div className="flex flex-col gap-1 items-start">
        <span className="text-xs font-medium text-muted-foreground px-1">MecBot</span>

        {/* Bolha com os três pontos animados */}
        <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
            style={{ animationDelay: '0ms', animationDuration: '900ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
            style={{ animationDelay: '180ms', animationDuration: '900ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
            style={{ animationDelay: '360ms', animationDuration: '900ms' }}
          />
        </div>
      </div>
    </div>
  )
}

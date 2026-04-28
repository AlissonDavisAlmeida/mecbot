'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot } from 'lucide-react'
import { useMessages } from '../hooks/use-message'
import { MessageList } from './message-list'
import { MessageInput } from './message-input'

export function ChatLayout() {
  const conversaId = 'a5872d98-6665-4f7d-a07e-56362cdca864' // usa um real do seu banco
  const empresaId = '67890' // usa um real do seu banco
  const clienteId = '12345' // usa um real do seu banco

  const [isWaitingReply, setIsWaitingReply] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data, isLoading } = useMessages(conversaId, empresaId, clienteId)

  // Rola até o fim sempre que novas mensagens chegam ou o indicador aparece
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [data, isWaitingReply])

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-72 bg-card border-r border-border flex flex-col">
        {/* Sidebar header */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Bot size={14} className="text-white" />
            </div>
            <span className="font-semibold text-foreground text-sm">MecBot</span>
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
            Conversas
          </p>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-accent cursor-pointer hover:bg-accent/80 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-400 text-xs font-bold">CT</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Cliente teste</p>
              <p className="text-xs text-muted-foreground truncate">Última mensagem...</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Chat area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <header className="bg-card border-b border-border px-6 py-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-400 text-xs font-bold">CT</span>
          </div>
          <div>
            <h2 className="font-semibold text-foreground text-sm leading-tight">Cliente teste</h2>
            <p className="text-xs text-muted-foreground">Atendimento em andamento</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground text-sm">Carregando mensagens...</p>
            </div>
          ) : (
            <MessageList mensagens={data} isWaiting={isWaitingReply} />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="bg-card border-t border-border px-6 py-4">
          <MessageInput
            conversaId={conversaId}
            empresaId={empresaId}
            clienteId={clienteId}
            onPendingChange={setIsWaitingReply}
          />
        </div>
      </main>
    </div>
  )
}
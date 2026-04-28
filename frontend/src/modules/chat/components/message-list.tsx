'use client'

import { Bot, User } from 'lucide-react'

interface Message {
  id: string
  conteudo: string
  role: 'user' | 'assistant'
  createdAt: string
}

interface MessageListProps {
  mensagens?: Message[]
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function MessageList({ mensagens }: MessageListProps) {
  if (!mensagens || mensagens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground py-16">
        <Bot size={40} className="opacity-25" />
        <p className="text-sm">Nenhuma mensagem ainda. Comece a conversa!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {mensagens.map((m) => {
        const isUser = m.role === 'user'
        return (
          <div
            key={m.id}
            className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                isUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
              }`}
            >
              {isUser ? <User size={14} /> : <Bot size={14} />}
            </div>

            {/* Bubble + metadata */}
            <div className={`flex flex-col gap-1 max-w-[68%] ${isUser ? 'items-end' : 'items-start'}`}>
              <span className="text-xs font-medium text-muted-foreground px-1">
                {isUser ? 'Cliente' : 'MecBot'}
              </span>
              <div
                className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm'
                    : 'bg-card text-card-foreground border border-border rounded-2xl rounded-bl-sm'
                }`}
              >
                {m.conteudo}
              </div>
              <span className="text-xs text-muted-foreground px-1">
                {formatTime(m.createdAt)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
 
'use client'

import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { useSendMessage } from '../hooks/use-send-message'

type MessageInputProps = {
  conversaId: string
  empresaId: string
  clienteId: string
  onPendingChange?: (pending: boolean) => void
}

export function MessageInput({ conversaId, empresaId, clienteId, onPendingChange }: MessageInputProps) {
  const [text, setText] = useState('')
  const { mutateAsync, isPending } = useSendMessage(conversaId)

  // Notifica o pai sempre que o estado de loading muda
  const prevPendingRef = React.useRef(false)
  React.useEffect(() => {
    if (prevPendingRef.current !== isPending) {
      prevPendingRef.current = isPending
      onPendingChange?.(isPending)
    }
  }, [isPending, onPendingChange])

  async function handleSend() {
    if (!text.trim() || isPending) return
    const textToSend = text.trim()
    setText('')
    await mutateAsync({ empresaId, cliente: clienteId, message: textToSend })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex gap-3 items-end">
      <textarea
        className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:ring-1 focus:ring-ring min-h-[44px] max-h-32 leading-relaxed"
        placeholder="Digite uma mensagem... (Enter para enviar, Shift+Enter para nova linha)"
        value={text}
        rows={1}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isPending}
      />
      <button
        onClick={handleSend}
        disabled={isPending || !text.trim()}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors flex-shrink-0"
        title="Enviar (Enter)"
      >
        <Send size={18} />
      </button>
    </div>
  )
}
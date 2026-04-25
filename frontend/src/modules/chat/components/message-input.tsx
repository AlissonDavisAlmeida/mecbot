 
'use client'

import { useState } from 'react'
import { useSendMessage } from '../hooks/use-send-message'


type MessageInputProps = {
    conversaId: string
    empresaId: string
    clienteId: string

}

export function MessageInput({ conversaId, empresaId, clienteId }: MessageInputProps) {
  const [text, setText] = useState('')
  const { mutateAsync, isPending } = useSendMessage(conversaId)

  async function handleSend() {
    if (!text) return

    await mutateAsync({ empresaId, cliente: clienteId, mensagem: text })
    setText('')
  }

  return (
    <div className="flex gap-2">
      <input
        className="flex-1 border rounded-xl p-3 text-sm outline-none"
        placeholder="Digite uma mensagem..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleSend}
        disabled={isPending}
        className="bg-blue-600 text-white px-4 rounded-xl"
      >
        Enviar
      </button>
    </div>
  )
}
'use client'

import { useMessages } from '../hooks/use-message'
import { MessageList } from './message-list'
import { MessageInput } from './message-input'

export function ChatLayout() {
  const conversaId = 'a5872d98-6665-4f7d-a07e-56362cdca864' // usa um real do seu banco
  const empresaId = '67890' // usa um real do seu banco
  const clienteId = 'e8d65bcc-0ef6-4ea3-ba7f-875422400968' // usa um real do seu banco

  const { data, isLoading } = useMessages(conversaId)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r p-4">
        <h2 className="font-bold text-lg mb-4">Conversas</h2>

        <div className="p-3 rounded-xl bg-gray-100 cursor-pointer">
          Cliente teste
        </div>
      </aside>

      {/* Chat */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b p-4 flex justify-between">
          <h2 className="font-semibold">Atendimento</h2>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            <MessageList mensagens={data} />
          )}
        </div>

        {/* Input */}
        <div className="bg-white border-t p-4">
          <MessageInput
            conversaId={conversaId}
            empresaId={empresaId}
            clienteId={clienteId}
          />
        </div>
      </main>
    </div>
  )
}
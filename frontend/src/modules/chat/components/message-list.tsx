/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

export function MessageList({ mensagens }: any) {
  return (
    <div className="flex flex-col gap-3">
      {mensagens?.map((m: any) => (
        <div
          key={m.id}
          className={`max-w-xs p-3 rounded-2xl text-sm ${
            m.role === 'user'
              ? 'bg-blue-600 text-white self-end'
              : 'bg-gray-200 text-gray-900 self-start'
          }`}
        >
          {m.conteudo}
        </div>
      ))}
    </div>
  )
}
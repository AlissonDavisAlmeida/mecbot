import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'

interface Message {
  id: string
  conteudo: string
  role: 'user' | 'assistant'
  createdAt: string
}

interface GetMessagesResponse {
  data: Message[]
  total: number
  hasMore: boolean
}

export function useMessages(
  conversaId: string,
  empresaId: string,
  cliente: string,
  limit = 50,
  offset = 0,
) {
  return useQuery({
    queryKey: ['messages', conversaId, empresaId, cliente, limit, offset],
    queryFn: async () => {
      const res = await api.get<GetMessagesResponse>('/ai/messages', {
        params: { conversaId, empresaId, cliente, limit, offset },
      })
      return res.data.data
    },
    enabled: !!conversaId && !!empresaId && !!cliente,
  })
}
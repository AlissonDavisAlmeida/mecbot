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

export function useMessages(conversaId: string, limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['messages', conversaId, limit, offset],
    queryFn: async () => {
      const res = await api.get<GetMessagesResponse>('/ai/messages', {
        params: { conversaId, limit, offset },
      })
      return res.data.data
    },
    enabled: !!conversaId,
  })
}
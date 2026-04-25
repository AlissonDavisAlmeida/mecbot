import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'

export function useMessages(conversaId: string) {
  return useQuery({
    queryKey: ['messages', conversaId],
    queryFn: async () => {
      const res = await api.get('/mensagens', {
        params: { conversaId },
      })
      return res.data.data // { data, nextCursor }
    },
    enabled: !!conversaId,
  })
}
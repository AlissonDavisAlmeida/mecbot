import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'

export function useSendMessage(conversaId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: {
            empresaId: string
            cliente: string
            message: string
        }) => {
            const res = await api.post('/ai/chat', data)
            return res.data
        },

        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['messages', conversaId] })
        }
    })
}
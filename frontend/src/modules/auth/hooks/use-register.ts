import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { registerUser, type RegisterPayload } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
    onSuccess: (data) => {
      setAuth(data.access_token, data.user)
      router.push('/')
    },
  })
}

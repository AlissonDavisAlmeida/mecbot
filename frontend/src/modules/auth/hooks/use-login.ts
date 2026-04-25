import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { loginUser, type LoginPayload } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
    onSuccess: (data) => {
      setAuth(data.access_token, data.user)
      router.push('/')
    },
  })
}

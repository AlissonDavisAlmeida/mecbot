import { api } from '@/services/api'
import { type AuthUser } from '@/store/auth.store'

export type RegisterPayload = {
  nome: string
  email: string
  senha: string
  empresaId: string
}

export type LoginPayload = {
  email: string
  senha: string
}

export type AuthResponse = {
  access_token: string
  user: AuthUser
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', payload)
  return data
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', payload)
  return data
}

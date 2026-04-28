import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

const COOKIE_NAME = 'auth-token'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 dias

export type AuthUser = {
    id: string
    nome: string
    email: string
    role: string
    empresaId: string
}

type AuthState = {
    token: string | null
    user: AuthUser | null
    setAuth: (token: string, user: AuthUser) => void
    clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                token: null,
                user: null,
                setAuth: (token, user) => {
                    // Grava cookie para o proxy.ts (middleware) poder ler server-side
                    if (typeof document !== 'undefined') {
                        document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
                    }
                    set({ token, user })
                },
                clearAuth: () => {
                    if (typeof document !== 'undefined') {
                        document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`
                    }
                    set({ token: null, user: null })
                },
            }),
            { name: 'auth-storage' },
        )),
)

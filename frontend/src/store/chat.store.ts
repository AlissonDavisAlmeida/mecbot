import { create } from 'zustand'

type ChatState = {
  conversaId: string | null
  setConversaId: (id: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  conversaId: null,
  setConversaId: (id) => set({ conversaId: id }),
}))
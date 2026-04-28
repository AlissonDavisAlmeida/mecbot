export class GetMessagesDto {
  declare conversaId: string
  declare empresaId: string
  declare cliente: string
  declare limit?: number
  declare offset?: number
}

export interface GetMessagesResponseDto {
  data: Array<{
    id: string
    conteudo: string
    role: 'user' | 'assistant'
    createdAt: string
  }>
  total: number
  hasMore: boolean
}

import { Injectable } from '@nestjs/common'
import { Subject } from 'rxjs'

interface QueuedMessage {
  conversaId: string
  message: string
  timestamp: number
}

/**
 * MessageQueueService — Gerencia fila de processamento de mensagens
 * para evitar racing conditions quando múltiplas mensagens chegam rápido.
 *
 * Estratégia:
 * - Buffer de 200ms entre processamentos de mensagens da mesma conversa
 * - Agrupa mensagens por conversaId
 * - Processa sequencialmente para evitar respostas atropeladas
 */
@Injectable()
export class MessageQueueService {
  private queue: Map<string, QueuedMessage[]> = new Map()
  private processing: Map<string, boolean> = new Map()
  private readonly BUFFER_DELAY = 200 // ms

  /**
   * Enfileira uma mensagem para processamento
   * Retorna true se é a primeira da fila, false se foi buffered
   */
  enqueue(conversaId: string, message: string): boolean {
    if (!this.queue.has(conversaId)) {
      this.queue.set(conversaId, [])
    }

    const queueItem: QueuedMessage = {
      conversaId,
      message,
      timestamp: Date.now(),
    }

    this.queue.get(conversaId)!.push(queueItem)

    // Se nenhum processamento está acontecendo, começar
    if (!this.processing.get(conversaId)) {
      this.processing.set(conversaId, true)
      return true // Processar imediatamente
    }

    return false // Adicionar à fila
  }

  /**
   * Marca uma conversa como finalizada de processar
   * Retorna a próxima mensagem na fila (se houver) ou null
   */
  dequeue(conversaId: string): QueuedMessage | null {
    const queue = this.queue.get(conversaId) || []

    // Se a fila está vazia, marcamos como não processando
    if (queue.length === 0) {
      this.processing.set(conversaId, false)
      return null
    }

    // Remove primeira da fila
    const next = queue.shift()

    // Se ainda há itens, agendar processamento com delay
    if (queue.length > 0) {
      setTimeout(() => {
        this.processing.set(conversaId, true)
      }, this.BUFFER_DELAY)
    } else {
      // Se não há mais itens, marca como não processando
      this.processing.set(conversaId, false)
    }

    return next || null
  }

  /**
   * Retorna o tamanho da fila para uma conversa
   */
  getQueueSize(conversaId: string): number {
    return this.queue.get(conversaId)?.length || 0
  }

  /**
   * Limpa a fila de uma conversa (ex: quando conexão fecha)
   */
  clear(conversaId: string): void {
    this.queue.delete(conversaId)
    this.processing.delete(conversaId)
  }

  /**
   * Retorna true se há processamento em andamento para uma conversa
   */
  isProcessing(conversaId: string): boolean {
    return this.processing.get(conversaId) ?? false
  }
}

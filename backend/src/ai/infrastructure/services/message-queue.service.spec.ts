import { Test, TestingModule } from '@nestjs/testing'
import { MessageQueueService } from './message-queue.service'

describe('MessageQueueService', () => {
  let service: MessageQueueService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageQueueService],
    }).compile()

    service = module.get<MessageQueueService>(MessageQueueService)
  })

  it('should enqueue a message and return true for first item', () => {
    const conversaId = 'conv-123'
    const message = 'Olá'

    const result = service.enqueue(conversaId, message)

    expect(result).toBe(true)
    expect(service.getQueueSize(conversaId)).toBe(1)
  })

  it('should return false for subsequent messages in processing', () => {
    const conversaId = 'conv-123'

    const first = service.enqueue(conversaId, 'Msg 1')
    const second = service.enqueue(conversaId, 'Msg 2')
    const third = service.enqueue(conversaId, 'Msg 3')

    expect(first).toBe(true)
    expect(second).toBe(false)
    expect(third).toBe(false)
    expect(service.getQueueSize(conversaId)).toBe(3)
  })

  it('should dequeue messages in order', () => {
    const conversaId = 'conv-123'

    service.enqueue(conversaId, 'Msg 1')
    service.enqueue(conversaId, 'Msg 2')
    service.enqueue(conversaId, 'Msg 3')

    const first = service.dequeue(conversaId)
    expect(first?.message).toBe('Msg 1')

    const second = service.dequeue(conversaId)
    expect(second?.message).toBe('Msg 2')

    const third = service.dequeue(conversaId)
    expect(third?.message).toBe('Msg 3')

    const empty = service.dequeue(conversaId)
    expect(empty).toBeNull()
  })

  it('should track processing state correctly', () => {
    const conversaId = 'conv-123'

    expect(service.isProcessing(conversaId)).toBe(false)

    service.enqueue(conversaId, 'Msg 1')
    expect(service.isProcessing(conversaId)).toBe(true)

    // When dequeuing and no more items, should be false
    service.dequeue(conversaId)
    expect(service.isProcessing(conversaId)).toBe(false)

    // Test with multiple items in queue
    service.enqueue(conversaId, 'Msg 1')
    service.enqueue(conversaId, 'Msg 2')
    expect(service.isProcessing(conversaId)).toBe(true)

    // Dequeue first, but second is still queued (processing flag stays set until timeout)
    service.dequeue(conversaId)
    // After dequeue with items remaining, processing remains true (timeout will reset it)
    expect(service.isProcessing(conversaId)).toBe(true)
  })

  it('should clear queue for a conversation', () => {
    const conversaId = 'conv-123'

    service.enqueue(conversaId, 'Msg 1')
    service.enqueue(conversaId, 'Msg 2')
    expect(service.getQueueSize(conversaId)).toBe(2)

    service.clear(conversaId)
    expect(service.getQueueSize(conversaId)).toBe(0)
    expect(service.isProcessing(conversaId)).toBe(false)
  })

  it('should handle multiple conversations independently', () => {
    service.enqueue('conv-1', 'Msg 1')
    service.enqueue('conv-2', 'Msg 2')
    service.enqueue('conv-1', 'Msg 3')

    expect(service.getQueueSize('conv-1')).toBe(2)
    expect(service.getQueueSize('conv-2')).toBe(1)

    service.clear('conv-1')
    expect(service.getQueueSize('conv-1')).toBe(0)
    expect(service.getQueueSize('conv-2')).toBe(1)
  })
})

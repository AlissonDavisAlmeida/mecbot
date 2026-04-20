import { Message } from '../value-objects/message.vo';

export type ConversaStatus = 'open' | 'closed';

export class Conversation {
  private readonly _messages: Message[];

  constructor(
    public readonly id: string,
    public readonly empresaId: string,
    public readonly cliente: string,
    messages: Message[] = [],
    public readonly status: ConversaStatus = 'open',
  ) {
    if (!id) throw new Error('Conversation id cannot be empty');
    if (!empresaId) throw new Error('Empresa id cannot be empty');
    if (!cliente) throw new Error('Cliente cannot be empty');
    this._messages = [...messages];
  }

  addMessage(message: Message): void {
    this._messages.push(message);
  }

  getMessages(): ReadonlyArray<Message> {
    return Object.freeze([...this._messages]);
  }

  get messageCount(): number {
    return this._messages.length;
  }

  /**
   * Converte para formato de persistência Prisma
   */
  toPersistence() {
    return {
      id: this.id,
      empresaId: this.empresaId,
      cliente: this.cliente,
      status: this.status,
      mensagens: this._messages.map((m) => m.toPersistence()),
    };
  }

  static fromPersistence(data: {
    id: string;
    empresaId: string;
    cliente: string;
    status?: string;
    mensagens?: Array<{ role: string; conteudo: string; createdAt: Date }>;
  }): Conversation {
    const messages = (data.mensagens ?? []).map((m) => Message.fromPersistence(m));
    const status = (data.status as ConversaStatus | undefined) ?? 'open';
    return new Conversation(data.id, data.empresaId, data.cliente, messages, status);
  }
}

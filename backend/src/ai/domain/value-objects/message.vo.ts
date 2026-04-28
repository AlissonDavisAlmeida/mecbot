export type MessageRole = 'user' | 'assistant' | 'system';

export class Message {
  readonly role: MessageRole;
  readonly content: string;
  readonly createdAt: Date;

  constructor(role: MessageRole, content: string, createdAt: Date = new Date()) {
    if (!content || content.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }
    this.role = role;
    this.content = content.trim();
    this.createdAt = createdAt;
  }

  equals(other: Message): boolean {
    return this.role === other.role && this.content === other.content;
  }

  /**
   * Converte para formato de persistência Prisma
   */
  toPersistence() {
    return {
      role: this.role,
      conteudo: this.content,
      createdAt: this.createdAt,
    };
  }

  /**
   * Cria a partir de dados do Prisma
   */
  static fromPersistence(data: { role: string; conteudo: string; createdAt: Date }): Message {
    return new Message(data.role as MessageRole, data.conteudo, data.createdAt);
  }
}

export type MessageRole = 'user' | 'assistant' | 'system';

export class Message {
  readonly role: MessageRole;
  readonly content: string;
  readonly timestamp: Date;

  constructor(role: MessageRole, content: string, timestamp: Date = new Date()) {
    if (!content || content.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }
    this.role = role;
    this.content = content.trim();
    this.timestamp = timestamp;
  }

  equals(other: Message): boolean {
    return this.role === other.role && this.content === other.content;
  }
}

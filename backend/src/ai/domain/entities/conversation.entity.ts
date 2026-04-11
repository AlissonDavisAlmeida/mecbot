import { Message } from '../value-objects/message.vo';

export class Conversation {
  private readonly _messages: Message[];

  constructor(
    public readonly id: string,
    public readonly workshopId: string,
    public readonly customerId: string,
    messages: Message[] = [],
  ) {
    if (!id) throw new Error('Conversation id cannot be empty');
    if (!workshopId) throw new Error('Workshop id cannot be empty');
    if (!customerId) throw new Error('Customer id cannot be empty');
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
}

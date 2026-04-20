import { Message } from '../value-objects/message.vo';

export const AI_PROVIDER_TOKEN = Symbol('AI_PROVIDER');

export interface IAIProvider {
  generateResponse(messages: Message[]): Promise<string>;
}

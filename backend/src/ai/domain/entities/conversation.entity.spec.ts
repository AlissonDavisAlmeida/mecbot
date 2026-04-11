import { Conversation } from './conversation.entity';
import { Message } from '../value-objects/message.vo';

describe('Conversation', () => {
  const makeConversation = () =>
    new Conversation('conv-1', 'workshop-1', 'customer-1');

  it('should create with empty messages', () => {
    const conversation = makeConversation();

    expect(conversation.id).toBe('conv-1');
    expect(conversation.workshopId).toBe('workshop-1');
    expect(conversation.customerId).toBe('customer-1');
    expect(conversation.messageCount).toBe(0);
  });

  it('should create with initial messages', () => {
    const initial = [new Message('user', 'Olá')];
    const conversation = new Conversation('id', 'ws', 'cus', initial);

    expect(conversation.messageCount).toBe(1);
  });

  it('should add a message', () => {
    const conversation = makeConversation();
    conversation.addMessage(new Message('user', 'Preciso de revisão'));

    expect(conversation.messageCount).toBe(1);
  });

  it('should return messages in order', () => {
    const conversation = makeConversation();
    conversation.addMessage(new Message('user', 'Primeira'));
    conversation.addMessage(new Message('assistant', 'Resposta'));

    const messages = conversation.getMessages();
    expect(messages[0].content).toBe('Primeira');
    expect(messages[1].content).toBe('Resposta');
  });

  it('should return a frozen (immutable) messages array', () => {
    const conversation = makeConversation();
    conversation.addMessage(new Message('user', 'Olá'));

    const messages = conversation.getMessages();
    expect(Object.isFrozen(messages)).toBe(true);
  });

  it('should throw when id is empty', () => {
    expect(() => new Conversation('', 'ws', 'cus')).toThrow(
      'Conversation id cannot be empty',
    );
  });

  it('should throw when workshopId is empty', () => {
    expect(() => new Conversation('id', '', 'cus')).toThrow(
      'Workshop id cannot be empty',
    );
  });

  it('should throw when customerId is empty', () => {
    expect(() => new Conversation('id', 'ws', '')).toThrow(
      'Customer id cannot be empty',
    );
  });
});

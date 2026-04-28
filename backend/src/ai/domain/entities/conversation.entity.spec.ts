import { Conversation } from './conversation.entity';
import { Message } from '../value-objects/message.vo';

describe('Conversation', () => {
  const makeConversation = () =>
    new Conversation('conv-1', 'empresa-1', 'cliente-whatsapp-123');

  it('should create with empty messages', () => {
    const conversation = makeConversation();

    expect(conversation.id).toBe('conv-1');
    expect(conversation.empresaId).toBe('empresa-1');
    expect(conversation.cliente).toBe('cliente-whatsapp-123');
    expect(conversation.messageCount).toBe(0);
  });

  it('should create with initial messages', () => {
    const initial = [new Message('user', 'Olá')];
    const conversation = new Conversation('id', 'emp', 'client', initial);

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
    expect(() => new Conversation('', 'emp', 'client')).toThrow(
      'Conversation id cannot be empty',
    );
  });

  it('should throw when empresaId is empty', () => {
    expect(() => new Conversation('id', '', 'client')).toThrow(
      'Empresa id cannot be empty',
    );
  });

  it('should throw when cliente is empty', () => {
    expect(() => new Conversation('id', 'emp', '')).toThrow(
      'Cliente cannot be empty',
    );
  });

  it('should convert to persistence format', () => {
    const conversation = makeConversation();
    conversation.addMessage(new Message('user', 'Teste', new Date('2026-04-11')));

    const persistence = conversation.toPersistence();
    expect(persistence.id).toBe('conv-1');
    expect(persistence.empresaId).toBe('empresa-1');
    expect(persistence.cliente).toBe('cliente-whatsapp-123');
    expect(persistence.mensagens[0].conteudo).toBe('Teste');
  });

  it('should create from persistence format', () => {
    const data = {
      id: 'conv-1',
      empresaId: 'emp-1',
      cliente: 'cli-1',
      mensagens: [
        { role: 'user', conteudo: 'Olá', createdAt: new Date() },
        { role: 'assistant', conteudo: 'Oi', createdAt: new Date() },
      ],
    };

    const conversation = Conversation.fromPersistence(data);
    expect(conversation.messageCount).toBe(2);
    expect(conversation.getMessages()[0].content).toBe('Olá');
  });
});

import { Message } from './message.vo';

describe('Message', () => {
  it('should create a valid message', () => {
    const message = new Message('user', 'Preciso de um orçamento');

    expect(message.role).toBe('user');
    expect(message.content).toBe('Preciso de um orçamento');
    expect(message.timestamp).toBeInstanceOf(Date);
  });

  it('should throw when content is empty', () => {
    expect(() => new Message('user', '')).toThrow('Message content cannot be empty');
  });

  it('should throw when content is only whitespace', () => {
    expect(() => new Message('user', '   ')).toThrow('Message content cannot be empty');
  });

  it('should trim whitespace from content', () => {
    const message = new Message('user', '  Olá  ');

    expect(message.content).toBe('Olá');
  });

  it('should accept custom timestamp', () => {
    const date = new Date('2026-01-01');
    const message = new Message('assistant', 'Resposta', date);

    expect(message.timestamp).toBe(date);
  });

  it('should return true when two messages are equal', () => {
    const a = new Message('user', 'Olá');
    const b = new Message('user', 'Olá');

    expect(a.equals(b)).toBe(true);
  });

  it('should return false when roles differ', () => {
    const a = new Message('user', 'Olá');
    const b = new Message('assistant', 'Olá');

    expect(a.equals(b)).toBe(false);
  });

  it('should return false when contents differ', () => {
    const a = new Message('user', 'Olá');
    const b = new Message('user', 'Tchau');

    expect(a.equals(b)).toBe(false);
  });
});

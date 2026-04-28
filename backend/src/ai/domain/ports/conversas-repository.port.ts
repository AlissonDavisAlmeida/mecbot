import { Conversation } from '../../domain/entities/conversation.entity';
import { Message } from '../../domain/value-objects/message.vo';

export const CONVERSAS_REPOSITORY_TOKEN = Symbol('CONVERSAS_REPOSITORY');

/**
 * Representa uma mensagem já persistida, incluindo o id gerado pelo banco.
 * Usado na listagem paginada para o frontend.
 */
export interface ConversationMessageRecord {
  id: string;
  conteudo: string;
  role: 'user' | 'assistant';
  createdAt: Date;
}

/**
 * Resultado paginado de mensagens de uma conversa.
 */
export interface ConversationMessagesPage {
  messages: ConversationMessageRecord[];
  total: number;
}

export interface IConversasRepository {
  /**
   * Cria ou retorna conversa aberta (status=open) existente
   */
  getOrCreateConversation(empresaId: string, cliente: string): Promise<Conversation>;

  /**
   * Adiciona uma mensagem à conversa
   */
  addMessage(conversaId: string, message: Message): Promise<void>;

  /**
   * Busca as últimas N mensagens de uma conversa
   */
  getLastMessages(conversaId: string, limit: number): Promise<Message[]>;

  /**
   * Carrega conversa com todas suas mensagens
   */
  loadConversation(conversaId: string): Promise<Conversation | null>;

  /**
   * Fecha uma conversa (status=closed), impedindo reutilização futura
   */
  closeConversation(conversaId: string): Promise<void>;

  /**
   * Busca mensagens de uma conversa com isolamento multitenant.
   * Valida que a conversa pertence à empresa e ao cliente informados.
   */
  findMessagesByConversation(
    conversaId: string,
    empresaId: string,
    cliente: string,
    limit: number,
    offset: number,
  ): Promise<ConversationMessagesPage>;
}

export class ChatRequestDto {
  empresaId: string;
  cliente: string;
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;

  constructor(
    empresaId: string,
    cliente: string,
    message: string,
    conversationHistory?: Array<{ role: string; content: string }>,
  ) {
    this.empresaId = empresaId;
    this.cliente = cliente;
    this.message = message;
    this.conversationHistory = conversationHistory;
  }
}

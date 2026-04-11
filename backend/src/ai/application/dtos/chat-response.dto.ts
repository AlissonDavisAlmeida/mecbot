export class ChatResponseDto {
  readonly response: string;
  readonly cliente: string;
  readonly empresaId: string;
  readonly timestamp: Date;

  constructor(
    response: string,
    cliente: string,
    empresaId: string,
    timestamp: Date = new Date(),
  ) {
    this.response = response;
    this.cliente = cliente;
    this.empresaId = empresaId;
    this.timestamp = timestamp;
  }
}

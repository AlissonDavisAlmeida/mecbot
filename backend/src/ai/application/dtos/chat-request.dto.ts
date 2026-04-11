export class ChatRequestDto {
  customerId: string;
  workshopId: string;
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;

    constructor(customerId: string, workshopId: string, message: string, conversationHistory?: Array<{ role: string; content: string }>) {
        this.customerId = customerId;
        this.workshopId = workshopId;
        this.message = message;
        this.conversationHistory = conversationHistory;
    }
}

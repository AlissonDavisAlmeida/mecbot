export class ChatResponseDto {
  readonly response: string;
  readonly customerId: string;
  readonly workshopId: string;
  readonly timestamp: Date;

    constructor(response: string, customerId: string, workshopId: string, timestamp: Date = new Date()) {
        this.response = response;
        this.customerId = customerId;
        this.workshopId = workshopId;
        this.timestamp = timestamp;
    }
}

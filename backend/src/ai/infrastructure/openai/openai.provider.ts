import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';


import { IAIProvider } from '../../domain/ports/ai-provider.port';
import { Message } from '../../domain/value-objects/message.vo';

@Injectable()
export class OpenAIProvider implements IAIProvider {
  private readonly client: OpenAI;
  private readonly model = 'gpt-4o-mini';

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateResponse(messages: Message[]): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response received from AI provider');
    }

    return content;
  }
}

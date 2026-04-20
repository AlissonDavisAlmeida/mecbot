import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';

import { AiService } from './ai.service';
import { ChatRequestDto } from './application/dtos/chat-request.dto';
import { ChatResponseDto } from './application/dtos/chat-response.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { TenantGuard } from '@/auth/guards/tenant.guard';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @UseGuards(JwtAuthGuard, TenantGuard)
  @HttpCode(HttpStatus.OK)
  async chat(@Body() dto: ChatRequestDto): Promise<ChatResponseDto> {
    return this.aiService.sendMessage(dto);
  }
}

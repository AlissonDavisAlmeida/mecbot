import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';

import { AiService } from './ai.service';
import { ChatRequestDto } from './application/dtos/chat-request.dto';
import { ChatResponseDto } from './application/dtos/chat-response.dto';
import { GetMessagesDto, GetMessagesResponseDto } from './application/dtos/get-messages.dto';
import { GetConversationMessagesUseCase } from './application/use-cases/get-conversation-messages.use-case';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { TenantGuard } from '@/auth/guards/tenant.guard';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly getConversationMessagesUseCase: GetConversationMessagesUseCase,
  ) {}

  @Post('chat')
  @UseGuards(JwtAuthGuard, TenantGuard)
  @HttpCode(HttpStatus.OK)
  async chat(@Body() dto: ChatRequestDto): Promise<ChatResponseDto> {
    return this.aiService.sendMessage(dto);
  }

  @Get('messages')
  @UseGuards(JwtAuthGuard, TenantGuard)
  @HttpCode(HttpStatus.OK)
  async getMessages(
    @Query('conversaId') conversaId: string,
    @Query('empresaId') empresaId: string,
    @Query('cliente') cliente: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<GetMessagesResponseDto> {
    const dto = new GetMessagesDto()
    dto.conversaId = conversaId
    dto.empresaId = empresaId
    dto.cliente = cliente
    dto.limit = limit ? parseInt(limit, 10) : 50
    dto.offset = offset ? parseInt(offset, 10) : 0

    return this.getConversationMessagesUseCase.execute(dto)
  }
}

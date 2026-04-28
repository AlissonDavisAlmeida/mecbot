import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ConversationCleaner {
    private readonly logger = new Logger(ConversationCleaner.name);
    constructor(private prisma: PrismaService) { }

    @Cron(CronExpression.EVERY_MINUTE) // roda a cada 1 min
    async closeInactiveConversations() {
        const limite = new Date(Date.now() - 30 * 60 * 1000); // 30 minutos

        const result = await this.prisma.conversa.updateMany({
            where: {
                status: 'open',
                updatedAt: {
                    lt: limite,
                },
            },
            data: {
                status: 'closed',
            },
        });

        if (result.count > 0) {
            this.logger.log(`${result.count} conversations closed due to inactivity`);
        }

    }
}
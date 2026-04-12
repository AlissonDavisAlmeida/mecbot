-- CreateTable
CREATE TABLE "MensagemArquivada" (
    "id" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversaId" TEXT NOT NULL,

    CONSTRAINT "MensagemArquivada_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MensagemArquivada_conversaId_createdAt_idx" ON "MensagemArquivada"("conversaId", "createdAt");

-- AddForeignKey
ALTER TABLE "MensagemArquivada" ADD CONSTRAINT "MensagemArquivada_conversaId_fkey" FOREIGN KEY ("conversaId") REFERENCES "Conversa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

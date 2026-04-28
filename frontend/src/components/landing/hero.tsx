import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, MessageCircle } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-16 text-center">
      {/* Background gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(var(--primary)/0.08),transparent)]"
      />

      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        IA especializada em mecânicas automotivas
      </div>

      {/* Title */}
      <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
        Seu atendente{' '}
        <span className="relative">
          <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            24/7 no WhatsApp
          </span>
        </span>
        , com IA
      </h1>

      {/* Subtitle */}
      <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
        Automatize orçamentos, agendamentos e atendimento da sua oficina mecânica.
        Nunca perca um cliente por falta de resposta — mesmo fora do horário.
      </p>

      {/* CTAs */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button size="lg" className="h-12 px-8 text-base" asChild>
          <Link href="/register">
            Começar agora — grátis
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
          <Link href="/login">Já tenho uma conta</Link>
        </Button>
      </div>

      {/* Social proof */}
      <p className="mt-8 text-xs text-muted-foreground">
        Sem cartão de crédito · Configuração em menos de 5 minutos
      </p>

      {/* Mock WhatsApp preview */}
      <div className="relative mx-auto mt-16 w-full max-w-sm rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/10">
        {/* Header */}
        <div className="flex items-center gap-3 rounded-t-2xl border-b border-border/60 bg-muted/30 px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500 text-white">
            <MessageCircle className="size-4" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs font-semibold text-foreground">MecBot IA</p>
            <p className="text-[10px] text-emerald-500">online agora</p>
          </div>
          <div className="flex gap-1">
            <span className="size-2.5 rounded-full bg-red-400" />
            <span className="size-2.5 rounded-full bg-amber-400" />
            <span className="size-2.5 rounded-full bg-emerald-400" />
          </div>
        </div>

        {/* Chat messages */}
        <div className="space-y-3 p-4">
          {/* Customer message */}
          <div className="flex justify-end">
            <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-emerald-500 px-3 py-2 text-left text-xs text-white">
              Olá! Meu carro tá fazendo um barulho estranho no motor. Quanto custa
              pra dar uma olhada?
              <p className="mt-1 text-right text-[9px] text-white/70">14:22 ✓✓</p>
            </div>
          </div>

          {/* Bot response */}
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-left text-xs text-foreground">
              Olá! 👋 Sou o assistente da <strong>Oficina do Zé</strong>. A
              diagnose inicial tem um custo de{' '}
              <strong>R$ 80,00</strong>, incluindo avaliação completa do motor.
              <br />
              <br />
              Gostaria de agendar? Temos horários disponíveis amanhã às{' '}
              <strong>9h, 14h e 16h</strong>. 🔧
              <p className="mt-1 text-[9px] text-muted-foreground">14:22</p>
            </div>
          </div>

          {/* Customer message */}
          <div className="flex justify-end">
            <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-emerald-500 px-3 py-2 text-left text-xs text-white">
              Perfeito! Quero amanhã às 9h
              <p className="mt-1 text-right text-[9px] text-white/70">14:23 ✓✓</p>
            </div>
          </div>

          {/* Bot confirmation */}
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-left text-xs text-foreground">
              ✅ <strong>Agendamento confirmado!</strong>
              <br />
              📅 Amanhã, 9h00
              <br />
              📍 Rua das Oficinas, 123
              <br />
              <br />
              Você receberá um lembrete 1h antes. Até amanhã! 😊
              <p className="mt-1 text-[9px] text-muted-foreground">14:23</p>
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2 rounded-b-2xl border-t border-border/60 bg-muted/30 px-4 py-3">
          <div className="flex-1 rounded-full bg-background px-4 py-2 text-[11px] text-muted-foreground">
            Digite uma mensagem...
          </div>
          <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500">
            <ArrowRight className="size-3.5 text-white" />
          </div>
        </div>
      </div>
    </section>
  )
}

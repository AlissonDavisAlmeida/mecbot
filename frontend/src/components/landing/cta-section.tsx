import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap } from 'lucide-react'

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,hsl(var(--primary)/0.06),transparent)]"
      />

      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Icon */}
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
          <Zap className="size-6 text-foreground" />
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Pronto para transformar o atendimento da sua oficina?
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
          Comece hoje mesmo. Configure em 5 minutos, sem cartão de crédito. Veja o MecBot
          respondendo seus clientes ainda hoje.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" className="h-12 px-8 text-base" asChild>
            <Link href="/register">
              Criar conta gratuitamente
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
            <Link href="/login">Já tenho conta</Link>
          </Button>
        </div>

        {/* Trust signals */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <svg className="size-3.5 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
            </svg>
            Configuração em 5 minutos
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="size-3.5 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
            </svg>
            Sem cartão de crédito
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="size-3.5 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
            </svg>
            Suporte em português
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="size-3.5 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
            </svg>
            Cancele quando quiser
          </span>
        </div>
      </div>
    </section>
  )
}

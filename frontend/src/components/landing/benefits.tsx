import { Clock, TrendingUp, Wrench, ShieldCheck, Users, BarChart3 } from 'lucide-react'

const BENEFITS = [
  {
    icon: Clock,
    title: 'Atendimento 24 horas',
    description:
      'Seu WhatsApp responde automaticamente em segundos, mesmo à meia-noite ou nos finais de semana. Nenhum cliente fica sem resposta.',
  },
  {
    icon: TrendingUp,
    title: 'Mais clientes, menos esforço',
    description:
      'Clientes que recebem resposta rápida têm 3x mais chance de fechar serviço. Automatize o primeiro contato e converta mais.',
  },
  {
    icon: Wrench,
    title: 'Orçamentos instantâneos',
    description:
      'A IA gera estimativas de custo baseadas nos serviços da sua oficina. Sem precisar parar o que está fazendo para responder.',
  },
  {
    icon: ShieldCheck,
    title: 'Dados seguros e isolados',
    description:
      'Cada oficina tem seu ambiente exclusivo. Seus dados e conversas de clientes nunca se misturam com outras empresas.',
  },
  {
    icon: Users,
    title: 'Multi-atendimento simultâneo',
    description:
      'Atenda dezenas de clientes ao mesmo tempo, sem fila de espera e sem contratar mais atendentes.',
  },
  {
    icon: BarChart3,
    title: 'Painel de controle completo',
    description:
      'Acompanhe todas as conversas, agendamentos e histórico de atendimentos em um único painel intuitivo.',
  },
]

export function Benefits() {
  return (
    <section id="beneficios" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Por que MecBot?
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tudo que sua oficina precisa para crescer
          </h2>
          <p className="mt-4 text-muted-foreground">
            Chega de perder clientes por falta de resposta ou por não ter tempo de atender todo
            mundo. O MecBot trabalha enquanto você foca no que faz de melhor.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="group rounded-2xl border border-border/60 bg-card p-6 transition-all duration-200 hover:border-border hover:shadow-sm"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

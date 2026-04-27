import {
  MessageCircle,
  BrainCircuit,
  CalendarCheck,
  FileText,
  Bell,
  Lock,
} from 'lucide-react'

const FEATURES = [
  {
    icon: MessageCircle,
    label: 'WhatsApp nativo',
    description: 'Integração direta com o WhatsApp Business. Nenhum aplicativo extra para o cliente.',
  },
  {
    icon: BrainCircuit,
    label: 'IA generativa especializada',
    description: 'Modelo GPT treinado com linguagem e serviços do setor automotivo.',
  },
  {
    icon: CalendarCheck,
    label: 'Agendamento automático',
    description: 'Consulta disponibilidade e confirma horários sem intervenção humana.',
  },
  {
    icon: FileText,
    label: 'Orçamentos personalizados',
    description: 'Gera estimativas baseadas no catálogo de serviços da sua oficina.',
  },
  {
    icon: Bell,
    label: 'Lembretes automáticos',
    description: 'Envia confirmação e lembrete de agendamento para o cliente.',
  },
  {
    icon: Lock,
    label: 'Multiempresa seguro',
    description: 'Dados isolados por empresa com autenticação JWT e controle de acesso.',
  },
]

export function Features() {
  return (
    <section id="recursos" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left — copy */}
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Recursos
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Tecnologia que trabalha enquanto você{' '}
              <span className="text-muted-foreground">conserta motores</span>
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              O MecBot une inteligência artificial de ponta com a realidade do cotidiano de uma
              oficina mecânica. O resultado: atendimento profissional, ágil e escalável — sem
              aumentar sua equipe.
            </p>

            {/* Feature list */}
            <ul className="mt-8 space-y-4">
              {FEATURES.map((feature) => {
                const Icon = feature.icon
                return (
                  <li key={feature.label} className="flex items-start gap-4">
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50">
                      <Icon className="size-4 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Right — dashboard mockup */}
          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-xl shadow-black/5">
            {/* Mock browser chrome */}
            <div className="mb-3 flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-amber-400" />
              <span className="size-2.5 rounded-full bg-emerald-400" />
              <div className="ml-2 flex-1 rounded-md bg-muted px-3 py-1 text-[11px] text-muted-foreground">
                app.mecbot.com.br/dashboard
              </div>
            </div>

            {/* Mock dashboard content */}
            <div className="space-y-3">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Atendimentos hoje', value: '24' },
                  { label: 'Agendados', value: '8' },
                  { label: 'Taxa de resposta', value: '100%' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Conversation list */}
              <div className="rounded-lg border border-border/60">
                <div className="border-b border-border/60 px-3 py-2 text-xs font-medium text-muted-foreground">
                  Conversas recentes
                </div>
                {[
                  {
                    name: 'João Silva',
                    msg: 'Quero fazer troca de óleo',
                    time: 'agora',
                    status: 'novo',
                  },
                  {
                    name: 'Maria Souza',
                    msg: 'Confirmei para amanhã às 10h',
                    time: '5 min',
                    status: 'agendado',
                  },
                  {
                    name: 'Pedro Costa',
                    msg: 'Orçamento aprovado!',
                    time: '12 min',
                    status: 'concluído',
                  },
                ].map((conv) => (
                  <div
                    key={conv.name}
                    className="flex items-center gap-3 border-b border-border/40 px-3 py-2.5 last:border-0"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                      {conv.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground">{conv.name}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{conv.msg}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <p className="text-[10px] text-muted-foreground">{conv.time}</p>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                          conv.status === 'novo'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : conv.status === 'agendado'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        }`}
                      >
                        {conv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

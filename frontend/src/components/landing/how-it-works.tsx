const STEPS = [
  {
    number: '01',
    title: 'Cliente manda mensagem',
    description:
      'O cliente entra em contato pelo WhatsApp da sua oficina, como sempre fez — sem precisar baixar nenhum aplicativo ou criar conta.',
    detail: 'Funciona com qualquer número de WhatsApp existente',
  },
  {
    number: '02',
    title: 'MecBot responde com IA',
    description:
      'Em segundos, o MecBot responde com linguagem natural, fornece estimativas de preço, disponibilidade de agenda e tira dúvidas comuns sobre serviços.',
    detail: 'IA treinada com vocabulário e serviços do setor automotivo',
  },
  {
    number: '03',
    title: 'Você acompanha e decide',
    description:
      'No painel web, você visualiza todas as conversas em tempo real, confirma agendamentos, ajusta respostas e mantém o controle total do seu negócio.',
    detail: 'Notificações instantâneas quando você precisa intervir',
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Como funciona
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simples para você, impressionante para o cliente
          </h2>
          <p className="mt-4 text-muted-foreground">
            Configuração em menos de 5 minutos. Sem necessidade de equipe técnica.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Connector line (desktop) */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
          />

          <div className="grid gap-8 lg:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                {/* Step number */}
                <div className="relative z-10 mb-6 flex size-16 items-center justify-center rounded-full border border-border bg-background shadow-sm">
                  <span className="text-lg font-bold text-foreground">{step.number}</span>
                </div>

                {/* Connector arrow (mobile only between steps) */}
                {index < STEPS.length - 1 && (
                  <div
                    aria-hidden
                    className="mb-6 flex size-6 items-center justify-center lg:hidden"
                  >
                    <svg viewBox="0 0 24 24" className="size-4 text-muted-foreground">
                      <path
                        d="M12 5v14M5 12l7 7 7-7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </div>
                )}

                <h3 className="mb-3 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                <p className="mt-4 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

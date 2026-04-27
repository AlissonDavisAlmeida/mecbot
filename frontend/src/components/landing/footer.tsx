import Link from 'next/link'
import { Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/20 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="size-3.5" />
              </div>
              <span className="font-bold text-foreground">MecBot</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Atendimento inteligente via WhatsApp para oficinas mecânicas. Automatize,
              escale e fidelize seus clientes com IA.
            </p>
          </div>

          {/* Product links */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground">
              Produto
            </p>
            <ul className="space-y-2">
              {[
                { label: 'Benefícios', href: '#beneficios' },
                { label: 'Como funciona', href: '#como-funciona' },
                { label: 'Recursos', href: '#recursos' },
                { label: 'Criar conta', href: '/register' },
                { label: 'Entrar', href: '/login' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground">
              Legal
            </p>
            <ul className="space-y-2">
              {[
                { label: 'Termos de uso', href: '/terms' },
                { label: 'Política de privacidade', href: '/privacy' },
                { label: 'LGPD', href: '/lgpd' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MecBot. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Feito com ❤️ para mecânicos brasileiros
          </p>
        </div>
      </div>
    </footer>
  )
}

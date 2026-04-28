'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useLogin } from '@/modules/auth/hooks/use-login'

export default function LoginPage() {
  const [form, setForm] = useState({
    email: '',
    senha: '',
  })

  const { mutate, isPending, error } = useLogin()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutate(form)
  }

  const errorMessage =
    error instanceof Error ? error.message : error ? 'Erro ao fazer login' : null

  return (
    <div className="space-y-4">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="size-4" />
        Voltar para página inicial
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>
            Faça login com sua conta no MecBot
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            {errorMessage && (
              <p className="text-sm text-destructive rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2">
                {errorMessage}
              </p>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="joao@oficina.com.br"
                value={form.email}
                onChange={handleChange}
                required
                disabled={isPending}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                placeholder="Sua senha"
                value={form.senha}
                onChange={handleChange}
                required
                disabled={isPending}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isPending} size="lg">
              {isPending && <Loader2 className="animate-spin" />}
              {isPending ? 'Entrando…' : 'Entrar'}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Não tem uma conta?{' '}
              <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                Criar conta
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

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
import { useRegister } from '@/modules/auth/hooks/use-register'

export default function RegisterPage() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    nomeEmpresa: '',
  })

  const { mutate, isPending, error } = useRegister()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.senha !== form.confirmarSenha) return
    const { confirmarSenha: _, ...payload } = form
    mutate(payload)
  }

  const senhasMismatch = form.confirmarSenha.length > 0 && form.senha !== form.confirmarSenha

  const errorMessage =
    error instanceof Error ? error.message : error ? 'Erro ao criar conta' : null

  return (
    <div className="space-y-4">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="size-4" />
        Voltar para página inicial
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>
            Crie sua conta e comece a usar o MecBot na sua oficina
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
              <Label htmlFor="nomeEmpresa">Nome da oficina / empresa</Label>
              <Input
                id="nomeEmpresa"
                name="nomeEmpresa"
                type="text"
                placeholder="Ex: Oficina do Carlos"
                value={form.nomeEmpresa}
                onChange={handleChange}
                required
                disabled={isPending}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nome">Seu nome completo</Label>
              <Input
                id="nome"
                name="nome"
                type="text"
                placeholder="João Silva"
                value={form.nome}
                onChange={handleChange}
                required
                disabled={isPending}
              />
            </div>

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
                placeholder="Mínimo 8 caracteres"
                value={form.senha}
                onChange={handleChange}
                required
                minLength={8}
                disabled={isPending}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmarSenha">Confirmar senha</Label>
              <Input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                placeholder="Repita a senha"
                value={form.confirmarSenha}
                onChange={handleChange}
                required
                disabled={isPending}
                className={senhasMismatch ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {senhasMismatch && (
                <p className="text-xs text-destructive">As senhas não coincidem</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full"
              disabled={isPending || senhasMismatch}
              size="lg"
            >
              {isPending && <Loader2 className="animate-spin" />}
              {isPending ? 'Criando conta…' : 'Criar conta grátis'}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                Entrar
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

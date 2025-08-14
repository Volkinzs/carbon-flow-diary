import { useState } from 'react'
import { Button } from '@/components/ui/eco-button'
import { Input } from '@/components/ui/eco-input'
import { Card } from '@/components/ui/card'
import { Leaf } from 'lucide-react'

interface LoginFormProps {
  onLogin: (email: string, password: string) => void
  onToggleMode: () => void
  isLoginMode: boolean
}

export const LoginForm = ({ onLogin, onToggleMode, isLoginMode }: LoginFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(email, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-card-gradient border border-primary/20">
              <Leaf className="w-12 h-12 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Carbon Tracker</h1>
            <p className="text-muted-foreground mt-2">
              Monitore sua pegada de carbono e ajude o planeta 🌱
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="p-8 bg-card-gradient border-border/50 backdrop-blur-sm shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                type="email"
                label="E-mail"
                floating
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                label="Senha"
                floating
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {!isLoginMode && (
                <Input
                  type="password"
                  label="Confirmar Senha"
                  floating
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              )}
            </div>

            <Button 
              type="submit" 
              variant="eco" 
              size="xl" 
              className="w-full"
            >
              {isLoginMode ? 'Entrar' : 'Criar Conta'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={onToggleMode}
                className="text-primary hover:text-primary-glow transition-colors"
              >
                {isLoginMode 
                  ? 'Não tem conta? Cadastre-se' 
                  : 'Já tem conta? Faça login'
                }
              </button>
            </div>
          </form>
        </Card>

        {/* Planet Illustration */}
        <div className="text-center opacity-50">
          <div className="inline-block p-6 rounded-full bg-eco-gradient">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Leaf className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
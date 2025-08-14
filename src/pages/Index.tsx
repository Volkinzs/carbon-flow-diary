import { useState } from 'react'
import { LoginForm } from '@/components/carbon/LoginForm'
import { HabitsWizard } from '@/components/carbon/HabitsWizard'
import { Dashboard } from '@/components/carbon/Dashboard'
import { useToast } from '@/hooks/use-toast'

type AppState = 'login' | 'wizard' | 'dashboard'

const Index = () => {
  const [appState, setAppState] = useState<AppState>('login')
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [userHabits, setUserHabits] = useState<any>(null)
  const { toast } = useToast()

  const handleLogin = (email: string, password: string) => {
    // Simulate login/register
    toast({
      title: isLoginMode ? "Login realizado!" : "Conta criada!",
      description: `Bem-vindo ao Carbon Tracker, ${email}`,
      className: "bg-card-gradient border-primary/20 text-foreground",
    })
    
    setAppState('wizard')
  }

  const handleWizardComplete = (habits: any) => {
    setUserHabits(habits)
    toast({
      title: "Perfil configurado!",
      description: "Agora você pode acompanhar sua pegada de carbono",
      className: "bg-card-gradient border-primary/20 text-foreground",
    })
    setAppState('dashboard')
  }

  const toggleLoginMode = () => {
    setIsLoginMode(!isLoginMode)
  }

  return (
    <div className="min-h-screen bg-background">
      {appState === 'login' && (
        <LoginForm
          onLogin={handleLogin}
          onToggleMode={toggleLoginMode}
          isLoginMode={isLoginMode}
        />
      )}
      
      {appState === 'wizard' && (
        <HabitsWizard onComplete={handleWizardComplete} />
      )}
      
      {appState === 'dashboard' && userHabits && (
        <Dashboard userHabits={userHabits} />
      )}
    </div>
  )
}

export default Index
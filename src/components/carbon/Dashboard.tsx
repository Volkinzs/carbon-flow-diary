import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/eco-button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Leaf, 
  TrendingDown, 
  TrendingUp, 
  Award, 
  Lightbulb,
  Home,
  BarChart3,
  Trophy,
  User,
  Car,
  Zap,
  Target
} from 'lucide-react'

interface DashboardProps {
  userHabits: any
}

const tips = [
  {
    id: 1,
    icon: Car,
    title: "Use transporte público",
    description: "Reduza 2.3kg CO2/dia usando transporte público ao invés do carro",
    impact: "Alto impacto"
  },
  {
    id: 2,
    icon: Zap,
    title: "Troque para LED",
    description: "Lâmpadas LED consomem 80% menos energia que incandescentes",
    impact: "Médio impacto"
  },
  {
    id: 3,
    icon: Leaf,
    title: "Dieta plant-based",
    description: "Uma refeição vegetariana por dia pode reduzir 0.5kg CO2",
    impact: "Alto impacto"
  }
]

const rankingData = [
  { name: "Ana Silva", score: 95, avatar: "AS", medal: "🥇" },
  { name: "Carlos", score: 88, avatar: "CA", medal: "🥈" },
  { name: "Você", score: 75, avatar: "VO", medal: "🥉" },
  { name: "Marina", score: 70, avatar: "MA", medal: "" },
  { name: "João", score: 65, avatar: "JO", medal: "" },
]

export const Dashboard = ({ userHabits }: DashboardProps) => {
  const [flippedCard, setFlippedCard] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState('home')

  // Calculate carbon footprint based on habits
  const calculateFootprint = () => {
    let total = 0
    Object.values(userHabits).forEach((value: any) => {
      if (value === 'high') total += 30
      else if (value === 'medium') total += 20
      else total += 10
    })
    return total
  }

  const currentFootprint = calculateFootprint()
  const targetFootprint = 50 // kg CO2/month
  const progress = Math.min((targetFootprint / currentFootprint) * 100, 100)

  const handleCardFlip = (cardId: number) => {
    setFlippedCard(flippedCard === cardId ? null : cardId)
  }

  if (activeTab !== 'home') {
    return (
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-card-gradient border-t border-border p-4 z-50">
          <div className="flex justify-around max-w-md mx-auto">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'habits', icon: Target, label: 'Hábitos' },
              { id: 'ranking', icon: Trophy, label: 'Ranking' },
              { id: 'profile', icon: User, label: 'Perfil' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center gap-1 transition-colors ${
                    activeTab === item.id ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Content for other tabs */}
        <div className="p-4 pb-24">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {activeTab === 'habits' && 'Hábitos'}
              {activeTab === 'ranking' && 'Ranking'}
              {activeTab === 'profile' && 'Perfil'}
            </h2>
            <p className="text-muted-foreground">
              Esta seção está em desenvolvimento
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Sua pegada de carbono hoje</p>
          </div>
          <div className="p-2 rounded-full bg-primary/10">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-6 pb-24">
        {/* Current Footprint Card */}
        <Card className="p-6 bg-card-gradient border-border/50 shadow-card">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Pegada Atual
            </h3>
            
            {/* Gauge */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="hsl(var(--muted))"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="hsl(var(--primary))"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${(currentFootprint / 100) * 283} 283`}
                  className="transition-all duration-2000 ease-out"
                  style={{ filter: 'drop-shadow(0 0 10px hsl(var(--primary) / 0.5))' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {currentFootprint}
                </span>
                <span className="text-xs text-muted-foreground">
                  kg CO2/mês
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Meta: {targetFootprint}kg</span>
                <span className={progress >= 100 ? 'text-primary' : 'text-yellow-500'}>
                  {progress >= 100 ? 'Meta atingida!' : 'Em progresso'}
                </span>
              </div>
              <Progress value={Math.min(progress, 100)} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Timeline Card */}
        <Card className="p-6 bg-card-gradient border-border/50 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Histórico Semanal
          </h3>
          
          <div className="space-y-3">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, index) => {
              const value = Math.random() * 100
              const isToday = index === 2
              return (
                <div key={day} className="flex items-center gap-3">
                  <span className={`text-sm w-8 ${isToday ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                    {day}
                  </span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className={`h-full rounded-full ${isToday ? 'bg-primary' : 'bg-primary/70'}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">
                    {Math.round(value)}%
                  </span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Tips Cards */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Dicas Personalizadas
          </h3>
          
          <div className="grid gap-4">
            {tips.map((tip) => {
              const Icon = tip.icon
              const isFlipped = flippedCard === tip.id
              
              return (
                <div
                  key={tip.id}
                  className={`flip-card ${isFlipped ? 'flipped' : ''} h-32 cursor-pointer`}
                  onClick={() => handleCardFlip(tip.id)}
                >
                  {/* Front */}
                  <Card className="flip-card-front p-4 bg-card-gradient border-border/50 shadow-card">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{tip.title}</h4>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {tip.impact}
                        </Badge>
                      </div>
                    </div>
                  </Card>

                  {/* Back */}
                  <Card className="flip-card-back p-4 bg-card-gradient border-border/50 shadow-card">
                    <p className="text-sm text-foreground leading-relaxed">
                      {tip.description}
                    </p>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mini Ranking */}
        <Card className="p-6 bg-card-gradient border-border/50 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Ranking Eco
          </h3>
          
          <div className="space-y-3">
            {rankingData.map((user, index) => (
              <div
                key={user.name}
                className={`flex items-center gap-3 p-2 rounded-lg ${
                  user.name === 'Você' ? 'bg-primary/10 border border-primary/20' : ''
                }`}
              >
                <span className="text-lg">{user.medal || `${index + 1}º`}</span>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{user.name}</p>
                </div>
                <span className="text-sm text-primary font-semibold">
                  {user.score} pts
                </span>
              </div>
            ))}
          </div>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card-gradient border-t border-border p-4 z-50">
        <div className="flex justify-around max-w-md mx-auto">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'habits', icon: Target, label: 'Hábitos' },
            { id: 'ranking', icon: Trophy, label: 'Ranking' },
            { id: 'profile', icon: User, label: 'Perfil' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  activeTab === item.id ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
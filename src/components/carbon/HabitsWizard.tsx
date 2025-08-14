import { useState } from 'react'
import { Button } from '@/components/ui/eco-button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Car, Bike, Zap, Utensils, ShoppingBag, Home, ArrowLeft, ArrowRight } from 'lucide-react'

interface HabitsWizardProps {
  onComplete: (habits: any) => void
}

const wizardSteps = [
  {
    title: "Transporte",
    subtitle: "Como você se locomove no dia a dia?",
    options: [
      { id: 'car', label: 'Carro próprio', icon: Car, value: 'high' },
      { id: 'public', label: 'Transporte público', icon: Car, value: 'medium' },
      { id: 'bike', label: 'Bicicleta/Caminhada', icon: Bike, value: 'low' },
    ]
  },
  {
    title: "Energia",
    subtitle: "Qual seu consumo de energia em casa?",
    options: [
      { id: 'high-energy', label: 'Uso intenso (AC sempre ligado)', icon: Zap, value: 'high' },
      { id: 'medium-energy', label: 'Uso moderado', icon: Zap, value: 'medium' },
      { id: 'low-energy', label: 'Uso consciente (LED, economia)', icon: Zap, value: 'low' },
    ]
  },
  {
    title: "Alimentação",
    subtitle: "Qual seu padrão alimentar?",
    options: [
      { id: 'meat', label: 'Muita carne vermelha', icon: Utensils, value: 'high' },
      { id: 'mixed', label: 'Dieta mista equilibrada', icon: Utensils, value: 'medium' },
      { id: 'plant', label: 'Vegetariano/Vegano', icon: Utensils, value: 'low' },
    ]
  },
  {
    title: "Consumo",
    subtitle: "Como são seus hábitos de compra?",
    options: [
      { id: 'frequent', label: 'Compras frequentes', icon: ShoppingBag, value: 'high' },
      { id: 'planned', label: 'Compras planejadas', icon: ShoppingBag, value: 'medium' },
      { id: 'minimal', label: 'Consumo minimalista', icon: ShoppingBag, value: 'low' },
    ]
  }
]

export const HabitsWizard = ({ onComplete }: HabitsWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const handleAnswer = (stepId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [stepId]: value }))
  }

  const nextStep = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      onComplete(answers)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const currentStepData = wizardSteps[currentStep]
  const progress = ((currentStep + 1) / wizardSteps.length) * 100
  const stepKey = currentStepData.title.toLowerCase()
  const selectedAnswer = answers[stepKey]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">
              Passo {currentStep + 1} de {wizardSteps.length}
            </span>
            <span className="text-sm text-primary font-medium">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <Card className="p-8 bg-card-gradient border-border/50 shadow-card mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-muted-foreground">
              {currentStepData.subtitle}
            </p>
          </div>

          {/* Options */}
          <div className="grid gap-4 mb-8">
            {currentStepData.options.map((option) => {
              const Icon = option.icon
              const isSelected = selectedAnswer === option.value
              
              return (
                <Button
                  key={option.id}
                  variant={isSelected ? "eco" : "card"}
                  size="card"
                  onClick={() => handleAnswer(stepKey, option.value)}
                  className={`justify-start ${isSelected ? 'ring-2 ring-primary' : ''}`}
                >
                  <Icon className="w-6 h-6 mr-4" />
                  <span className="text-base font-medium">{option.label}</span>
                </Button>
              )
            })}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>

          <Button
            variant="eco"
            onClick={nextStep}
            disabled={!selectedAnswer}
            className="flex items-center gap-2"
          >
            {currentStep === wizardSteps.length - 1 ? 'Finalizar' : 'Próximo'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
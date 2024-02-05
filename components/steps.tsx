"use client"

import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ArrowLeft, ArrowRight } from "lucide-react"

const StepsContext = React.createContext({
  steps: [] as any[],
  currentStep: 0,
  setCurrentStep: (step: number) => {},
})

export function Steps({ steps, children }: any) {
  const [currentStep, setCurrentStep] = React.useState(0)

  return (
    <StepsContext.Provider value={{ steps, currentStep, setCurrentStep }}>
      {children}
    </StepsContext.Provider>
  )
}

export function StepContent() {
  const { steps, currentStep } = React.useContext(StepsContext)
  const { content } = steps[currentStep]
  return content
}

export function StepPreview() {
  const { steps, currentStep } = React.useContext(StepsContext)
  const { preview } = steps[currentStep]
  return preview
}
export function NextStep({ className }: { className?: string }) {
  const { steps, currentStep, setCurrentStep } = React.useContext(StepsContext)
  if (currentStep === steps.length - 1) return null

  return (
    <button
      onClick={() => setCurrentStep(currentStep + 1)}
      className={cn("text-purple-400 underline text-left", className)}
    >
      Next: {steps[currentStep + 1].title}
    </button>
  )
}

export function StepsNav({ className }: { className?: string }) {
  const { steps, currentStep, setCurrentStep } = React.useContext(StepsContext)
  return (
    <nav className={cn("flex w-full", className)}>
      <button
        onClick={() => setCurrentStep(currentStep - 1)}
        className="w-8 flex justify-center items-center disabled:opacity-20"
        disabled={currentStep === 0}
      >
        <ArrowLeft size={18} />
      </button>
      <Select
        value={currentStep.toString()}
        onValueChange={(value) => setCurrentStep(Number(value))}
      >
        <SelectTrigger className="flex-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {steps.map((step, i) => (
            <SelectItem value={i.toString()} key={i}>
              {i}. {step.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <button
        onClick={() => setCurrentStep(currentStep + 1)}
        className="w-8 flex justify-center items-center disabled:opacity-20"
        disabled={currentStep === steps.length - 1}
      >
        <ArrowRight size={18} />
      </button>
    </nav>
  )
}

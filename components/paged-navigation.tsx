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
import { useSteps } from "codehike/scrolly"

export function NextStep({ className }: { className?: string }) {
  const { steps, selectedIndex, selectIndex } = useSteps()

  if (selectedIndex === steps.length - 1) return null

  return (
    <button
      onClick={() => selectIndex(selectedIndex + 1)}
      className={cn(
        "text-purple-400 hover:text-purple-300 underline text-left",
        className,
      )}
    >
      Next: {steps[selectedIndex + 1].title}
    </button>
  )
}

export function StepsNav({ className }: { className?: string }) {
  const { steps, selectedIndex, selectIndex } = useSteps()
  return (
    <nav className={cn("flex w-full", className)}>
      <button
        onClick={() => selectIndex(selectedIndex - 1)}
        className="w-8 flex justify-center items-center disabled:opacity-20"
        disabled={selectedIndex === 0}
      >
        <ArrowLeft size={18} />
      </button>
      <Select
        value={selectedIndex.toString()}
        onValueChange={(value) => selectIndex(Number(value))}
      >
        <SelectTrigger className="flex-1 text-left">
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
        onClick={() => selectIndex(selectedIndex + 1)}
        className="w-8 flex justify-center items-center disabled:opacity-20"
        disabled={selectedIndex === steps.length - 1}
      >
        <ArrowRight size={18} />
      </button>
    </nav>
  )
}

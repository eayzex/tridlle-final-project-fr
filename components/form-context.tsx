"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type FormContextType = {
  currentQuestionIndex: number
  setCurrentQuestionIndex: (index: number) => void
  formResponses: Record<string, any>
  updateResponse: (questionId: string, value: any) => void
  isComplete: boolean
  setIsComplete: (value: boolean) => void
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export function FormProvider({ children }: { children: ReactNode }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [formResponses, setFormResponses] = useState<Record<string, any>>({})
  const [isComplete, setIsComplete] = useState(false)

  const updateResponse = (questionId: string, value: any) => {
    setFormResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  return (
    <FormContext.Provider
      value={{
        currentQuestionIndex,
        setCurrentQuestionIndex,
        formResponses,
        updateResponse,
        isComplete,
        setIsComplete,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export function useFormContext() {
  const context = useContext(FormContext)
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider")
  }
  return context
}

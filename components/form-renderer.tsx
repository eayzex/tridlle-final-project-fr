"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useFormContext } from "@/components/form-context"
import { QuestionCard } from "@/components/question-card"
import { ProgressIndicator } from "@/components/progress-indicator"
import { FormEndScreen } from "@/components/form-end-screen"

type FormRendererProps = {
  form: {
    success: boolean
    data: {
      _id: string
      title: string
      description: string
      questions: any[]
    }
  }
  onSubmit: (data: any) => void
}

export function FormRenderer({ form, onSubmit }: FormRendererProps) {
  const { currentQuestionIndex, setCurrentQuestionIndex, formResponses, isComplete, setIsComplete } = useFormContext()

  // Extract the actual form data
  const formData = form.data

  const handleNext = () => {
    if (currentQuestionIndex < formData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setIsComplete(true)
      onSubmit(formResponses)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isComplete) {
        const currentQuestion = formData.questions[currentQuestionIndex]
        const response = formResponses[currentQuestion.id]

        if (response || !currentQuestion.required) {
          handleNext()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentQuestionIndex, formResponses, isComplete])

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-muted/50">
      <header className="container flex h-16 items-center">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span className="text-xl font-bold">{formData.title}</span>
        </div>
      </header>
      <main className="container flex flex-1 flex-col items-center justify-center py-8">
        <div className="w-full max-w-md">
          {!isComplete && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <ProgressIndicator currentStep={currentQuestionIndex + 1} totalSteps={formData.questions.length} />
            </motion.div>
          )}

          {formData.description && !isComplete && (
            <motion.div
              className="mt-4 text-muted-foreground text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {formData.description}
            </motion.div>
          )}

          <div className="relative mt-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              {!isComplete ? (
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <QuestionCard
                    question={formData.questions[currentQuestionIndex]}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    showPrevious={currentQuestionIndex > 0}
                    isLastQuestion={currentQuestionIndex === formData.questions.length - 1}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <FormEndScreen formTitle={formData.title} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}

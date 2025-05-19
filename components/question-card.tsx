"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useFormContext } from "@/components/form-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft } from "lucide-react"

type QuestionCardProps = {
  question: {
    id: string
    type: string
    title: string
    placeholder?: string
    required?: boolean
    options?: { id: string; label: string }[]
  }
  onNext: () => void
  onPrevious: () => void
  showPrevious: boolean
  isLastQuestion: boolean
}

export function QuestionCard({ question, onNext, onPrevious, showPrevious, isLastQuestion }: QuestionCardProps) {
  const { formResponses, updateResponse } = useFormContext()
  const [value, setValue] = useState<any>(formResponses[question.id] || "")
  const [error, setError] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Update local state when switching questions
  useEffect(() => {
    setValue(formResponses[question.id] || "")
    setError(null)
  }, [question.id, formResponses])

  const handleChange = (newValue: any) => {
    setValue(newValue)
    updateResponse(question.id, newValue)
    setError(null)
  }

  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? [...value] : []

    if (checked) {
      if (!currentValues.includes(optionId)) {
        const newValues = [...currentValues, optionId]
        setValue(newValues)
        updateResponse(question.id, newValues)
      }
    } else {
      const newValues = currentValues.filter((id) => id !== optionId)
      setValue(newValues)
      updateResponse(question.id, newValues)
    }

    setError(null)
  }

  const handleNext = () => {
    if (question.required && !value) {
      setError("This field is required")
      return
    }

    setIsAnimating(true)
    setTimeout(() => {
      onNext()
      setIsAnimating(false)
    }, 300)
  }

  const handlePrevious = () => {
    setIsAnimating(true)
    setTimeout(() => {
      onPrevious()
      setIsAnimating(false)
    }, 300)
  }

  const renderQuestionInput = () => {
    switch (question.type) {
      case "text":
      case "email":
      case "phone":
        return (
          <Input
            type={question.type}
            placeholder={question.placeholder}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full"
          />
        )
      case "textarea":
        return (
          <Textarea
            placeholder={question.placeholder}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            className="min-h-[100px] w-full"
          />
        )
      case "radio":
        return (
          <RadioGroup value={value} onValueChange={handleChange} className="space-y-3">
            {question.options?.map((option) => (
              <motion.div
                key={option.id}
                className="flex items-center space-x-2 rounded-md border p-3 transition-colors hover:bg-muted/50"
                whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                transition={{ duration: 0.2 }}
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="w-full cursor-pointer font-normal">
                  {option.label}
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        )
      case "checkbox":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <motion.div
                key={option.id}
                className="flex items-center space-x-2 rounded-md border p-3 transition-colors hover:bg-muted/50"
                whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                transition={{ duration: 0.2 }}
              >
                <Checkbox
                  id={option.id}
                  checked={Array.isArray(value) ? value.includes(option.id) : false}
                  onCheckedChange={(checked) => handleCheckboxChange(option.id, checked as boolean)}
                />
                <Label htmlFor={option.id} className="w-full cursor-pointer font-normal">
                  {option.label}
                </Label>
              </motion.div>
            ))}
          </div>
        )
      case "date":
        return <Input type="date" value={value} onChange={(e) => handleChange(e.target.value)} className="w-full" />
      default:
        return null
    }
  }

  return (
    <motion.div
      className="flex flex-col space-y-6 rounded-xl border bg-card p-6 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <motion.h2
          className="text-2xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {question.title}
        </motion.h2>
        {question.required && (
          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Required
          </motion.p>
        )}
      </div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        {renderQuestionInput()}
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      </motion.div>

      <motion.div
        className="flex justify-between pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        {showPrevious ? (
          <Button variant="outline" onClick={handlePrevious} disabled={isAnimating} className="animated-button-outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        ) : (
          <div></div>
        )}
        <Button onClick={handleNext} disabled={isAnimating} className="animated-button">
          {isLastQuestion ? "Submit" : "Continue"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  )
}

"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type FormPreviewProps = {
  form: {
    id: string
    title: string
    description: string
    questions: any[]
  }
}

export function FormPreview({ form }: FormPreviewProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{form.title}</h2>
        {form.description && <p className="text-muted-foreground">{form.description}</p>}
      </div>

      <div className="space-y-4">
        {form.questions.map((question, index) => (
          <Card key={question.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                {question.title}
                {question.required && <span className="ml-1 text-destructive">*</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>{renderQuestionPreview(question)}</CardContent>
          </Card>
        ))}
      </div>

      <div className="pt-4">
        <Button className="animated-button" disabled>
          Submit (Preview Only)
        </Button>
      </div>
    </div>
  )
}

function renderQuestionPreview(question: any) {
  switch (question.type) {
    case "text":
    case "email":
    case "phone":
      return (
        <Input
          type={question.type}
          placeholder={question.placeholder || `Enter ${question.type}`}
          disabled
          className="max-w-md bg-muted/50"
        />
      )
    case "textarea":
      return (
        <Textarea
          placeholder={question.placeholder || "Enter your answer"}
          disabled
          className="max-w-md h-20 bg-muted/50"
        />
      )
    case "radio":
      return (
        <RadioGroup disabled className="space-y-2">
          {question.options?.map((option: any) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={`preview-${option.id}`} disabled />
              <Label htmlFor={`preview-${option.id}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      )
    case "checkbox":
      return (
        <div className="space-y-2">
          {question.options?.map((option: any) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox id={`preview-${option.id}`} disabled />
              <Label htmlFor={`preview-${option.id}`}>{option.label}</Label>
            </div>
          ))}
        </div>
      )
    case "date":
      return <Input type="date" disabled className="max-w-md bg-muted/50" />
    default:
      return null
  }
}

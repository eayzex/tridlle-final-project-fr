"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FormBuilder } from "@/components/form-builder"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { ThemeToggle } from "@/components/theme-toggle"

export default function CreateFormPage() {
  const [formTitle, setFormTitle] = useState("Untitled Form")
  const [formDescription, setFormDescription] = useState("")
  const [questions, setQuestions] = useState<any[]>([
    {
      type: "text",
      title: "What's your name?",
      placeholder: "Type your full name",
      required: true,
    },
  ])
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  const handleSaveForm = () => {
    // if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create forms.",
        variant: "destructive",
      })
    //   router.push("/login")
    //   return
    // }

    setIsSaving(true)

    // Generate a unique form ID
    const formId = `form_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    // Create the form data object
    const formData = {
      // userId: "587543746534", // Associate form with user
      title: formTitle,
      description: formDescription,
      questions: questions,
    }

    // Save form data to localStorage (in a real app, this would be saved to a database)
    // const existingForms = JSON.parse(localStorage.getItem("triddle_forms") || "[]")
    // localStorage.setItem("triddle_forms", JSON.stringify([...existingForms, formData]))

    // Simulate API call to save form data
    fetch("http://localhost:5000/api/forms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save form");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Form saved successfully:", data);
      })
      .catch((error) => {
        console.error("Error saving form:", error);
        toast({
          title: "Error",
          description: "Failed to save the form. Please try again.",
          variant: "destructive",
        });
        setIsSaving(false);
      });
  
    // Simulate API call delay
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Form created successfully",
        description: "Your form has been saved and is ready to share.",
      })
      // Redirect to the form success page with the form ID
      router.push(`/form-success/${formId}`)
    }, 1500)
  }

  const handleAddQuestion = (questionType: string) => {
    const newQuestion = {
      type: questionType,
      title: `Question ${questions.length + 1}`,
      placeholder: "Enter your answer",
      required: false,
    }

    if (questionType === "radio" || questionType === "checkbox") {
      newQuestion.options = [
        { id: "o1", label: "Option 1" },
        { id: "o2", label: "Option 2" },
      ]
    }

    setQuestions([...questions, newQuestion])
  }

  const handleUpdateQuestion = (index: number, updatedQuestion: any) => {
    const newQuestions = [...questions]
    newQuestions[index] = updatedQuestion
    setQuestions(newQuestions)
  }

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = [...questions]
    newQuestions.splice(index, 1)
    setQuestions(newQuestions)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to Dashboard</span>
              </Link>
            </Button>
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
              <span className="text-xl font-bold">Triddle</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button onClick={handleSaveForm} className="animated-button" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Form
                </>
              )}
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container">
          <motion.div
            className="mb-8 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <Label htmlFor="formTitle">Form Title</Label>
              <Input
                id="formTitle"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="text-xl font-bold"
                placeholder="Enter form title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="formDescription">Form Description (optional)</Label>
              <Textarea
                id="formDescription"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Enter a description for your form"
                className="resize-none"
              />
            </div>
          </motion.div>

          <FormBuilder
            questions={questions}
            onAddQuestion={handleAddQuestion}
            onUpdateQuestion={handleUpdateQuestion}
            onRemoveQuestion={handleRemoveQuestion}
          />
        </div>
      </main>
    </div>
  )
}

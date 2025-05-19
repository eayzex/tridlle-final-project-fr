"use client"

import { useState, useEffect, use } from "react"
import { useParams } from "next/navigation"
import { FormProvider } from "@/components/form-context"
import { FormRenderer } from "@/components/form-renderer"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PublicFormPage() {
  const params = useParams()
  const formId = params.formId as string
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  console.log("Form ID:", formId)

  const fetchFormById = async (formId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/forms/${formId}`, {
        method: "GET",
      })
      console.log("Response:", response)

      // if (!response) {
      //   throw new Error(`Error fetching form:`)
      // }

      const data = await response.json()
      setForm(data)
    } catch (error) {
      console.error("Error fetching form:", error)
      setError("There was a problem fetching the form")
    } finally {
      setLoading(false)
    }
  }

  console.log("Form =======> :", form)

  useEffect(() => {
    fetchFormById(formId)
  }, [formId])


  // useEffect(() => {
  //   // In a real app, this would be an API call to get the form data
  //   const loadForm = () => {
  //     try {
  //       const forms = JSON.parse(localStorage.getItem("triddle_forms") || "[]")
  //       const foundForm = forms.find((f: any) => f.id === formId)


  //       if (foundForm) {
  //         setForm(foundForm)
  //       } else {
  //         setError("Form not found")
  //       }
  //     } catch (error) {
  //       console.error("Error loading form:", error)
  //       setError("There was a problem loading the form")
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   loadForm()
  // }, [formId])

  const handleSubmit = (data: any) => {
    // In a real app, this would be an API call to save the form responses
    try {
      // Get existing responses or initialize empty array
      const formResponses = JSON.parse(localStorage.getItem(`triddle_responses_${formId}`) || "[]")

      // Add new response with timestamp
      const newResponse = {
        id: `resp_${Date.now()}`,
        formId,
        data,
        submittedAt: new Date().toISOString(),
      }

      // Save updated responses
      localStorage.setItem(`triddle_responses_${formId}`, JSON.stringify([...formResponses, newResponse]))

      toast({
        title: "Response submitted",
        description: "Thank you for completing this form!",
      })
    } catch (error) {
      console.error("Error saving response:", error)
      toast({
        title: "Error submitting response",
        description: "There was a problem submitting your response.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading form...</p>
        </div>
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Form Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "The form you're looking for doesn't exist or has been removed."}
          </p>
          <Button asChild className="animated-button">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <FormProvider>
      <FormRenderer form={form} onSubmit={handleSubmit} />
    </FormProvider>
  )
}

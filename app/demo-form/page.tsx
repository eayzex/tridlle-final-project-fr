"use client"

import { useState } from "react"
import { FormProvider } from "@/components/form-context"
import { FormRenderer } from "@/components/form-renderer"

// Mock form data
const demoForm = {
  id: "demo-form",
  title: "Demo Form",
  description: "This is a demo form to showcase Triddle's capabilities",
  questions: [
    {
      id: "q1",
      type: "text",
      title: "What's your name?",
      placeholder: "Type your full name",
      required: true,
    },
    {
      id: "q2",
      type: "email",
      title: "What's your email address?",
      placeholder: "name@example.com",
      required: true,
    },
    {
      id: "q3",
      type: "radio",
      title: "How did you hear about us?",
      options: [
        { id: "o1", label: "Social Media" },
        { id: "o2", label: "Friend or Colleague" },
        { id: "o3", label: "Search Engine" },
        { id: "o4", label: "Advertisement" },
      ],
      required: true,
    },
    {
      id: "q4",
      type: "textarea",
      title: "Do you have any feedback for us?",
      placeholder: "Your thoughts help us improve",
      required: false,
    },
  ],
}

export default function DemoFormPage() {
  const [formData, setFormData] = useState({})

  const handleSubmit = (data: any) => {
    console.log("Form submitted:", data)
    // In a real app, you would send this data to your backend
  }

  return (
    <FormProvider>
      <FormRenderer form={demoForm} onSubmit={handleSubmit} />
    </FormProvider>
  )
}

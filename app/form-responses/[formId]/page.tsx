"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Download, FileText, Calendar } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FormResponsesPage() {
  const params = useParams()
  const formId = params.formId as string
  const [form, setForm] = useState<any>(null)
  const [responses, setResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    // Load form and responses
    const loadData = () => {
      try {
        // Load form
        const forms = JSON.parse(localStorage.getItem("triddle_forms") || "[]")
        const foundForm = forms.find((f: any) => f.id === formId)

        if (!foundForm) {
          toast({
            title: "Form not found",
            description: "The form you're looking for doesn't exist.",
            variant: "destructive",
          })
          router.push("/dashboard")
          return
        }

        // Check if the form belongs to the current user
        if (foundForm.userId && foundForm.userId !== user?.id) {
          toast({
            title: "Access denied",
            description: "You don't have permission to access this form's responses.",
            variant: "destructive",
          })
          router.push("/dashboard")
          return
        }

        setForm(foundForm)

        // Load responses
        const formResponses = JSON.parse(localStorage.getItem(`triddle_responses_${formId}`) || "[]")
        setResponses(formResponses)
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error loading data",
          description: "There was a problem loading the form responses.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [formId, router, toast, user])

  // Format response data for display
  const formatResponseValue = (value: any, questionType: string) => {
    if (value === undefined || value === null || value === "") {
      return "—"
    }

    if (questionType === "radio" && form) {
      // Find the question
      const question = form.questions.find((q: any) => q.type === "radio")
      if (question) {
        // Find the option label
        const option = question.options.find((o: any) => o.id === value)
        return option ? option.label : value
      }
    }

    if (questionType === "checkbox" && Array.isArray(value)) {
      // Find the question
      const question = form.questions.find((q: any) => q.type === "checkbox")
      if (question) {
        // Map option IDs to labels
        return value
          .map((optionId: string) => {
            const option = question.options.find((o: any) => o.id === optionId)
            return option ? option.label : optionId
          })
          .join(", ")
      }
    }

    return String(value)
  }

  // Export responses as CSV
  const exportResponses = () => {
    if (!form || !responses.length) return

    // Create CSV header
    const headers = ["Submission Date", ...form.questions.map((q: any) => q.title)]

    // Create CSV rows
    const rows = responses.map((response: any) => {
      const date = new Date(response.submittedAt).toLocaleString()
      const values = form.questions.map((question: any) => {
        const value = response.data[question.id]
        return formatResponseValue(value, question.type)
      })
      return [date, ...values]
    })

    // Combine header and rows
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${form.title}_responses.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading responses...</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Form not found</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
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
            <Button
              variant="outline"
              className="animated-button-outline"
              onClick={exportResponses}
              disabled={responses.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{form.title} - Responses</h1>
            <p className="text-muted-foreground mt-2">
              {responses.length} {responses.length === 1 ? "response" : "responses"} received
            </p>
          </div>

          {responses.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No responses yet</CardTitle>
                <CardDescription>Share your form to start collecting responses.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Waiting for responses</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Your form is ready to collect responses. Share it with others to start receiving submissions.
                </p>
                <Button asChild className="animated-button">
                  <Link href={`/form-success/${formId}`}>Share Form</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="table">
              <TabsList className="mb-6">
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="individual">Individual Responses</TabsTrigger>
              </TabsList>

              <TabsContent value="table">
                <Card>
                  <CardHeader>
                    <CardTitle>All Responses</CardTitle>
                    <CardDescription>View all form submissions in a table format</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[180px]">Date</TableHead>
                            {form.questions.map((question: any) => (
                              <TableHead key={question.id}>{question.title}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {responses.map((response, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {new Date(response.submittedAt).toLocaleString()}
                              </TableCell>
                              {form.questions.map((question: any) => (
                                <TableCell key={question.id}>
                                  {formatResponseValue(response.data[question.id], question.type)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="individual">
                <div className="grid gap-6">
                  {responses.map((response, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Response #{index + 1}</CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-2 h-4 w-4" />
                            {new Date(response.submittedAt).toLocaleString()}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <dl className="grid gap-4">
                          {form.questions.map((question: any) => (
                            <div key={question.id} className="grid grid-cols-3 gap-4 py-2 border-b last:border-0">
                              <dt className="font-medium">{question.title}</dt>
                              <dd className="col-span-2">
                                {formatResponseValue(response.data[question.id], question.type)}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  )
}

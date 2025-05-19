"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Copy, ExternalLink, QrCode, Share2 } from "lucide-react"
import { FormPreview } from "@/components/form-preview"
import { useAuth } from "@/components/auth-provider"

export default function FormSuccessPage() {
  const params = useParams()
  const formId = params.formId as string
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  // Generate the shareable link
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const shareableLink = `${baseUrl}/form/${formId}`

  useEffect(() => {
    // In a real app, this would be an API call to get the form data
    const loadForm = () => {
      try {
        const forms = JSON.parse(localStorage.getItem("triddle_forms") || "[]")
        const foundForm = forms.find((f: any) => f.id === formId)

        if (foundForm) {
          // Check if the form belongs to the current user
          if (foundForm.userId && foundForm.userId !== user?.id) {
            toast({
              title: "Access denied",
              description: "You don't have permission to access this form.",
              variant: "destructive",
            })
            router.push("/dashboard")
            return
          }

          setForm(foundForm)
        } else {
          toast({
            title: "Form not found",
            description: "The form you're looking for doesn't exist.",
            variant: "destructive",
          })
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Error loading form:", error)
        toast({
          title: "Error loading form",
          description: "There was a problem loading your form.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadForm()
  }, [formId, router, toast, user])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink)
    setCopied(true)
    toast({
      title: "Link copied!",
      description: "The form link has been copied to your clipboard.",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your form...</p>
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
          <Button asChild className="animated-button">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container max-w-5xl">
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2">Your form is ready!</h1>
            <p className="text-muted-foreground">
              Your form has been created successfully. You can now share it with others.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Form Preview</CardTitle>
                  <CardDescription>This is how your form will appear to respondents</CardDescription>
                </CardHeader>
                <CardContent className="overflow-auto max-h-[600px]">
                  <FormPreview form={form} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Share Your Form</CardTitle>
                  <CardDescription>Get your form in front of respondents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="link">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="link">Link</TabsTrigger>
                      <TabsTrigger value="qr">QR Code</TabsTrigger>
                    </TabsList>
                    <TabsContent value="link" className="space-y-4">
                      <div className="p-3 bg-muted rounded-md text-sm break-all">{shareableLink}</div>
                      <div className="flex gap-2">
                        <Button onClick={copyToClipboard} className="flex-1 animated-button">
                          <Copy className="mr-2 h-4 w-4" />
                          {copied ? "Copied!" : "Copy Link"}
                        </Button>
                        <Button variant="outline" asChild className="animated-button-outline">
                          <a href={shareableLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">Open form</span>
                          </a>
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="qr" className="flex flex-col items-center justify-center space-y-4">
                      <div className="bg-white p-4 rounded-md">
                        <QrCode className="h-32 w-32" />
                      </div>
                      <Button variant="outline" className="animated-button-outline">
                        <Share2 className="mr-2 h-4 w-4" />
                        Download QR Code
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p>Form ID: {formId}</p>
                    <p>Created: {new Date(form.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Button variant="outline" asChild className="w-full animated-button-outline">
                    <Link href={`/dashboard/form-responses/${formId}`}>View Responses</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

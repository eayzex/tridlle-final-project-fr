"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, FileText, Settings, LogOut, User, ExternalLink, Share2, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function DashboardPage() {
  const [forms, setForms] = useState<any>()
  const [loading, setLoading] = useState(true)
  const [deleteFormId, setDeleteFormId] = useState<string | null>(null)
  const { toast } = useToast()
  const { user, logout } = useAuth()

  useEffect(() => {
    // Load forms from localStorage (in a real app, this would be an API call)
    const loadForms = () => {
      try {
        if (!user) return

        const allForms = JSON.parse(localStorage.getItem("triddle_forms") || "[]")
        // Filter forms to only show those created by the current user
        const userForms = allForms.filter((form: any) => form.userId === user.id)
        setForms(userForms)
      } catch (error) {
        console.error("Error loading forms:", error)
        toast({
          title: "Error loading forms",
          description: "There was a problem loading your forms.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadForms()
  }, [toast, user])

  const fetchFormsFromAPI = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/forms`, {
        method: "GET",
      })
      if (!response.ok) throw new Error("Failed to fetch forms")

      const data = await response.json()
      setForms(data)
    } catch (error) {
      console.error("Error fetching forms:", error)
      toast({
        title: "Error fetching forms",
        description: "There was a problem fetching your forms.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

   
  console.log("Forms:", forms?.data )
  useEffect(() => {    
    fetchFormsFromAPI();
  }, [user, toast]);

  const handleDeleteForm = (formId: string) => {
    try {
      const allForms = JSON.parse(localStorage.getItem("triddle_forms") || "[]")
      const updatedForms = allForms.filter((form: any) => form.id !== formId)
      localStorage.setItem("triddle_forms", JSON.stringify(updatedForms))

      // Update local state
      setForms(forms.filter((form) => form.id !== formId))

      toast({
        title: "Form deleted",
        description: "Your form has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting form:", error)
      toast({
        title: "Error deleting form",
        description: "There was a problem deleting your form.",
        variant: "destructive",
      })
    } finally {
      setDeleteFormId(null)
    }
  }

  const copyShareLink = (formId: string) => {
    const baseUrl = window.location.origin
    const shareableLink = `${baseUrl}/form/${formId}`

    navigator.clipboard.writeText(shareableLink)
    toast({
      title: "Link copied!",
      description: "The form link has been copied to your clipboard.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
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
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  <User className="mr-2 h-4 w-4" />
                  <span>{user?.name || "Profile"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Your Forms</h1>
            <Button asChild className="animated-button">
              <Link href="/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Form
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="bg-muted/50">
                    <div className="h-6 w-1/2 bg-muted animate-pulse rounded"></div>
                    <div className="h-4 w-1/3 bg-muted animate-pulse rounded"></div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="h-4 w-2/3 bg-muted animate-pulse rounded"></div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t bg-muted/20 p-4">
                    <div className="h-8 w-1/3 bg-muted animate-pulse rounded"></div>
                    <div className="h-8 w-1/3 bg-muted animate-pulse rounded"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : forms?.data?.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {forms?.data?.map((form : any, index : any) => (
                <motion.div
                  key={form.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Card className="overflow-hidden h-full flex flex-col">
                    <CardHeader className="bg-muted/50">
                      <CardTitle>{form.title}</CardTitle>
                      <CardDescription>{form.description || "No description"}</CardDescription>
                </CardHeader>
                    <CardContent className="pt-6 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span>{form.questions?.length || 0} questions</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(form.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t bg-muted/20 p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="animated-button-outline"
                        onClick={() => copyShareLink(form.id)}
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="animated-button-outline" asChild>
                          <Link href={`/form/${form._id}`} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">View Form</span>
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="animated-button-outline text-destructive hover:text-destructive"
                          onClick={() => setDeleteFormId(form.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete Form</span>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mt-16 text-center">
              <div className="mx-auto w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No forms yet</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                You haven't created any forms yet. Create your first form to start collecting responses.
              </p>
              <Button asChild className="animated-button">
                <Link href="/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Form
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <AlertDialog open={!!deleteFormId} onOpenChange={(open) => !open && setDeleteFormId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your form and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteFormId && handleDeleteForm(deleteFormId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

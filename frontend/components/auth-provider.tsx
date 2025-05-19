"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { authApi } from "@/lib/api"

type User = {
  id: string
  name: string
  email: string
  createdAt: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("triddle_token")
        if (token) {
          const response = await authApi.getMe()
          if (response.success) {
            setUser(response.user)
          } else {
            // Token is invalid, remove it
            localStorage.removeItem("triddle_token")
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Handle redirects based on auth status
  useEffect(() => {
    if (!isLoading) {
      const publicPaths = ["/login", "/signup", "/"]
      const isPublicPath = publicPaths.includes(pathname)

      if (!user && !isPublicPath) {
        // Redirect to login if not authenticated and trying to access protected route
        router.push("/login")
      } else if (user && (pathname === "/login" || pathname === "/signup")) {
        // Redirect to dashboard if already authenticated and trying to access login/signup
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authApi.login({ email, password })

      if (response.success) {
        // Store token in localStorage
        localStorage.setItem("triddle_token", response.token)
        setUser(response.user)

        toast({
          title: "Login successful",
          description: `Welcome back, ${response.user.name}!`,
        })

        router.push("/dashboard")
      } else {
        throw new Error(response.message || "Login failed")
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authApi.register({ name, email, password })

      if (response.success) {
        // Store token in localStorage
        localStorage.setItem("triddle_token", response.token)
        setUser(response.user)

        toast({
          title: "Account created",
          description: "Your account has been created successfully!",
        })

        router.push("/dashboard")
      } else {
        throw new Error(response.message || "Signup failed")
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("triddle_token")
    setUser(null)
    router.push("/login")
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

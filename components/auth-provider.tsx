"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

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
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("triddle_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
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
      // In a real app, this would be an API call to your auth endpoint
      const users = JSON.parse(localStorage.getItem("triddle_users") || "[]")
      const foundUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

      if (!foundUser) {
        throw new Error("Invalid email or password")
      }

      // Remove password before storing in state/localStorage
      const { password: _, ...userWithoutPassword } = foundUser

      // Store user in localStorage
      localStorage.setItem("triddle_user", JSON.stringify(userWithoutPassword))
      setUser(userWithoutPassword)

      toast({
        title: "Login successful",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      })

      router.push("/dashboard")
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
      // In a real app, this would be an API call to your auth endpoint
      const users = JSON.parse(localStorage.getItem("triddle_users") || "[]")

      // Check if user already exists
      const existingUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())
      if (existingUser) {
        throw new Error("Email already in use")
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        name,
        email,
        password, // In a real app, this would be hashed
        createdAt: new Date().toISOString(),
      }

      // Save to "database"
      localStorage.setItem("triddle_users", JSON.stringify([...users, newUser]))

      // Remove password before storing in state/localStorage
      const { password: _, ...userWithoutPassword } = newUser

      // Store user in localStorage
      localStorage.setItem("triddle_user", JSON.stringify(userWithoutPassword))
      setUser(userWithoutPassword)

      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      })

      router.push("/dashboard")
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
    localStorage.removeItem("triddle_user")
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

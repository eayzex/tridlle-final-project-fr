import { toast } from "@/components/ui/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper function to handle API errors
const handleApiError = (error: any) => {
  console.error("API Error:", error)

  let errorMessage = "An unexpected error occurred"

  if (error.response && error.response.data && error.response.data.message) {
    errorMessage = error.response.data.message
  } else if (error.message) {
    errorMessage = error.message
  }

  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  })

  return Promise.reject(error)
}

// Get token from localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("triddle_token")
  }
  return null
}

// API request function with authentication
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const config: RequestInit = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong")
    }

    return data
  } catch (error) {
    return handleApiError(error)
  }
}

// Auth API
export const authApi = {
  register: async (userData: any) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  login: async (credentials: any) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  },

  getMe: async () => {
    return apiRequest("/auth/me")
  },
}

// Forms API
export const formsApi = {
  createForm: async (formData: any) => {
    return apiRequest("/forms", {
      method: "POST",
      body: JSON.stringify(formData),
    })
  },

  getForms: async () => {
    return apiRequest("/forms")
  },

  getForm: async (id: string) => {
    return apiRequest(`/forms/${id}`)
  },

  updateForm: async (id: string, formData: any) => {
    return apiRequest(`/forms/${id}`, {
      method: "PUT",
      body: JSON.stringify(formData),
    })
  },

  deleteForm: async (id: string) => {
    return apiRequest(`/forms/${id}`, {
      method: "DELETE",
    })
  },

  getPublicForm: async (id: string) => {
    return apiRequest(`/forms/public/${id}`)
  },
}

// Responses API
export const responsesApi = {
  submitResponse: async (responseData: any) => {
    return apiRequest("/responses", {
      method: "POST",
      body: JSON.stringify(responseData),
    })
  },

  getResponses: async (formId: string) => {
    return apiRequest(`/responses/${formId}`)
  },

  getResponse: async (formId: string, responseId: string) => {
    return apiRequest(`/responses/${formId}/${responseId}`)
  },

  deleteResponse: async (formId: string, responseId: string) => {
    return apiRequest(`/responses/${formId}/${responseId}`, {
      method: "DELETE",
    })
  },
}

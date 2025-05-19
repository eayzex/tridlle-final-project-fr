"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export function PhoneLogin() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [step, setStep] = useState<"phone" | "verification">("phone")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { login } = useAuth()

  const validatePhoneNumber = (phone: string) => {
    // Basic validation - should be improved in a real app
    return phone.replace(/\D/g, "").length >= 10
  }

  const handleSendCode = async () => {
    setError(null)

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid phone number")
      return
    }

    setIsLoading(true)

    // In a real app, this would call an API to send a verification code
    // For demo purposes, we'll just simulate it
    setTimeout(() => {
      setIsLoading(false)
      setStep("verification")
      toast({
        title: "Verification code sent",
        description: `A verification code has been sent to ${phoneNumber}. For this demo, use code 123456.`,
      })
    }, 1500)
  }

  const handleVerifyCode = async () => {
    setError(null)

    if (!verificationCode || verificationCode.length < 6) {
      setError("Please enter a valid verification code")
      return
    }

    setIsLoading(true)

    // In a real app, this would verify the code with an API
    // For demo purposes, we'll accept a hardcoded code
    setTimeout(() => {
      setIsLoading(false)

      if (verificationCode === "123456") {
        // Log the user in with a demo account
        login("demo@triddle.com", "password123").catch(() => {
          setError("Authentication failed. Please try again.")
        })
      } else {
        setError("Invalid verification code. For this demo, use code 123456.")
      }
    }, 1500)
  }

  return (
    <div className="space-y-4">
      {step === "phone" ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <Button className="w-full animated-button" onClick={handleSendCode} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending code...
              </>
            ) : (
              "Send verification code"
            )}
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className={error ? "border-destructive" : ""}
              maxLength={6}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <p className="text-xs text-muted-foreground">For this demo, use code: 123456</p>
          </div>
          <Button className="w-full animated-button" onClick={handleVerifyCode} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify and sign in"
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full animated-button-outline"
            onClick={() => setStep("phone")}
            disabled={isLoading}
          >
            Back to phone number
          </Button>
        </>
      )}
    </div>
  )
}

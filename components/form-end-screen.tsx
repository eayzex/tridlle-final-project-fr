"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, Share2 } from "lucide-react"

type FormEndScreenProps = {
  formTitle: string
}

export function FormEndScreen({ formTitle }: FormEndScreenProps) {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center space-y-6 rounded-xl border bg-card p-8 text-center shadow-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="relative"
      >
        <div className="absolute -inset-4 rounded-full bg-primary/10 animate-pulse-slow"></div>
        <CheckCircle className="h-16 w-16 text-primary relative z-10" />
      </motion.div>

      <motion.h2 className="text-2xl font-bold" variants={itemVariants}>
        Thank you!
      </motion.h2>

      <motion.p className="text-muted-foreground" variants={itemVariants}>
        Your responses to "{formTitle}" have been submitted successfully.
      </motion.p>

      <motion.div className="flex flex-col sm:flex-row gap-3 pt-4 w-full" variants={itemVariants}>
        <Button asChild className="animated-button w-full">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Link>
        </Button>
        <Button variant="outline" className="animated-button-outline w-full">
          <Share2 className="mr-2 h-4 w-4" />
          Share this form
        </Button>
      </motion.div>
    </motion.div>
  )
}

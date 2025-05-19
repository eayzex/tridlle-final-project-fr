"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection({ isAuthenticated = false }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div
            className="flex flex-col justify-center space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="space-y-2" variants={itemVariants}>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Create beautiful forms that people love to fill
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Triddle makes form creation and completion a delightful experience with smooth animations and intuitive
                design.
              </p>
            </motion.div>
            <motion.div className="flex flex-col gap-2 min-[400px]:flex-row" variants={itemVariants}>
              {isAuthenticated ? (
                <>
                  <Button asChild size="lg" className="animated-button">
                    <Link href="/create">Create a form</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="animated-button-outline">
                    <Link href="/dashboard">View dashboard</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="animated-button">
                    <Link href="/signup">Get started for free</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="animated-button-outline">
                    <Link href="/login">Sign in</Link>
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            <div className="relative h-[350px] w-full max-w-[400px] overflow-hidden rounded-xl border bg-background p-4 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-50" />
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: "33%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <div className="flex flex-1 flex-col items-center justify-center space-y-6 p-6">
                  <motion.h3
                    className="text-2xl font-bold"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    What's your name?
                  </motion.h3>
                  <motion.div
                    className="w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    <input
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Type your answer here..."
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="w-full"
                  >
                    <Button className="w-full animated-button">Continue</Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

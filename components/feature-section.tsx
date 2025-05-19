"use client"

import { motion } from "framer-motion"
import { CheckCircle, Smartphone, Zap, Layers, Lock, BarChart } from "lucide-react"

export function FeatureSection() {
  const features = [
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: "Simple & Intuitive",
      description: "One question at a time for better focus and higher completion rates.",
    },
    {
      icon: <Smartphone className="h-10 w-10 text-primary" />,
      title: "Mobile-First Design",
      description: "Perfect experience on any device, especially optimized for mobile users.",
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Smooth Animations",
      description: "Delightful transitions and feedback that make forms enjoyable to fill.",
    },
    {
      icon: <Layers className="h-10 w-10 text-primary" />,
      title: "Drag & Drop Builder",
      description: "Create complex forms with our intuitive drag and drop interface.",
    },
    {
      icon: <Lock className="h-10 w-10 text-primary" />,
      title: "Secure Submissions",
      description: "All form data is encrypted and securely stored in our database.",
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: "Advanced Analytics",
      description: "Track completion rates and analyze user responses with detailed insights.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Why choose Triddle?</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Our form builder is designed with user experience at its core.
            </p>
          </motion.div>
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

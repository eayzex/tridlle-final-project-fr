"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for trying out Triddle",
      features: ["Up to 3 forms", "100 responses per month", "Basic analytics", "Email support"],
      popular: false,
    },
    {
      name: "Pro",
      price: "$19",
      description: "For professionals and small teams",
      features: [
        "Unlimited forms",
        "10,000 responses per month",
        "Advanced analytics",
        "Remove Triddle branding",
        "Priority support",
        "Custom domains",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$49",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Unlimited responses",
        "SSO authentication",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantees",
      ],
      popular: false,
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Simple, transparent pricing</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Choose the plan that's right for you and start creating amazing forms today.
            </p>
          </motion.div>
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 pt-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="flex"
              >
                <Card className={`flex flex-col w-full ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full animated-button ${!plan.popular ? "bg-muted hover:bg-muted/80 text-foreground" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.popular ? "Get Started" : "Try Free"}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

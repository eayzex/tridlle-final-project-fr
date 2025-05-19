"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export function TestimonialSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Triddle has transformed how we collect customer feedback. The completion rates have increased by 70% since we switched!",
      stars: 5,
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "Innovate Inc",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "The form builder is incredibly intuitive. We've created complex surveys in minutes that used to take hours.",
      stars: 5,
    },
    {
      name: "Jessica Williams",
      role: "Event Coordinator",
      company: "EventPro",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Our event registrations are now a breeze. Attendees love the smooth experience and we love the analytics.",
      stars: 4,
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">What our customers say</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Don't just take our word for it. Here's what people are saying about Triddle.
            </p>
          </motion.div>
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 pt-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-1 mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.stars ? "text-yellow-400 fill-yellow-400" : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="mb-2 italic">"{testimonial.content}"</p>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}, {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

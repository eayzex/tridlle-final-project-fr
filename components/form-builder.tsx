"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import {
  Plus,
  Trash2,
  Settings,
  Type,
  Mail,
  AlignLeft,
  CheckSquare,
  Circle,
  Calendar,
  Phone,
  GripVertical,
} from "lucide-react"

type FormBuilderProps = {
  questions: any[]
  onAddQuestion: (type: string) => void
  onUpdateQuestion: (index: number, question: any) => void
  onRemoveQuestion: (index: number) => void
}

export function FormBuilder({ questions, onAddQuestion, onUpdateQuestion, onRemoveQuestion }: FormBuilderProps) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [currentEditingQuestion, setCurrentEditingQuestion] = useState<any>(null)
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number | null>(null)

  const questionTypes = [
    { id: "text", label: "Short Text", icon: <Type className="h-4 w-4" /> },
    { id: "email", label: "Email", icon: <Mail className="h-4 w-4" /> },
    { id: "textarea", label: "Long Text", icon: <AlignLeft className="h-4 w-4" /> },
    { id: "radio", label: "Multiple Choice", icon: <Circle className="h-4 w-4" /> },
    { id: "checkbox", label: "Checkboxes", icon: <CheckSquare className="h-4 w-4" /> },
    { id: "date", label: "Date", icon: <Calendar className="h-4 w-4" /> },
    { id: "phone", label: "Phone Number", icon: <Phone className="h-4 w-4" /> },
  ]

  const handleQuestionClick = (index: number) => {
    setActiveQuestionIndex(index === activeQuestionIndex ? null : index)
  }

  const handleOpenSettings = (question: any, index: number) => {
    setCurrentEditingQuestion({ ...question })
    setCurrentEditingIndex(index)
    setShowSettingsDialog(true)
  }

  const handleSaveSettings = () => {
    if (currentEditingIndex !== null && currentEditingQuestion) {
      onUpdateQuestion(currentEditingIndex, currentEditingQuestion)
      setShowSettingsDialog(false)
    }
  }

  const handleAddOption = () => {
    if (
      currentEditingQuestion &&
      (currentEditingQuestion.type === "radio" || currentEditingQuestion.type === "checkbox")
    ) {
      const newOptions = [...(currentEditingQuestion.options || [])]
      newOptions.push({
        id: `o${newOptions.length + 1}`,
        label: `Option ${newOptions.length + 1}`,
      })
      setCurrentEditingQuestion({
        ...currentEditingQuestion,
        options: newOptions,
      })
    }
  }

  const handleUpdateOption = (index: number, value: string) => {
    if (
      currentEditingQuestion &&
      (currentEditingQuestion.type === "radio" || currentEditingQuestion.type === "checkbox")
    ) {
      const newOptions = [...(currentEditingQuestion.options || [])]
      newOptions[index] = {
        ...newOptions[index],
        label: value,
      }
      setCurrentEditingQuestion({
        ...currentEditingQuestion,
        options: newOptions,
      })
    }
  }

  const handleRemoveOption = (index: number) => {
    if (
      currentEditingQuestion &&
      (currentEditingQuestion.type === "radio" || currentEditingQuestion.type === "checkbox")
    ) {
      const newOptions = [...(currentEditingQuestion.options || [])]
      newOptions.splice(index, 1)
      setCurrentEditingQuestion({
        ...currentEditingQuestion,
        options: newOptions,
      })
    }
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update all questions with new order
    items.forEach((item, index) => {
      onUpdateQuestion(index, item)
    })
  }

  return (
    <div className="space-y-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              <AnimatePresence>
                {questions.map((question, index) => (
                  <Draggable key={question.id} draggableId={question.id} index={index}>
                    {(provided) => (
                      <motion.div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative"
                      >
                        <Card
                          className={`border ${activeQuestionIndex === index ? "border-primary" : ""}`}
                          onClick={() => handleQuestionClick(index)}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-2 text-muted-foreground hover:text-foreground"
                          >
                            <GripVertical className="h-5 w-5" />
                          </div>
                          <CardHeader className="pb-2 pl-10">
                            <CardTitle className="text-lg flex items-center">
                              {question.title}
                              {question.required && <span className="ml-1 text-destructive">*</span>}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pl-10">
                            {renderQuestionPreview(question)}

                            {activeQuestionIndex === index && (
                              <motion.div
                                className="flex justify-end gap-2 mt-4 border-t pt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenSettings(question, index)}
                                  className="animated-button-outline"
                                >
                                  <Settings className="mr-2 h-4 w-4" />
                                  Settings
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => onRemoveQuestion(index)}
                                  className="animated-button-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </Button>
                              </motion.div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </AnimatePresence>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="animated-button">
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            {questionTypes.map((type) => (
              <DropdownMenuItem key={type.id} onClick={() => onAddQuestion(type.id)} className="cursor-pointer">
                <div className="mr-2">{type.icon}</div>
                <span>{type.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Question Settings</DialogTitle>
            <DialogDescription>Customize your question settings here.</DialogDescription>
          </DialogHeader>

          {currentEditingQuestion && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="questionTitle">Question Text</Label>
                <Input
                  id="questionTitle"
                  value={currentEditingQuestion.title}
                  onChange={(e) =>
                    setCurrentEditingQuestion({
                      ...currentEditingQuestion,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              {(currentEditingQuestion.type === "text" ||
                currentEditingQuestion.type === "email" ||
                currentEditingQuestion.type === "textarea" ||
                currentEditingQuestion.type === "phone" ||
                currentEditingQuestion.type === "date") && (
                <div className="space-y-2">
                  <Label htmlFor="placeholder">Placeholder Text</Label>
                  <Input
                    id="placeholder"
                    value={currentEditingQuestion.placeholder || ""}
                    onChange={(e) =>
                      setCurrentEditingQuestion({
                        ...currentEditingQuestion,
                        placeholder: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              {(currentEditingQuestion.type === "radio" || currentEditingQuestion.type === "checkbox") && (
                <div className="space-y-3">
                  <Label>Options</Label>
                  {currentEditingQuestion.options?.map((option: any, index: number) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <Input value={option.label} onChange={(e) => handleUpdateOption(index, e.target.value)} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOption(index)}
                        disabled={currentEditingQuestion.options.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={handleAddOption} className="animated-button-outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Option
                  </Button>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="required"
                  checked={currentEditingQuestion.required || false}
                  onCheckedChange={(checked) =>
                    setCurrentEditingQuestion({
                      ...currentEditingQuestion,
                      required: checked,
                    })
                  }
                />
                <Label htmlFor="required">Required question</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettingsDialog(false)} className="animated-button-outline">
              Cancel
            </Button>
            <Button onClick={handleSaveSettings} className="animated-button">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function renderQuestionPreview(question: any) {
  switch (question.type) {
    case "text":
    case "email":
    case "phone":
      return (
        <Input
          type={question.type}
          placeholder={question.placeholder || `Enter ${question.type}`}
          disabled
          className="max-w-md bg-muted/50"
        />
      )
    case "textarea":
      return (
        <Textarea
          placeholder={question.placeholder || "Enter your answer"}
          disabled
          className="max-w-md h-20 bg-muted/50"
        />
      )
    case "radio":
      return (
        <div className="space-y-2">
          {question.options?.map((option: any) => (
            <div key={option.id} className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full border border-primary/50" />
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )
    case "checkbox":
      return (
        <div className="space-y-2">
          {question.options?.map((option: any) => (
            <div key={option.id} className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-sm border border-primary/50" />
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )
    case "date":
      return <Input type="date" disabled className="max-w-md bg-muted/50" />
    default:
      return null
  }
}

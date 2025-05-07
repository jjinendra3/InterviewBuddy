import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FeedbackSectionProps {
  feedback: {
    communicationFeedback: string
    technicalFeedback: string
    problemSolvingFeedback: string
    behavioralFeedback: string
    overallFeedback: string
  }
}

export function FeedbackSection({ feedback }: FeedbackSectionProps) {
  const feedbackItems = [
    {
      title: "Communication Skills",
      content: feedback.communicationFeedback,
      icon: "💬",
    },
    {
      title: "Technical Knowledge",
      content: feedback.technicalFeedback,
      icon: "💻",
    },
    {
      title: "Problem Solving Ability",
      content: feedback.problemSolvingFeedback,
      icon: "🧩",
    },
    {
      title: "Behavioral Competence",
      content: feedback.behavioralFeedback,
      icon: "🤝",
    },
    {
      title: "Overall Impression",
      content: feedback.overallFeedback,
      icon: "⭐",
    },
  ]

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-rose-800 text-xl">Detailed Feedback</CardTitle>
        <CardDescription className="text-amber-700">Comprehensive assessment of each evaluation area</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {feedbackItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-amber-200">
              <AccordionTrigger className="text-amber-900 hover:text-rose-700">
                <span className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-amber-800 whitespace-pre-line">{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

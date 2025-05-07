import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LightbulbIcon } from "lucide-react"

interface RecommendationsSectionProps {
  recommendations: string[]
}

export function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-rose-800 text-xl">Recommendations</CardTitle>
        <CardDescription className="text-amber-700">
          Actionable suggestions for improvement and next steps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
              <LightbulbIcon className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <span className="text-amber-800">{recommendation}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

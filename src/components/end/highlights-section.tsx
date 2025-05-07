import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface HighlightsSectionProps {
  highlights: {
    topStrengths: string[];
    improvementAreas: string[];
  };
}

export function HighlightsSection({ highlights }: HighlightsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-white/90 backdrop-blur-sm border-emerald-200 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-emerald-800 text-xl flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            Top Strengths
          </CardTitle>
          <CardDescription className="text-emerald-700">
            Areas where the candidate excelled
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {highlights.topStrengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-1">+</span>
                <span className="text-emerald-800">{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-amber-800 text-xl flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Areas for Improvement
          </CardTitle>
          <CardDescription className="text-amber-700">
            Opportunities for growth and development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {highlights.improvementAreas.map((area, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold mt-1">△</span>
                <span className="text-amber-800">{area}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

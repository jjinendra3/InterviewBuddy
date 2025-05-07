import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, ArrowRight, Lightbulb } from "lucide-react";

interface KeyMomentsSectionProps {
  keyMoments: {
    question: string;
    responseEvaluation: string;
    improvementSuggestion: string;
  }[];
}

export function KeyMomentsSection({ keyMoments }: KeyMomentsSectionProps) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-rose-800 text-xl">
          Key Interview Moments
        </CardTitle>
        <CardDescription className="text-amber-700">
          Significant questions and responses from the interview
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {keyMoments.map((moment, index) => (
            <div
              key={index}
              className="border border-amber-200 rounded-lg overflow-hidden"
            >
              <div className="bg-amber-50 p-4 border-b border-amber-200">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-rose-800">Question</h4>
                    <p className="text-amber-900 mt-1">{moment.question}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-b border-amber-200">
                <div className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-800">
                      Response Evaluation
                    </h4>
                    <p className="text-amber-700 mt-1">
                      {moment.responseEvaluation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-800">
                      Improvement Suggestion
                    </h4>
                    <p className="text-amber-700 mt-1">
                      {moment.improvementSuggestion}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
